<?php

namespace App\Http\Controllers;

use App\Models\Penilaian;
use App\Models\PeriodePenilaian;
use App\Models\Kriteria;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class PenilaianController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // List penilaian entries grouped by karyawan / periode
    public function index(Request $request)
    {
        $periodes = PeriodePenilaian::latest()->get();
        $periodeId = $request->get('periode_id');
        $user = auth()->user();

        $query = Penilaian::with(['karyawan', 'kriteria', 'periodePenilaian']);

        // Filter by periode if provided
        if ($periodeId) {
            $query->where('periode_penilaian_id', $periodeId);
        }

        // Karyawan: only see their own penilaian
        if ($user->role === 'karyawan') {
            $query->where('karyawan_id', $user->id);
        }

        // Supervisor: only see penilaian for employees in their department
        if ($user->role === 'supervisor') {
            $query->whereHas('karyawan', function ($q) use ($user) {
                $q->where('department', $user->department);
            });
        }

        $penilaians = $query->orderBy('karyawan_id')->paginate(30);

        return view('penilaian.index', compact('penilaians', 'periodes'));
    }

    // Show form to input penilaian (bulk per kriteria for one karyawan)
    public function create()
    {
        $periodes = PeriodePenilaian::latest()->get();
        $user = auth()->user();

        // Choose which karyawan the current user can assess
        $karyawanQuery = User::where('role','karyawan')->where('is_active', true);
        if ($user->role === 'supervisor') {
            $karyawanQuery->where('department', $user->department);
        }
        $karyawan = $karyawanQuery->get();
        $kriterias = Kriteria::active()->orderBy('id')->get();

        return view('penilaian.create', compact('periodes','karyawan','kriterias'));
    }

    // Store penilaian entries (bulk upsert per kriteria)
    public function store(Request $request)
    {
        $data = $request->validate([
            'periode_penilaian_id' => 'required|exists:periode_penilaians,id',
            'karyawan_id' => 'required|exists:users,id',
            'nilai' => 'nullable|array',
            'nilai.*' => 'nullable|numeric|min:0',
            'sub_kriteria' => 'nullable|array',
            'sub_kriteria.*' => 'nullable|exists:sub_kriterias,id'
        ]);

        $penilaiId = auth()->id();
        $periodeId = $data['periode_penilaian_id'];
        $karyawanId = $data['karyawan_id'];

        $user = auth()->user();

        // Permission checks: only super_admin and hr may input penilaian
        if (!in_array($user->role, ['super_admin','hr'])) {
            abort(403, 'Anda tidak memiliki izin untuk menginput penilaian.');
        }

        // If the authenticated user is supervisor, they are not allowed to input (they are approvers)
        if ($user->role === 'supervisor') {
            abort(403, 'Supervisor tidak diperbolehkan menginput penilaian.');
        }

        // handle values provided as sub_kriteria selection preferentially
        $subs = $data['sub_kriteria'] ?? [];
        foreach ($subs as $kriteriaId => $subId) {
            if (!$subId) continue;
            // try to get the sub value
            $sub = \App\Models\SubKriteria::find($subId);
            if (!$sub) continue;

            Penilaian::updateOrCreate(
                [
                    'karyawan_id' => $karyawanId,
                    'periode_penilaian_id' => $periodeId,
                    'kriteria_id' => $kriteriaId
                ],
                [
                    'sub_kriteria_id' => $sub->id,
                    'nilai' => $sub->nilai,
                    'penilai_id' => $penilaiId,
                    'catatan' => $request->input('catatan_'.$kriteriaId),
                    'status' => 'pending',
                    'approved_by' => null,
                    'approved_at' => null,
                    'approval_note' => null
                ]
            );
        }

        // fallback: numeric inputs per kriteria
        $nums = $data['nilai'] ?? [];
        foreach ($nums as $kriteriaId => $nilai) {
            if ($nilai === null || $nilai === '') continue;
            // if we already set via sub_kriteria, skip
            if (isset($subs[$kriteriaId]) && $subs[$kriteriaId]) continue;

            Penilaian::updateOrCreate(
                [
                    'karyawan_id' => $karyawanId,
                    'periode_penilaian_id' => $periodeId,
                    'kriteria_id' => $kriteriaId
                ],
                [
                    'nilai' => $nilai,
                    'penilai_id' => $penilaiId,
                    'catatan' => $request->input('catatan_'.$kriteriaId),
                    'status' => 'pending',
                    'approved_by' => null,
                    'approved_at' => null,
                    'approval_note' => null
                ]
            );
        }

        // After saving penilaian, attempt to recalculate SAW for the periode
        try {
            $sawRequest = new \Illuminate\Http\Request();
            $sawRequest->replace(['periode_id' => $periodeId]);
            $sawController = new \App\Http\Controllers\SawController();
            $sawController->calculate($sawRequest);
            return redirect()->route('penilaian.index')->with('success', 'Penilaian disimpan dan SAW dihitung ulang.');
        } catch (\Throwable $e) {
            // Log error and return with warning so user can run SAW manually
            \Log::error('SAW recalculation failed after penilaian store: '.$e->getMessage());
            return redirect()->route('penilaian.index')->with('success', 'Penilaian disimpan. Namun perhitungan SAW gagal: '.$e->getMessage());
        }
    }

    // List pending penilaian for approvers
    public function pending(Request $request)
    {
        $user = auth()->user();
        if (!in_array($user->role, ['super_admin','supervisor'])) {
            abort(403);
        }

        $query = Penilaian::with(['karyawan','kriteria','periodePenilaian']);
        // if the status column exists, filter for pending; otherwise return none to avoid showing all
        if (Schema::hasColumn('penilaians', 'status')) {
            $query->where('status','pending');
        } else {
            $query->whereRaw('1=0');
        }

        // Supervisors only see their department
        if ($user->role === 'supervisor') {
            $query->whereHas('karyawan', function($q) use ($user) {
                $q->where('department', $user->department);
            });
        }

        $penilaians = $query->orderBy('created_at')->paginate(30);
        return view('penilaian.pending', compact('penilaians'));
    }

    public function approve($id, Request $request)
    {
        $user = auth()->user();
        if (!in_array($user->role, ['super_admin','supervisor'])) abort(403);

        $p = Penilaian::findOrFail($id);
        $payload = [
            'approved_by' => $user->id,
            'approved_at' => now(),
        ];
        if (Schema::hasColumn('penilaians','status')) {
            $payload['status'] = 'approved';
        }
        if (Schema::hasColumn('penilaians','approval_note')) {
            $payload['approval_note'] = $request->input('note');
        }
        $p->update($payload);

        // Optionally recalc SAW for the periode after approval
        try {
            $sawRequest = new \Illuminate\Http\Request();
            $sawRequest->replace(['periode_id' => $p->periode_penilaian_id]);
            (new \App\Http\Controllers\SawController())->calculate($sawRequest);
        } catch (\Throwable $e) {
            \Log::warning('SAW recalculation after approval failed: '.$e->getMessage());
        }

        return back()->with('success','Penilaian disetujui.');
    }

    public function reject($id, Request $request)
    {
        $user = auth()->user();
        if (!in_array($user->role, ['super_admin','supervisor'])) abort(403);

        $p = Penilaian::findOrFail($id);
        $payload = [
            'approved_by' => $user->id,
            'approved_at' => now(),
        ];
        if (Schema::hasColumn('penilaians','status')) {
            $payload['status'] = 'rejected';
        }
        if (Schema::hasColumn('penilaians','approval_note')) {
            $payload['approval_note'] = $request->input('note');
        }
        $p->update($payload);

        return back()->with('success','Penilaian ditandai ditolak.');
    }
}
