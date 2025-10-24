@extends('layouts.app')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-semibold">Manajemen Artikel</h1>
        @if(auth()->user()->canCreateArticle())
            <a href="{{ route('articles.create') }}" class="bg-blue-600 text-white px-3 py-1 rounded">Tambah Artikel</a>
        @endif
    </div>

    <!-- reuse tabel yang mirip dashboard -->
    <div class="overflow-x-auto">
        <table class="w-full">
            <thead><tr class="bg-gray-50"><th class="p-2 border">Judul</th><th class="p-2 border">Kategori</th><th class="p-2 border">Level</th><th class="p-2 border">Penulis</th><th class="p-2 border">Aksi</th></tr></thead>
            <tbody>
                @foreach($articles as $article)
                <tr class="hover:bg-gray-50">
                    <td class="p-2 border">{{ $article->title }}</td>
                    <td class="p-2 border">
                        <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {{ $article->category->name ?? 'No Category' }}
                        </span>
                    </td>
                    <td class="p-2 border">
                        <span class="{{ $article->level_badge_color }} text-xs font-medium px-2.5 py-0.5 rounded">
                            {{ $article->level_label }}
                        </span>
                    </td>
                    <td class="p-2 border">{{ $article->user->name ?? 'Unknown' }}</td>
                    <td class="p-2 border">
                        <a href="{{ route('articles.show', $article) }}" class="text-blue-600 mr-2">Lihat</a>
                        @if(auth()->user()->canEditArticle($article))
                            <a href="{{ route('articles.edit', $article) }}" class="text-yellow-600 mr-2">Edit</a>
                        @endif
                        @if(auth()->user()->canDeleteArticle($article))
                            <form action="{{ route('articles.destroy', $article) }}" method="POST" class="inline">
                                @csrf
                                @method('DELETE')
                                <button class="text-red-600" type="submit" onclick="return confirm('Yakin hapus artikel ini?')">Hapus</button>
                            </form>
                        @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    {{ $articles->links() }}
</div>
@endsection
