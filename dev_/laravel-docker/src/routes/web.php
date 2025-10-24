<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ArticleController;

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile routes - semua role bisa akses
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Articles - view untuk semua role
    Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
    Route::get('/articles/{article}', [ArticleController::class, 'show'])->name('articles.show');

    // Articles CRUD - hanya admin dan penulis
    Route::middleware(['role:admin,penulis'])->group(function () {
        Route::get('/articles/create', [ArticleController::class, 'create'])->name('articles.create');
        Route::post('/articles', [ArticleController::class, 'store'])->name('articles.store');
        Route::get('/articles/{article}/edit', [ArticleController::class, 'edit'])->name('articles.edit');
        Route::patch('/articles/{article}', [ArticleController::class, 'update'])->name('articles.update');
        Route::delete('/articles/{article}', [ArticleController::class, 'destroy'])->name('articles.destroy');
    });

    // User Management - hanya admin
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/users', [DashboardController::class, 'users'])->name('users.index');
        Route::get('/users/create', [DashboardController::class, 'createUser'])->name('users.create');
        Route::post('/users', [DashboardController::class, 'storeUser'])->name('users.store');
    });
});

require __DIR__.'/auth.php';