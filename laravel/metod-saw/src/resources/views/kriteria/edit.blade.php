@extends('layouts.dashboard')

@section('title','Edit Kriteria')

@section('content')
<div class="container-fluid">
    <div class="card p-3">
        <h5 class="mb-3">Edit Kriteria</h5>

        @if($errors->any())
            <div class="alert alert-danger">
                <ul class="mb-0">
                    @foreach($errors->all() as $err)
                        <li>{{ $err }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form action="{{ route('kriteria.update', $kriteria) }}" method="POST">
            @csrf
            @method('PUT')

            <div class="row g-3">
                <div class="col-md-4">
                    <label class="form-label">Kode Kriteria</label>
                    <input type="text" name="kode_kriteria" class="form-control" value="{{ old('kode_kriteria', $kriteria->kode_kriteria) }}" required maxlength="10">
                </div>
                <div class="col-md-8">
                    <label class="form-label">Nama Kriteria</label>
                    <input type="text" name="nama_kriteria" class="form-control" value="{{ old('nama_kriteria', $kriteria->nama_kriteria) }}" required maxlength="255">
                </div>

                <div class="col-md-4">
                    <label class="form-label">Jenis</label>
                    <select name="jenis_kriteria" class="form-select" required>
                        <option value="benefit" {{ old('jenis_kriteria', $kriteria->jenis_kriteria)=='benefit' ? 'selected':'' }}>Benefit</option>
                        <option value="cost" {{ old('jenis_kriteria', $kriteria->jenis_kriteria)=='cost' ? 'selected':'' }}>Cost</option>
                    </select>
                </div>

                <div class="col-md-4">
                    <label class="form-label">Bobot</label>
                    <input type="number" step="0.0001" min="0" max="1" name="bobot" class="form-control" value="{{ old('bobot', $kriteria->bobot) }}" required>
                </div>

                <div class="col-md-12">
                    <label class="form-label">Deskripsi (opsional)</label>
                    <textarea name="deskripsi" class="form-control" rows="3">{{ old('deskripsi', $kriteria->deskripsi) }}</textarea>
                </div>

                <div class="col-md-3">
                    <div class="form-check mt-2">
                        <input type="checkbox" name="is_active" id="is_active" class="form-check-input" {{ old('is_active', $kriteria->is_active) ? 'checked' : '' }}>
                        <label for="is_active" class="form-check-label">Aktif</label>
                    </div>
                </div>
            </div>

            <div class="mt-3 d-flex gap-2">
                <button class="btn btn-primary">Simpan Perubahan</button>
                <a href="{{ route('kriteria.index') }}" class="btn btn-secondary">Batal</a>
            </div>
        </form>
    </div>
</div>
@endsection
