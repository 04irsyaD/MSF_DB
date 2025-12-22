@extends('layouts.dashboard')

@section('title','Buat Penilaian')

@section('content')
<div class="container-fluid">
    <div class="card p-3">
        <h5>Buat Penilaian</h5>
        <p class="text-muted">Input penilaian untuk satu karyawan di periode tertentu. Isi nilai untuk tiap kriteria lalu simpan.</p>

        @if($errors->any())
            <div class="alert alert-danger">
                <ul class="mb-0">
                    @foreach($errors->all() as $err)
                        <li>{{ $err }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form action="{{ route('penilaian.store') }}" method="POST">
            @csrf

            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">Periode</label>
                    <select name="periode_penilaian_id" class="form-select" required>
                        <option value="">-- Pilih Periode --</option>
                        @foreach($periodes as $p)
                            <option value="{{ $p->id }}">{{ $p->nama_periode ?? $p->nama ?? $p->id }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="col-md-6">
                    <label class="form-label">Karyawan</label>
                    <select name="karyawan_id" class="form-select" required>
                        <option value="">-- Pilih Karyawan --</option>
                        @foreach($karyawan as $k)
                            <option value="{{ $k->id }}">{{ $k->name }} ({{ $k->employee_id ?? '-' }})</option>
                        @endforeach
                    </select>
                </div>
            </div>

            <div class="mb-3">
                <h6>Nilai per Kriteria</h6>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Kode</th>
                                <th>Nama Kriteria</th>
                                <th>Pilihan / Nilai</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($kriterias as $kr)
                                <tr>
                                    <td>{{ $kr->kode_kriteria ?? $kr->id }}</td>
                                    <td>{{ $kr->nama_kriteria }}</td>
                                    <td style="width:360px;">
                                        @php $subs = $kr->subKriterias()->where('is_active', true)->get(); @endphp
                                        @if($subs->isNotEmpty())
                                            <div class="btn-group" role="group" aria-label="subkriteria-{{ $kr->id }}">
                                                @foreach($subs as $s)
                                                    <div class="form-check form-check-inline">
                                                        <input class="form-check-input" type="radio" name="sub_kriteria[{{ $kr->id }}]" id="sub_{{ $kr->id }}_{{ $s->id }}" value="{{ $s->id }}">
                                                        <label class="form-check-label" for="sub_{{ $kr->id }}_{{ $s->id }}">{{ $s->nama_sub }} ({{ $s->nilai }})</label>
                                                    </div>
                                                @endforeach
                                            </div>
                                            <div class="form-text">Atau masukkan nilai kustom:</div>
                                            <input type="number" step="0.01" min="0" name="nilai[{{ $kr->id }}]" class="form-control mt-1" placeholder="Nilai kustom (opsional)" />
                                        @else
                                            <input type="number" step="0.01" min="0" name="nilai[{{ $kr->id }}]" class="form-control" placeholder="Nilai (angka)" />
                                        @endif
                                        <input type="text" name="catatan_{{ $kr->id }}" class="form-control form-control-sm mt-1" placeholder="Catatan (opsional)" />
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="d-flex gap-2">
                <button class="btn btn-primary">Simpan Penilaian</button>
                <a href="{{ route('penilaian.index') }}" class="btn btn-secondary">Batal</a>
            </div>
        </form>
    </div>
</div>
@endsection
