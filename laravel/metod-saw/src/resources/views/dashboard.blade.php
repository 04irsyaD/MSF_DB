@extends('layouts.app')

@section('content')
<div class="container py-4">
    <h3>Dashboard</h3>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    @if($type === 'top_performers')
        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="mb-0">Top Performers @if($periode) - {{ $periode->nama_periode }} @endif</h5>

                    {{-- Periode selector (admins see selector as well) --}}
                    @if(isset($periodes) && $periodes->isNotEmpty() && auth()->check() && in_array(auth()->user()->role, ['super_admin','admin','hr']))
                        <form method="GET" action="{{ route('dashboard') }}" class="d-flex align-items-center">
                            <select name="periode_id" class="form-select form-select-sm me-2">
                                @foreach($periodes as $p)
                                    <option value="{{ $p->id }}" {{ $periode && $periode->id == $p->id ? 'selected' : '' }}>{{ $p->nama_periode }}</option>
                                @endforeach
                            </select>
                            <button class="btn btn-sm btn-outline-primary">Pilih</button>
                        </form>
                    @endif
                </div>
                @if($top->isEmpty())
                    <div class="text-muted">Belum ada hasil SAW untuk periode saat ini.</div>
                @else
                    {{-- Hitung SAW button for admins --}}
                    @if(auth()->check() && in_array(auth()->user()->role, ['super_admin','admin']) && $periode)
                        <div class="mb-3">
                            <form method="POST" action="{{ route('saw.calculate') }}" onsubmit="return confirm('Jalankan perhitungan SAW untuk periode ini?');">
                                @csrf
                                <input type="hidden" name="periode_id" value="{{ $periode->id }}">
                                <button class="btn btn-sm btn-success">Hitung SAW untuk {{ $periode->nama_periode }}</button>
                            </form>
                        </div>
                    @endif
                    <table class="table table-striped mt-3">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Nama</th>
                                <th>Nilai Preferensi</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($top as $row)
                                <tr>
                                            <td>{{ $row->ranking }}</td>
                                            <td>
                                                @if(isset($row->karyawan))
                                                    <a href="{{ route('saw.detail', $row->id) }}">{{ $row->karyawan->name }}</a>
                                                @else
                                                    —
                                                @endif
                                            </td>
                                            <td>{{ number_format($row->nilai_preferensi, 4) }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                @endif
            </div>
        </div>
    @elseif($type === 'user_list')
        <div class="card mb-3">
            <div class="card-body">
                <h5>Daftar Karyawan</h5>
                <table class="table table-sm mt-3">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Employee ID</th>
                            <th>Nama</th>
                            <th>Departemen</th>
                            <th>Posisi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($users as $u)
                            <tr>
                                <td>{{ $loop->iteration + ($users->currentPage()-1)*$users->perPage() }}</td>
                                <td>{{ $u->employee_id }}</td>
                                <td>{{ $u->name }}</td>
                                <td>{{ $u->department }}</td>
                                <td>{{ $u->position }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>

                {{ $users->links() }}
            </div>
        </div>
    @else
        <div class="card mb-3">
            <div class="card-body">
                <h5>Hasil Pribadi @if($periode) - {{ $periode->nama_periode }} @endif</h5>
                @if(!$personal)
                    <div class="text-muted">Belum ada hasil untuk Anda di periode ini.</div>
                @else
                    <div>Ranking: {{ $personal->ranking }}</div>
                    <div>Nilai: {{ number_format($personal->nilai_preferensi, 4) }}</div>
                @endif
            </div>
        </div>
    @endif

</div>
@endsection
