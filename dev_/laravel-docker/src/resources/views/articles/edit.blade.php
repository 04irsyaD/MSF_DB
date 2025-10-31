<!DOCTYPE html>
<html>
<head>
    <title>Edit PDF</title>
</head>
<body>
    <h1>Edit Artikel PDF</h1>

    @if ($errors->any())
        <div style="color: red;">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('articles.update', $article->id) }}" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        <label>Judul:</label><br>
        <input type="text" name="title" value="{{ old('title', $article->title) }}" required><br><br>

        <label>Kategori:</label><br>
        <select name="category_id" required>
            <option value="">Pilih Kategori</option>
            @foreach($categories as $category)
                <option value="{{ $category->id }}" {{ (old('category_id', $article->category_id) == $category->id) ? 'selected' : '' }}>
                    {{ $category->name }}
                </option>
            @endforeach
        </select><br><br>

        <label>Level:</label><br>
        <select name="level" required>
            <option value="">Pilih Level</option>
            @foreach($levels as $value => $label)
                <option value="{{ $value }}" {{ (old('level', $article->level) == $value) ? 'selected' : '' }}>
                    {{ $label }}
                </option>
            @endforeach
        </select><br><br>

        <label>Komentar (opsional):</label><br>
        <textarea name="content">{{ old('content', $article->content) }}</textarea><br><br>

        <label>File PDF (upload baru jika ingin ganti):</label><br>
        <input type="file" name="pdf" accept="application/pdf"><br><br>

        @if ($article->pdf_path)
            <p>PDF Saat ini: <a href="{{ asset('storage/' . $article->pdf_path) }}" target="_blank">Lihat PDF</a></p>
        @endif

        <button type="submit">Update</button>
    </form>

    <a href="{{ route('articles.index') }}">Kembali</a>
</body>
</html>
