@extends('layouts.app')

@section('content')
<div class="container">
    <h1>👥 Manajemen User</h1>
    <nav>
        <a href="{{ route('dashboard') }}">🏠 Dashboard</a> |
        <a href="{{ route('users.create') }}">➕ Tambah User</a>
    </nav>

    <table border="1" cellpadding="10" cellspacing="0">
        <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th>Dibuat Pada</th>
        </tr>
        @foreach($users as $user)
        <tr>
            <td>{{ $user->name }}</td>
            <td>{{ $user->email }}</td>
            <td>{{ $user->role->name ?? 'No Role' }}</td>
            <td>{{ $user->created_at->format('d M Y') }}</td>
        </tr>
        @endforeach
    </table>
</div>
@endsection
