<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Feedback;
use App\Models\HasilSaw;

class FeedbackController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // Employees submit feedback for a hasil
    public function store(Request $request, $hasilId)
    {
        $user = $request->user();
        $hasil = HasilSaw::findOrFail($hasilId);

        // Only the karyawan themselves or supervisors/hr can add feedback for that hasil
        if ($user->role === 'karyawan' && $hasil->karyawan_id !== $user->id) {
            abort(403);
        }

        $validated = $request->validate([
            'message' => 'required|string|max:2000'
        ]);

        $fb = Feedback::create([
            'hasil_saw_id' => $hasil->id,
            'user_id' => $user->id,
            'message' => $validated['message']
        ]);

        return back()->with('status', 'Feedback submitted.');
    }

    // List feedbacks (super_admin/admin/hr see all; supervisor sees department)
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Feedback::with('user','hasil');

        if ($user->role === 'supervisor') {
            // scope to hasil whose karyawan in supervisor's department
            $dept = $user->department;
            $query->whereHas('hasil.karyawan', function ($q) use ($dept) {
                $q->where('department', $dept);
            });
        }

        $feedbacks = $query->orderBy('created_at','desc')->paginate(20);
        return view('feedbacks.index', compact('feedbacks'));
    }
}
