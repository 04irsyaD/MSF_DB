<?php

namespace App\Http\Controllers;

use App\Models\HasilSaw;
use App\Models\PeriodePenilaian;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $user = $request->user();
        // Load periodes and determine selected periode (query param or latest)
        $periodes = PeriodePenilaian::latest()->get();
        $latestPeriode = $periodes->first();
        $selectedPeriode = null;
        $periodeId = $request->get('periode_id');
        if ($periodeId) {
            $selectedPeriode = $periodes->firstWhere('id', $periodeId);
        }
        if (!$selectedPeriode) {
            $selectedPeriode = $latestPeriode;
        }

        // If user is super_admin or admin show top performers for selected periode
        if (in_array($user->role, ['super_admin', 'admin'])) {
            $top = collect();
            if ($selectedPeriode) {
                $top = HasilSaw::where('periode_penilaian_id', $selectedPeriode->id)
                    ->with('karyawan')
                    ->orderBy('ranking', 'asc')
                    ->limit(10)
                    ->get();
                // debug log to help verify data is loaded in runtime
                \Log::info('Dashboard: top_performers count='.$top->count().' for periode_id='.$selectedPeriode->id);
            }

            // compute trend (avg nilai preferensi) for last 6 periodes (global)
            $trend_labels = [];
            $trend_values = [];
            $lastPeriodes = PeriodePenilaian::latest()->take(6)->get()->reverse();
            foreach ($lastPeriodes as $p) {
                $trend_labels[] = $p->nama_periode;
                $avg = HasilSaw::where('periode_penilaian_id', $p->id)->avg('nilai_preferensi');
                $trend_values[] = $avg ? (float)$avg : 0.0;
                // compute top-3 average for this periode
                $top3 = HasilSaw::where('periode_penilaian_id', $p->id)
                    ->orderBy('ranking','asc')
                    ->limit(3)
                    ->pluck('nilai_preferensi')
                    ->toArray();
                $trend_top3[] = count($top3) ? array_sum($top3)/count($top3) : 0.0;
            }

            // pending approvals for approvers
            $pendingCount = \App\Models\Penilaian::where('status','pending')->count();

            return view('dashboard.index', [
                'kriteria_count' => \App\Models\Kriteria::count(),
                'user_count' => User::where('role','karyawan')->count(),
                'selectedPeriode' => $selectedPeriode,
                'periodes' => $periodes,
                'top_performers' => $top,
                'pending_count' => $pendingCount,
                'trend_labels' => $trend_labels,
                'trend_values' => $trend_values,
            ]);
        }

        // If user is a supervisor, show top performers within their department
        if ($user->role === 'supervisor') {
            $top = collect();
            if ($selectedPeriode) {
                $top = HasilSaw::where('periode_penilaian_id', $selectedPeriode->id)
                    ->whereHas('karyawan', function ($q) use ($user) {
                        $q->where('department', $user->department)->where('role','karyawan');
                    })
                    ->with('karyawan')
                    ->orderBy('ranking', 'asc')
                    ->limit(10)
                    ->get();
            }

            // trend per department
            $trend_labels = [];
            $trend_values = [];
            $lastPeriodes = PeriodePenilaian::latest()->take(6)->get()->reverse();
            foreach ($lastPeriodes as $p) {
                $trend_labels[] = $p->nama_periode;
                $avg = HasilSaw::where('periode_penilaian_id', $p->id)
                    ->whereHas('karyawan', function ($q) use ($user) {
                        $q->where('department', $user->department)->where('role','karyawan');
                    })->avg('nilai_preferensi');
                $trend_values[] = $avg ? (float)$avg : 0.0;
                // top-3 average within department
                $top3 = HasilSaw::where('periode_penilaian_id', $p->id)
                    ->whereHas('karyawan', function ($q) use ($user) {
                        $q->where('department', $user->department)->where('role','karyawan');
                    })
                    ->orderBy('ranking','asc')
                    ->limit(3)
                    ->pluck('nilai_preferensi')
                    ->toArray();
                $trend_top3[] = count($top3) ? array_sum($top3)/count($top3) : 0.0;
            }

            return view('dashboard.index', [
                'kriteria_count' => \App\Models\Kriteria::count(),
                'user_count' => User::where('role','karyawan')->where('department', $user->department)->count(),
                'selectedPeriode' => $selectedPeriode,
                'periodes' => $periodes,
                'top_performers' => $top,
                'department' => $user->department,
                'trend_labels' => $trend_labels,
                'trend_values' => $trend_values,
                'pending_count' => \App\Models\Penilaian::where('status','pending')->whereHas('karyawan', function($q) use ($user){ $q->where('department',$user->department); })->count(),
            ]);
        }

        // If user is HR show list of employees (period selection still available)
        if ($user->role === 'hr') {
            $users = User::where('role', 'karyawan')->paginate(20);
            // compute global trend for HR view
            $trend_labels = [];
            $trend_values = [];
            $lastPeriodes = PeriodePenilaian::latest()->take(6)->get()->reverse();
            foreach ($lastPeriodes as $p) {
                $trend_labels[] = $p->nama_periode;
                $avg = HasilSaw::where('periode_penilaian_id', $p->id)->avg('nilai_preferensi');
                $trend_values[] = $avg ? (float)$avg : 0.0;
            }

            return view('dashboard.index', [
                'kriteria_count' => \App\Models\Kriteria::count(),
                'user_count' => User::where('role','karyawan')->count(),
                'selectedPeriode' => $selectedPeriode,
                'periodes' => $periodes,
                'top_performers' => collect(),
                'users' => $users,
                'trend_labels' => $trend_labels,
                'trend_values' => $trend_values,
            ]);
        }

        // Default: show personal results if any for selected periode
        $personal = null;
        if ($selectedPeriode) {
            $personal = HasilSaw::where('periode_penilaian_id', $selectedPeriode->id)
                ->where('karyawan_id', $user->id)
                ->with('karyawan')
                ->first();
        }

        // Default: compute trend for personal (last periodes)
        $trend_labels = [];
        $trend_values = [];
        $lastPeriodes = PeriodePenilaian::latest()->take(6)->get()->reverse();
            foreach ($lastPeriodes as $p) {
                $trend_labels[] = $p->nama_periode;
                $entry = HasilSaw::where('periode_penilaian_id', $p->id)->where('karyawan_id', $user->id)->first();
                $trend_values[] = $entry ? (float)$entry->nilai_preferensi : 0;
                // top-3 average (global)
                $top3 = HasilSaw::where('periode_penilaian_id', $p->id)
                    ->orderBy('ranking','asc')
                    ->limit(3)
                    ->pluck('nilai_preferensi')
                    ->toArray();
                $trend_top3[] = count($top3) ? array_sum($top3)/count($top3) : 0.0;
            }

            return view('dashboard.index', [
                'kriteria_count' => \App\Models\Kriteria::count(),
                'user_count' => User::where('role','karyawan')->count(),
                'selectedPeriode' => $selectedPeriode,
                'periodes' => $periodes,
                'top_performers' => $personal ? collect([$personal]) : collect(),
                'personal' => $personal,
                'trend_labels' => $trend_labels,
                'trend_values' => $trend_values,
                'trend_top3' => $trend_top3,
                'pending_count' => 0,
            ]);
    }
}
