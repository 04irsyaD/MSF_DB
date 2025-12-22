@extends('layouts.dashboard')

@section('title','Hasil SAW')

@section('content')
<div class="container-fluid">
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Hasil SAW</h5>
            <p class="text-muted">Daftar hasil perhitungan metode SAW.</p>

            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Karyawan</th>
                        <th>Periode</th>
                        <th>Nilai Preferensi</th>
                        <th>Ranking</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($results as $r)
                        <tr>
                            <td>{{ $loop->iteration + ($results->currentPage()-1)*$results->perPage() }}</td>
                            <td>{{ $r->karyawan->name ?? 'N/A' }}</td>
                            <td>{{ optional($r->periodePenilaian)->nama_periode ?? '-' }}</td>
                            <td>{{ number_format($r->nilai_preferensi,4) }}</td>
                            <td>{{ $r->ranking }}</td>
                            <td><a href="{{ route('saw.detail', $r->id) }}">Detail</a></td>
                        </tr>
                    @empty
                        <tr><td colspan="6">Belum ada hasil SAW. Jalankan perhitungan terlebih dahulu.</td></tr>
                    @endforelse
                </tbody>
            </table>

            {{ $results->links() }}
        </div>
    </div>
</div>
@endsection
