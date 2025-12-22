<?php

namespace App\Http\Controllers;

use App\Models\HasilSaw;
use App\Models\Kriteria;
use App\Models\Penilaian;
use App\Models\PeriodePenilaian;
use App\Models\User;
use Illuminate\Http\Request;

class SawController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('role:super_admin,admin,hr');
    }

    /**
     * Tampilkan halaman utama perhitungan SAW
     */
    public function index()
    {
        $periodes = PeriodePenilaian::latest()->get();
        return view('saw.index', compact('periodes'));
    }

    /**
     * Proses perhitungan SAW untuk periode tertentu
     */
    public function calculate(Request $request)
    {
        $request->validate([
            'periode_id' => 'required|exists:periode_penilaians,id'
        ]);

        $periodeId = $request->periode_id;
        
        // Ambil semua kriteria aktif
        $kriterias = Kriteria::active()->get();
        
        if ($kriterias->isEmpty()) {
            return back()->with('error', 'Tidak ada kriteria aktif. Silakan tambahkan kriteria terlebih dahulu.');
        }

        // Cek apakah total bobot = 1
        $totalBobot = $kriterias->sum('bobot');
        if (abs($totalBobot - 1) > 0.0001) {
            return back()->with('error', 'Total bobot kriteria harus sama dengan 1. Saat ini: ' . $totalBobot);
        }

        // Ambil semua karyawan yang dinilai pada periode ini
        $karyawans = User::whereHas('penilaianSebagaiKaryawan', function($query) use ($periodeId) {
            $query->where('periode_penilaian_id', $periodeId);
        })->get();

        if ($karyawans->isEmpty()) {
            return back()->with('error', 'Tidak ada karyawan yang dinilai pada periode ini.');
        }

        $hasilSaw = [];

        // Untuk setiap karyawan, hitung nilai SAW
        foreach ($karyawans as $karyawan) {
            $nilaiSaw = $this->calculateSawForEmployee($karyawan->id, $periodeId, $kriterias);
            $hasilSaw[] = [
                'karyawan_id' => $karyawan->id,
                'karyawan' => $karyawan,
                'nilai_preferensi' => $nilaiSaw['nilai_preferensi'],
                'detail' => $nilaiSaw['detail']
            ];
        }

        // Urutkan berdasarkan nilai preferensi (tertinggi ke terendah)
        usort($hasilSaw, function($a, $b) {
            return $b['nilai_preferensi'] <=> $a['nilai_preferensi'];
        });

        // Simpan hasil ke database dengan ranking
        $this->saveHasilSaw($hasilSaw, $periodeId);

        return redirect()->route('saw.hasil', ['periode_id' => $periodeId])
            ->with('success', 'Perhitungan SAW berhasil dilakukan.');
    }

    /**
     * Hitung nilai SAW untuk satu karyawan
     */
    private function calculateSawForEmployee($karyawanId, $periodeId, $kriterias)
    {
        $matrikKeputusan = [];
        $detail = [];

        // Ambil semua penilaian karyawan untuk periode ini
        // Only consider approved penilaian for SAW
        $penilaians = Penilaian::where('karyawan_id', $karyawanId)
            ->where('periode_penilaian_id', $periodeId)
            ->where('status', 'approved')
            ->with('kriteria', 'subKriteria')
            ->get();

        // Susun matriks keputusan per kriteria
        foreach ($kriterias as $kriteria) {
            $penilaian = $penilaians->where('kriteria_id', $kriteria->id)->first();
            
            if ($penilaian) {
                // Prefer sub-kriteria nilai if present, otherwise use numeric nilai field
                $value = optional($penilaian->subKriteria)->nilai ?? ($penilaian->nilai ?? 0);
                $matrikKeputusan[$kriteria->id] = $value;
                $detail[$kriteria->nama_kriteria] = [
                    'nilai_asli' => $value,
                    'bobot' => $kriteria->bobot,
                    'jenis' => $kriteria->jenis_kriteria
                ];
            } else {
                // Jika tidak ada penilaian, beri nilai 0
                $matrikKeputusan[$kriteria->id] = 0;
                $detail[$kriteria->nama_kriteria] = [
                    'nilai_asli' => 0,
                    'bobot' => $kriteria->bobot,
                    'jenis' => $kriteria->jenis_kriteria
                ];
            }
        }

        // Normalisasi matriks
        $matrikNormalisasi = $this->normalizeMatrix($matrikKeputusan, $kriterias, $periodeId);
        
        // Hitung nilai preferensi
        $nilaiPreferensi = 0;
        foreach ($kriterias as $kriteria) {
            $nilaiNormalisasi = $matrikNormalisasi[$kriteria->id];
            $nilaiTerbobot = $nilaiNormalisasi * $kriteria->bobot;
            $nilaiPreferensi += $nilaiTerbobot;
            
            $detail[$kriteria->nama_kriteria]['nilai_normalisasi'] = $nilaiNormalisasi;
            $detail[$kriteria->nama_kriteria]['nilai_terbobot'] = $nilaiTerbobot;
        }

        return [
            'nilai_preferensi' => $nilaiPreferensi,
            'detail' => $detail
        ];
    }

    /**
     * Normalisasi matriks keputusan
     */
    private function normalizeMatrix($matrikKeputusan, $kriterias, $periodeId)
    {
        $matrikNormalisasi = [];

        foreach ($kriterias as $kriteria) {
            // Ambil semua nilai untuk kriteria ini dari semua penilaian pada periode ini
            // only approved penilaian contribute to normalization
            $penilaianRecords = Penilaian::where('periode_penilaian_id', $periodeId)
                ->where('kriteria_id', $kriteria->id)
                ->where('status', 'approved')
                ->with('subKriteria')
                ->get();

            // Map to numeric values: prefer subKriteria.nilai, fallback to numeric nilai
            $nilaiKriteria = $penilaianRecords->map(function($p) {
                return optional($p->subKriteria)->nilai ?? ($p->nilai ?? 0);
            })->toArray();

            if (empty($nilaiKriteria)) {
                $matrikNormalisasi[$kriteria->id] = 0;
                continue;
            }

            if ($kriteria->jenis_kriteria === 'benefit') {
                // Untuk kriteria benefit: nilai / max(nilai)
                $maxNilai = max($nilaiKriteria);
                $matrikNormalisasi[$kriteria->id] = $maxNilai > 0 ? 
                    $matrikKeputusan[$kriteria->id] / $maxNilai : 0;
            } else {
                // Untuk kriteria cost: min(nilai) / nilai
                $minNilai = min($nilaiKriteria);
                $matrikNormalisasi[$kriteria->id] = $matrikKeputusan[$kriteria->id] > 0 ? 
                    $minNilai / $matrikKeputusan[$kriteria->id] : 0;
            }
        }

        return $matrikNormalisasi;
    }

    /**
     * Simpan hasil perhitungan SAW ke database
     */
    private function saveHasilSaw($hasilSaw, $periodeId)
    {
        // Hapus hasil sebelumnya untuk periode ini
        HasilSaw::where('periode_penilaian_id', $periodeId)->delete();

        // Simpan hasil baru dengan ranking
        foreach ($hasilSaw as $index => $hasil) {
            HasilSaw::create([
                'karyawan_id' => $hasil['karyawan_id'],
                'periode_penilaian_id' => $periodeId,
                'nilai_preferensi' => $hasil['nilai_preferensi'],
                'ranking' => $index + 1,
                'detail_perhitungan' => $hasil['detail']
            ]);
        }
    }

    /**
     * Tampilkan hasil perhitungan SAW
     */
    public function hasil(Request $request)
    {
        $periodeId = $request->get('periode_id');
        
        if (!$periodeId) {
            return redirect()->route('saw.index')
                ->with('error', 'Periode tidak ditemukan.');
        }

        $periode = PeriodePenilaian::findOrFail($periodeId);
        $hasilSaw = HasilSaw::where('periode_penilaian_id', $periodeId)
            ->with('karyawan')
            ->orderByRanking()
            ->get();

        return view('saw.hasil', compact('periode', 'hasilSaw'));
    }

    /**
     * Export hasil SAW ke Excel/PDF
     */
    public function export(Request $request)
    {
        $periodeId = $request->get('periode_id');
        $format = $request->get('format', 'excel');

        // Implementation untuk export
        // Bisa menggunakan package seperti Laravel Excel atau TCPDF
        
        return back()->with('info', 'Fitur export akan segera tersedia.');
    }
}
