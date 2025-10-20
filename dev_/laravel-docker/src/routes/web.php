<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\DashboardController as DC;

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

   // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Artikel CRUD
    Route::resource('articles', App\Http\Controllers\ArticleController::class);

    // User Management
    Route::get('/users', [DashboardController::class, 'users'])->name('users.index');
    Route::get('/users/create', [DashboardController::class, 'createUser'])->name('users.create');
    Route::post('/users', [DashboardController::class, 'storeUser'])->name('users.store');
});

require __DIR__.'/auth.php';
