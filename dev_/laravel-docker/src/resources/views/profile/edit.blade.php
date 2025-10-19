@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Edit Profil</h1>

    @if (session('status'))
        <p style="color: green;">{{ session('status') }}</p>
    @endif

    <form method="POST" action="{{ route('profile.update') }}">
        @csrf
        @method('PATCH')

        <label>Nama:</label><br>
        <input type="text" name="name" value="{{ old('name', $user->name) }}"><br><br>

        <label>Email:</label><br>
        <input type="email" name="email" value="{{ old('email', $user->email) }}"><br><br>

        <button type="submit">Simpan Perubahan</button>
    </form>

    <hr>
    <form method="POST" action="{{ route('profile.destroy') }}">
        @csrf
        @method('DELETE')
        <button type="submit" style="color: red;">Hapus Akun</button>
    </form>
</div>
@endsection

