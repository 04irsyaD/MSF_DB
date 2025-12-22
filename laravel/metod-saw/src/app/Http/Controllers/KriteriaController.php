<?php

namespace App\Http\Controllers;

use App\Models\Kriteria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class KriteriaController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('role:super_admin,admin')->except(['index', 'show']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kriterias = Kriteria::with('subKriterias')->get();
        return view('kriteria.index', compact('kriterias'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('kriteria.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'kode_kriteria' => 'required|string|max:10|unique:kriterias,kode_kriteria',
            'nama_kriteria' => 'required|string|max:255',
            'jenis_kriteria' => 'required|in:benefit,cost',
            'bobot' => 'required|numeric|min:0|max:1',
            'deskripsi' => 'nullable|string'
        ]);

        // Cek total bobot tidak melebihi 1
        $totalBobotExisting = Kriteria::where('is_active', true)
            ->where('id', '!=', $request->id ?? 0)
            ->sum('bobot');
        
        if (($totalBobotExisting + $request->bobot) > 1) {
            return back()->withErrors([
                'bobot' => 'Total bobot semua kriteria tidak boleh melebihi 1. Sisa bobot: ' . (1 - $totalBobotExisting)
            ])->withInput();
        }

        Kriteria::create([
            'kode_kriteria' => $request->kode_kriteria,
            'nama_kriteria' => $request->nama_kriteria,
            'jenis_kriteria' => $request->jenis_kriteria,
            'bobot' => $request->bobot,
            'deskripsi' => $request->deskripsi,
            'is_active' => true
        ]);

        return redirect()->route('kriteria.index')
            ->with('success', 'Kriteria berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Kriteria $kriteria)
    {
        $kriteria->load('subKriterias');
        return view('kriteria.show', compact('kriteria'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kriteria $kriteria)
    {
        return view('kriteria.edit', compact('kriteria'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kriteria $kriteria)
    {
        $request->validate([
            'kode_kriteria' => 'required|string|max:10|unique:kriterias,kode_kriteria,' . $kriteria->id,
            'nama_kriteria' => 'required|string|max:255',
            'jenis_kriteria' => 'required|in:benefit,cost',
            'bobot' => 'required|numeric|min:0|max:1',
            'deskripsi' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        // Cek total bobot tidak melebihi 1
        $totalBobotExisting = Kriteria::where('is_active', true)
            ->where('id', '!=', $kriteria->id)
            ->sum('bobot');
        
        if (($totalBobotExisting + $request->bobot) > 1) {
            return back()->withErrors([
                'bobot' => 'Total bobot semua kriteria tidak boleh melebihi 1. Sisa bobot: ' . (1 - $totalBobotExisting)
            ])->withInput();
        }

        $kriteria->update([
            'kode_kriteria' => $request->kode_kriteria,
            'nama_kriteria' => $request->nama_kriteria,
            'jenis_kriteria' => $request->jenis_kriteria,
            'bobot' => $request->bobot,
            'deskripsi' => $request->deskripsi,
            'is_active' => $request->has('is_active')
        ]);

        return redirect()->route('kriteria.index')
            ->with('success', 'Kriteria berhasil diupdate.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kriteria $kriteria)
    {
        if ($kriteria->penilaians()->count() > 0) {
            return back()->with('error', 'Kriteria tidak dapat dihapus karena sudah digunakan untuk penilaian.');
        }

        $kriteria->delete();

        return redirect()->route('kriteria.index')
            ->with('success', 'Kriteria berhasil dihapus.');
    }

    /**
     * Show bulk edit form for kriteria bobot (only super_admin)
     */
    public function editBobot()
    {
        $user = auth()->user();
        if (!$user || !$user->isSuperAdmin()) {
            abort(403, 'Anda tidak memiliki akses untuk mengubah bobot.');
        }

        $kriterias = Kriteria::orderBy('id')->get();
        return view('kriteria.bobot', compact('kriterias'));
    }

    /**
     * Update bobot kriteria secara massal
     */
    public function updateBobot(Request $request)
    {
        $user = auth()->user();
        if (!$user || !$user->isSuperAdmin()) {
            abort(403, 'Anda tidak memiliki akses untuk mengubah bobot.');
        }

        $data = $request->validate([
            'bobot' => 'required|array',
            'bobot.*' => 'nullable|numeric|min:0|max:1'
        ]);

        $bobotInputs = $data['bobot'];

        // Normalize: null -> 0, cast to float
        $normalized = [];
        foreach ($bobotInputs as $id => $val) {
            $normalized[$id] = $val === null || $val === '' ? 0.0 : (float) $val;
        }

        $total = array_sum($normalized);
        if (abs($total - 1) > 0.0001) {
            return back()->with('error', 'Total bobot semua kriteria harus sama dengan 1. Saat ini: ' . $total)->withInput();
        }

        DB::transaction(function () use ($normalized) {
            foreach ($normalized as $id => $value) {
                Kriteria::where('id', $id)->update(['bobot' => $value]);
            }
        });

        return redirect()->route('kriteria.index')->with('success', 'Bobot kriteria berhasil diupdate.');
    }
}
