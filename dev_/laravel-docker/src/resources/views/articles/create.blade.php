<!DOCTYPE html>
<html>
<head>
    <title>Upload PDF</title>
</head>
<body>
    <h1>Upload Artikel (PDF)</h1>

    <form method="POST" action="{{ route('articles.store') }}" enctype="multipart/form-data">
        @csrf
        <label>Judul:</label><br>
        <input type="text" name="title"><br><br>

        <label>Komentar (opsional):</label><br>
        <textarea name="content"></textarea><br><br>

        <label>File PDF:</label><br>
        <input type="file" name="pdf" accept="application/pdf"><br><br>

    <button type="submit">Upload</button>
</form>


    <a href="{{ route('articles.index') }}">Kembali</a>
</body>
</html>
