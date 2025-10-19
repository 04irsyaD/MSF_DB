<!DOCTYPE html>
<html>
<head>
    <title>Edit PDF</title>
</head>
<body>
    <h1>Edit Artikel PDF</h1>

    <form method="POST" action="{{ route('articles.update', $article->id) }}" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        <label>Judul:</label><br>
        <input type="text" name="title" value="{{ $article->title }}"><br><br>

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
