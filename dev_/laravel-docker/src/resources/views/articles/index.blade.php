@extends('layouts.app')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-semibold">Manajemen Artikel</h1>
        <a href="{{ route('articles.create') }}" class="bg-blue-600 text-white px-3 py-1 rounded">Tambah Artikel</a>
    </div>

    <!-- reuse tabel yang mirip dashboard -->
    <div class="overflow-x-auto">
        <table class="w-full">
            <thead><tr class="bg-gray-50"><th class="p-2 border">Judul</th><th class="p-2 border">Aksi</th></tr></thead>
            <tbody>
                @foreach($articles as $article)
                <tr class="hover:bg-gray-50">
                    <td class="p-2 border">{{ $article->title }}</td>
                    <td class="p-2 border">
                        <a href="{{ route('articles.edit', $article) }}" class="text-yellow-600 mr-2">Edit</a>
                        <form action="{{ route('articles.destroy', $article) }}" method="POST" class="inline">
                            @csrf
                            @method('DELETE')
                            <button class="text-red-600" type="submit">Hapus</button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection
