@extends('layouts.app')

@section('content')
<div class="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">🙍‍♂️ Profil Saya</h1>

    @if(session('success'))
        <div class="mb-4 p-3 bg-green-100 text-green-800 rounded">
            {{ session('success') }}
        </div>
    @endif

    <form action="{{ route('profile.update') }}" method="POST" class="space-y-4">
        @csrf

        <div>
            <label class="block text-gray-700 font-semibold">Nama</label>
            <input type="text" name="name" value="{{ old('name', $user->name) }}"
                   class="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>

        <div>
            <label class="block text-gray-700 font-semibold">Email</label>
            <input type="email" name="email" value="{{ old('email', $user->email) }}"
                   class="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>

        <div>
            <label class="block text-gray-700 font-semibold">Password Baru (Opsional)</label>
            <input type="password" name="password"
                   class="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>

        <div>
            <label class="block text-gray-700 font-semibold">Konfirmasi Password</label>
            <input type="password" name="password_confirmation"
                   class="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>

        <button type="submit"
                class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            💾 Simpan Perubahan
        </button>
    </form>
</div>
@endsection
