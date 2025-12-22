<?php

namespace App\Http\Controllers;

use App\Models\HasilSaw;
use Illuminate\Http\Request;

class HasilSawController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // List hasil saw entries (by periode)
    public function index(Request $request)
    {
        $periodeId = $request->get('periode_id');
        $user = auth()->user();

        // Base query
        $query = HasilSaw::with('karyawan', 'periodePenilaian')->orderBy('ranking','asc');

        // If periode specified, filter
        if ($periodeId) {
            $query->where('periode_penilaian_id', $periodeId);
        }

        // If karyawan, only show their own results
        if ($user->role === 'karyawan') {
            $query->where('karyawan_id', $user->id);
        }

        // If supervisor, restrict to karyawan in supervisor's department
        if ($user->role === 'supervisor') {
            $query->whereHas('karyawan', function ($q) use ($user) {
                $q->where('department', $user->department);
            });
        }

        $results = $query->paginate(20);

        return view('saw.index', compact('results'));
    }

    /**
     * Show a single HasilSaw detail.
     */
    public function show($id)
    {
        $hasil = HasilSaw::with('karyawan', 'periodePenilaian')->findOrFail($id);

        $user = auth()->user();

        // Allow super_admin/admin/hr or owner karyawan
        if (in_array($user->role, ['super_admin', 'admin', 'hr'])) {
            // allowed
        } elseif ($user->role === 'supervisor') {
            // allowed only if the karyawan is in supervisor's department
            if ($hasil->karyawan->department !== $user->department) {
                abort(403);
            }
        } elseif ($hasil->karyawan_id !== $user->id) {
            abort(403);
        }

        return view('saw.detail', compact('hasil'));
    }

    /**
     * Show authenticated karyawan's hasil history.
     */
    public function myResults(Request $request)
    {
        $user = $request->user();
        $periodeId = $request->get('periode_id');

        $query = HasilSaw::with('karyawan', 'periodePenilaian')
            ->where('karyawan_id', $user->id)
            ->orderBy('ranking','asc');

        if ($periodeId) {
            $query->where('periode_penilaian_id', $periodeId);
        }

        $results = $query->paginate(20);

        return view('saw.index', compact('results'));
    }

    /**
     * Export hasil as CSV for a periode. HR/Admin/SuperAdmin can export across all; supervisors export department only.
     */
    public function export(Request $request)
    {
        $this->middleware('auth');

        $user = $request->user();
        $periodeId = $request->get('periode_id');

        $query = HasilSaw::with('karyawan', 'periodePenilaian')->orderBy('ranking','asc');
        if ($periodeId) {
            $query->where('periode_penilaian_id', $periodeId);
        }

        // supervisors limited to department
        if ($user->role === 'supervisor') {
            $dept = $user->department;
            $query->whereHas('karyawan', function ($q) use ($dept) {
                $q->where('department', $dept);
            });
        }

        $rows = $query->get();

        $format = $request->get('format', 'csv');

        $filenameBase = 'hasil_saw_' . ($periodeId ?? 'all');

        // Prepare simple rows array
        $simple = [];
        foreach ($rows as $r) {
            $simple[] = [
                $r->karyawan->name ?? '',
                $r->karyawan->employee_id ?? '',
                $r->karyawan->department ?? '',
                optional($r->periodePenilaian)->nama_periode ?? '',
                number_format($r->nilai_preferensi,6),
                $r->ranking
            ];
        }

        if ($format === 'excel') {
            // Export XLSX using Laravel-Excel
            try {
                return \Maatwebsite\Excel\Excel::download(new \App\Exports\HasilSawsExport($simple), $filenameBase . '.xlsx');
            } catch (\Throwable $e) {
                // If package not installed, fall back to CSV
                // continue to csv
            }
        }

        if ($format === 'pdf') {
            try {
                $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.hasil_pdf', ['rows' => $simple, 'periode' => optional($rows->first()?->periodePenilaian)->nama_periode ?? '']);
                return $pdf->download($filenameBase . '.pdf');
            } catch (\Throwable $e) {
                // fall back to csv
            }
        }

        // Default: CSV streaming
        $filename = $filenameBase . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($simple) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Karyawan','Employee ID','Department','Periode','Nilai Preferensi','Ranking']);
            foreach ($simple as $line) {
                fputcsv($out, $line);
            }
            fclose($out);
        };

        return response()->stream($callback, 200, $headers);
    }
}
