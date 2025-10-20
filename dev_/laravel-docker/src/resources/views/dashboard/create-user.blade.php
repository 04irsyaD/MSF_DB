@extends('layouts.app')

@section('content')
<div class="container">
    <h1>➕ Tambah User Baru</h1>
    <form method="POST" action="{{ route('users.store') }}">
        @csrf
        <label>Nama:</label><br>
        <input type="text" name="name"><br><br>

        <label>Email:</label><br>
        <input type="email" name="email"><br><br>

        <label>Password:</label><br>
        <input type="password" name="password"><br><br>

        <label>Konfirmasi Password:</label><br>
        <input type="password" name="password_confirmation"><br><br>

        <button type="submit">Simpan</button>
    </form>
</div>
@endsection
