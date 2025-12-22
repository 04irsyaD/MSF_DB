@extends('layouts.dashboard')

@section('title','Detail Kriteria')

@section('content')
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">Detail Kriteria</h5>
        <div>
            <a href="{{ route('kriteria.index') }}" class="btn btn-sm btn-secondary">Kembali</a>
            @can('update', $kriteria)
                <a href="{{ route('kriteria.edit', $kriteria) }}" class="btn btn-sm btn-primary">Edit</a>
            @endcan
        </div>
    </div>

    <div class="card p-3">
        <div class="card-body p-0">
            <dl class="row">
                <dt class="col-sm-3">Kode</dt>
                <dd class="col-sm-9">{{ $kriteria->kode_kriteria }}</dd>

                <dt class="col-sm-3">Nama</dt>
                <dd class="col-sm-9">{{ $kriteria->nama_kriteria }}</dd>

                <dt class="col-sm-3">Jenis</dt>
                <dd class="col-sm-9">{{ ucfirst($kriteria->jenis_kriteria) }}</dd>

                <dt class="col-sm-3">Bobot</dt>
                <dd class="col-sm-9">{{ number_format($kriteria->bobot, 4) }}</dd>

                <dt class="col-sm-3">Deskripsi</dt>
                <dd class="col-sm-9">{{ $kriteria->deskripsi ?? '-' }}</dd>
            </dl>

            <hr>

            <h5>Sub Kriteria</h5>
            @if($kriteria->subKriterias->isEmpty())
                <div class="text-muted">Belum ada sub kriteria.</div>
            @else
                <ul class="list-group">
                    @foreach($kriteria->subKriterias as $sub)
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{{ $sub->nama_sub_kriteria }}</strong>
                                <div class="small text-muted">Nilai: {{ $sub->nilai }}</div>
                            </div>
                            <div>
                                @can('update', $sub)
                                    <a href="#" class="btn btn-sm btn-outline-secondary">Edit</a>
                                @endcan
                            </div>
                        </li>
                    @endforeach
                </ul>
            @endif
        </div>
    </div>
</div>
@endsection
