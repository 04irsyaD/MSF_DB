@extends('layouts.app')

@section('content')
<div class="container">
    <h1>➕ Tambah User Baru</h1>
    <form method="POST" action="{{ route('users.store') }}">
        @csrf
        <label>Nama:</label><br>
        <input type="text" name="name" required><br><br>

        <label>Email:</label><br>
        <input type="email" name="email" required><br><br>

        <label>Role:</label><br>
        <select name="role_id" required>
            <option value="">Pilih Role</option>
            @foreach($roles as $role)
                <option value="{{ $role->id }}">{{ ucfirst($role->name) }} - {{ $role->description }}</option>
            @endforeach
        </select><br><br>

        <label>Password:</label><br>
        <input type="password" name="password" required><br><br>

        <label>Konfirmasi Password:</label><br>
        <input type="password" name="password_confirmation" required><br><br>

        <button type="submit">Simpan</button>
    </form>
</div>
@endsection
