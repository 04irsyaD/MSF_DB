<!DOCTYPE html>
<html>
<head>
    <title>Upload PDF</title>
</head>
<body>
    <h1>Upload Artikel (PDF)</h1>

    @if ($errors->any())
        <div style="color: red;">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('articles.store') }}" enctype="multipart/form-data">
        @csrf
        <label>Judul:</label><br>
        <input type="text" name="title" value="{{ old('title') }}" required><br><br>

        <label>Kategori:</label><br>
        <select name="category_id" required>
            <option value="">Pilih Kategori</option>
            @foreach($categories as $category)
                <option value="{{ $category->id }}" {{ old('category_id') == $category->id ? 'selected' : '' }}>
                    {{ $category->name }}
                </option>
            @endforeach
        </select><br><br>

        <label>Level:</label><br>
        <select name="level" required>
            <option value="">Pilih Level</option>
            @foreach($levels as $value => $label)
                <option value="{{ $value }}" {{ old('level') == $value ? 'selected' : '' }}>
                    {{ $label }}
                </option>
            @endforeach
        </select><br><br>

        <label>Komentar (opsional):</label><br>
        <textarea name="content">{{ old('content') }}</textarea><br><br>

        <label>File PDF:</label><br>
        <input type="file" name="pdf" accept="application/pdf" required><br><br>

        <button type="submit">Upload</button>
    </form>

    <a href="{{ route('articles.index') }}">Kembali</a>
</body>
</html>
