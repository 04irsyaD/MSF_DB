@extends('layouts.app')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <h1 class="text-2xl font-bold mb-4">📋 Daftar Artikel</h1>

    <div class="mb-4 flex justify-end">
        <a href="{{ route('articles.create') }}" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Tambah Artikel</a>
    </div>

    <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50">
                <tr>
                    <th class="p-3 border">Judul</th>
                    <th class="p-3 border">Komentar</th>
                    <th class="p-3 border">PDF</th>
                    <th class="p-3 border">Dibuat</th>
                </tr>
            </thead>
            <tbody>
                @forelse($articles as $article)
                <tr class="hover:bg-gray-50">
                    <td class="p-3 border">{{ $article->title }}</td>
                    <td class="p-3 border">{{ $article->content ?? '-' }}</td>
                    <td class="p-3 border">
                        @if($article->pdf_path)
                            <a href="{{ asset('storage/'.$article->pdf_path) }}" target="_blank" class="text-blue-600 hover:underline">Lihat PDF</a>
                        @else
                            -
                        @endif
                    </td>
                    <td class="p-3 border text-sm text-gray-600">{{ $article->created_at->format('d M Y H:i') }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="4" class="p-4 text-center text-gray-500">Belum ada artikel.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
