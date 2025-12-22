@extends('layouts.dashboard')

@section('title','Kriteria')

@section('content')
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">Kriteria</h5>
        <div>
            <a href="{{ route('kriteria.create') }}" class="btn btn-sm btn-primary">Tambah Kriteria</a>
            <a href="{{ route('kriteria.bobot.edit') }}" class="btn btn-sm btn-secondary">Edit Bobot (Bulk)</a>
        </div>
    </div>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif
    @if(session('error'))
        <div class="alert alert-danger">{{ session('error') }}</div>
    @endif

    @if($kriterias->isEmpty())
        <div class="alert alert-info">Belum ada kriteria.</div>
    @else
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Kode</th>
                        <th>Nama</th>
                        <th>Jenis</th>
                        <th>Bobot</th>
                        <th>Sub Kriteria</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($kriterias as $k)
                        <tr>
                            <td>{{ $loop->iteration }}</td>
                            <td>{{ $k->kode_kriteria }}</td>
                            <td>{{ $k->nama_kriteria }}</td>
                            <td>{{ ucfirst($k->jenis_kriteria) }}</td>
                            <td>{{ number_format($k->bobot, 4) }}</td>
                            <td>
                                @if($k->subKriterias->isNotEmpty())
                                    <ul class="mb-0">
                                        @foreach($k->subKriterias as $s)
                                            <li>{{ $s->nama_sub_kriteria }} ({{ $s->nilai }})</li>
                                        @endforeach
                                    </ul>
                                @else
                                    -
                                @endif
                            </td>
                            <td>
                                <a href="{{ route('kriteria.show', $k) }}" class="btn btn-sm btn-outline-primary">Lihat</a>
                                @can('update', $k)
                                    <a href="{{ route('kriteria.edit', $k) }}" class="btn btn-sm btn-outline-secondary">Edit</a>
                                @endcan
                                @can('delete', $k)
                                    <form action="{{ route('kriteria.destroy', $k) }}" method="POST" style="display:inline-block" onsubmit="return confirm('Hapus kriteria ini?');">
                                        @csrf
                                        @method('DELETE')
                                        <button class="btn btn-sm btn-danger">Hapus</button>
                                    </form>
                                @endcan
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif
</div>
@endsection
