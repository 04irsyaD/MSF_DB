<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DashboardController extends Controller
{
    // Halaman utama dashboard
    public function index()
    {
        $articles = Article::latest()->get();
        return view('dashboard.index', compact('articles'));
    }

    // List user
    public function users()
    {
        $users = User::with('role')->latest()->get();
        return view('dashboard.users', compact('users'));
    }

    // Form create user
    public function createUser()
    {
        $roles = \App\Models\Role::all();
        return view('dashboard.create-user', compact('roles'));
    }

    // Simpan user baru
    public function storeUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'role_id' => 'required|exists:roles,id',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id,
        ]);

        return redirect()->route('users.index')->with('success', 'User baru berhasil dibuat!');
    }
}
