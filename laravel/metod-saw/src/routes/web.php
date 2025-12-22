<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KriteriaController;
use App\Http\Controllers\SawController;
use App\Models\Kriteria;
use App\Http\Controllers\HasilSawController;

Route::get('/', function () {
    return view('welcome');
});


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

// Simple login page and handler (minimal, for development/testing)
Route::get('/login', function () {
    return view('auth.login');
})->name('login');

Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => ['required','email'],
        'password' => ['required']
    ]);

    $remember = $request->filled('remember');

    if (Auth::attempt($credentials, $remember)) {
        $request->session()->regenerate();
        return redirect()->intended(route('dashboard'));
    }

    return back()->withErrors(['email' => 'Email atau password salah'])->withInput();
});

// Logout route - ensure POST /logout is handled and redirects to login
Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect()->route('login');
})->name('logout');

Route::get('/register', function () {
    return redirect()->route('kriteria.bobot.demo');
})->name('register');

// Dev-only: auto-login as Super Admin for local development convenience
Route::get('/dev/login-as-superadmin', function () {
    // Only available in local environment or when app debug is enabled
    if (!app()->environment('local') && !config('app.debug')) {
        abort(404);
    }

    // Find existing super admin or create a fallback one
    $user = User::where('role', 'super_admin')->first();
    if (!$user) {
        $user = User::create([
            'name' => 'Dev Super Admin',
            'email' => 'dev-superadmin@saw.test',
            'password' => bcrypt('password'),
            'role' => 'super_admin',
            'employee_id' => 'DEV001',
            'department' => 'Dev',
            'position' => 'Developer',
            'phone' => '081000000000',
            'hire_date' => now(),
            'is_active' => true
        ]);
    }

    Auth::login($user);
    request()->session()->regenerate();

    return redirect()->route('dashboard');
})->name('dev.login_as_superadmin');

// Dashboard - role aware
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PenilaianController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DepartmentController;

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->name('dashboard')
    ->middleware('auth');

// Resource routes for Kriteria (index, create, store, show, edit, update, destroy)
Route::resource('kriteria', KriteriaController::class);

// Hasil SAW detail (accessible to owner and admins/hr)
Route::get('/saw/hasil/{id}', [HasilSawController::class, 'show'])
    ->name('saw.detail')
    ->middleware('auth');

// Hasil SAW list
Route::get('/hasil', [HasilSawController::class, 'index'])
    ->name('hasil.index')
    ->middleware('auth');

// Feedback routes
use App\Http\Controllers\FeedbackController;

Route::post('/hasil/{id}/feedback', [FeedbackController::class, 'store'])
    ->name('hasil.feedback.store')
    ->middleware(['auth']);

Route::get('/feedbacks', [FeedbackController::class, 'index'])
    ->name('feedbacks.index')
    ->middleware(['auth','role:super_admin,admin,hr,supervisor']);

// Penilaian routes (index, create placeholder)
Route::get('/penilaian', [PenilaianController::class, 'index'])
    ->name('penilaian.index')
    ->middleware(['auth','role:super_admin,admin,hr,supervisor']);

// Only super_admin and hr may create/store penilaian input
Route::get('/penilaian/create', [PenilaianController::class, 'create'])
    ->name('penilaian.create')
    ->middleware(['auth','role:super_admin,hr']);

Route::post('/penilaian', [PenilaianController::class, 'store'])
    ->name('penilaian.store')
    ->middleware(['auth','role:super_admin,hr']);

// Approval routes - only supervisors and super_admin may approve/reject
Route::get('/penilaian/pending', [PenilaianController::class, 'pending'])
    ->name('penilaian.pending')
    ->middleware(['auth','role:super_admin,supervisor']);

Route::post('/penilaian/{id}/approve', [PenilaianController::class, 'approve'])
    ->name('penilaian.approve')
    ->middleware(['auth','role:super_admin,supervisor']);

Route::post('/penilaian/{id}/reject', [PenilaianController::class, 'reject'])
    ->name('penilaian.reject')
    ->middleware(['auth','role:super_admin,supervisor']);

// User management for super_admin
Route::resource('users', UserController::class)
    ->except(['show'])
    ->middleware(['auth', 'role:super_admin']);

// Department management — only super_admin can manage departments
Route::resource('departments', DepartmentController::class)
    ->middleware(['auth','role:super_admin']);

// Bulk actions for users (delete/enable/disable)
Route::post('/users/bulk', [UserController::class, 'bulk'])
    ->name('users.bulk')
    ->middleware(['auth', 'role:super_admin']);

// Route to trigger SAW calculation (only admin/super_admin)
Route::post('/saw/calculate', [SawController::class, 'calculate'])
    ->name('saw.calculate')
    ->middleware(['auth', 'role:super_admin,admin,hr']);

// Show hasil SAW for a periode (list) - route used after calculation
Route::get('/saw/hasil', [SawController::class, 'hasil'])
    ->name('saw.hasil')
    ->middleware(['auth', 'role:super_admin,admin,hr,supervisor']);

// My results - for karyawan to view their personal hasil history
Route::get('/my/results', [HasilSawController::class, 'myResults'])
    ->name('my.results')
    ->middleware(['auth','role:karyawan']);

// Export hasil (CSV) - HR/Admin/Super Admin can export; supervisors limited to their department
Route::get('/hasil/export', [HasilSawController::class, 'export'])
    ->name('hasil.export')
    ->middleware(['auth','role:super_admin,admin,hr,supervisor']);

// Halaman untuk edit bobot kriteria (bulk) - hanya super_admin
Route::get('/kriteria/bobot', [KriteriaController::class, 'editBobot'])
    ->name('kriteria.bobot.edit')
    ->middleware(['auth', 'role:super_admin,hr']);

Route::post('/kriteria/bobot', [KriteriaController::class, 'updateBobot'])
    ->name('kriteria.bobot.update')
    ->middleware(['auth', 'role:super_admin,hr']);

// Development/demo route (UNPROTECTED) to view bobot form without auth.
// Remove or protect this in production.
Route::get('/demo/kriteria/bobot', function () {
    $kriterias = Kriteria::orderBy('id')->get();
    return view('kriteria.bobot', compact('kriterias'));
})->name('kriteria.bobot.demo');
