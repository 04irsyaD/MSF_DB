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
        $users = User::latest()->get();
        return view('dashboard.users', compact('users'));
    }

    // Form create user
    public function createUser()
    {
        return view('dashboard.create-user');
    }

    // Simpan user baru
    public function storeUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('users.index')->with('success', 'User baru berhasil dibuat!');
    }
}
