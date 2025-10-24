<!DOCTYPE html>
<html>
<head>
    <title>{{ $article->title }}</title>
</head>
<body>
    <h1>{{ $article->title }}</h1>
    
    <div style="margin: 20px 0;">
        <p><strong>Kategori:</strong> 
            <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                {{ $article->category->name ?? 'No Category' }}
            </span>
        </p>
        <p><strong>Level:</strong> 
            <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; 
                @if($article->level == 'pemula') background-color: #dcfce7; color: #166534;
                @elseif($article->level == 'menengah') background-color: #fef3c7; color: #92400e;
                @else background-color: #fee2e2; color: #991b1b; @endif">
                {{ $article->level_label }}
            </span>
        </p>
        <p><strong>Penulis:</strong> {{ $article->user->name ?? 'Unknown' }}</p>
        <p><strong>Dibuat:</strong> {{ $article->created_at->format('d M Y H:i') }}</p>
    </div>

    @if($article->content)
        <div style="margin: 20px 0;">
            <h3>Deskripsi:</h3>
            <p>{{ $article->content }}</p>
        </div>
    @endif

    @if($article->pdf_path)
        <div style="margin: 20px 0;">
            <h3>File PDF:</h3>
            <a href="{{ asset('storage/'.$article->pdf_path) }}" target="_blank" style="color: #2563eb; text-decoration: underline;">
                📄 Buka PDF
            </a>
        </div>
    @endif

    <div style="margin-top: 30px;">
        <a href="{{ route('articles.index') }}" style="background-color: #6b7280; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px;">
            ← Kembali ke Daftar Artikel
        </a>
        
        @if(auth()->user()->canEditArticle($article))
            <a href="{{ route('articles.edit', $article) }}" style="background-color: #f59e0b; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; margin-left: 10px;">
                ✏️ Edit
            </a>
        @endif
    </div>
</body>
</html>