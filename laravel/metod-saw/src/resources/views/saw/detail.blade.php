@extends('layouts.app')

@section('content')
<div class="container py-4">
    <h3>Detail Hasil SAW</h3>

    <div class="card mb-3">
        <div class="card-body">
            <div><strong>Periode:</strong> {{ $hasil->periodePenilaian->nama_periode ?? '-' }}</div>
            <div><strong>Nama:</strong> {{ $hasil->karyawan->name ?? '-' }}</div>
            <div><strong>Ranking:</strong> {{ $hasil->ranking }}</div>
            <div><strong>Nilai Preferensi:</strong> {{ number_format($hasil->nilai_preferensi, 4) }}</div>
        </div>
    </div>

    <div class="card">
        <div class="card-body">
            <h5>Rincian Perhitungan</h5>
            @if(empty($hasil->detail_perhitungan))
                <div class="text-muted">Tidak ada detail perhitungan.</div>
            @else
                <table class="table table-sm mt-3">
                    <thead>
                        <tr>
                            <th>Kriteria</th>
                            <th>Nilai Asli</th>
                            <th>Jenis</th>
                            <th>Bobot</th>
                            <th>Nilai Normalisasi</th>
                            <th>Nilai Terbobot</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($hasil->detail_perhitungan as $k => $v)
                            <tr>
                                <td>{{ $k }}</td>
                                <td>{{ $v['nilai_asli'] ?? 0 }}</td>
                                <td>{{ $v['jenis'] ?? '-' }}</td>
                                <td>{{ isset($v['bobot']) ? number_format($v['bobot'],4) : '-' }}</td>
                                <td>{{ isset($v['nilai_normalisasi']) ? number_format($v['nilai_normalisasi'],4) : '-' }}</td>
                                <td>{{ isset($v['nilai_terbobot']) ? number_format($v['nilai_terbobot'],4) : '-' }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @endif
        </div>
    </div>

    <div class="card mt-3">
        <div class="card-body">
            <h5>Feedback</h5>

            @auth
                @php $u = auth()->user(); @endphp
                @if(($u->role === 'karyawan' && $u->id === $hasil->karyawan_id) || in_array($u->role, ['super_admin','admin','hr','supervisor']))
                    <form method="POST" action="{{ route('hasil.feedback.store', $hasil->id) }}">
                        @csrf
                        <div class="mb-3">
                            <label class="form-label">Tulis feedback / catatan</label>
                            <textarea name="message" class="form-control" rows="3" required>{{ old('message') }}</textarea>
                        </div>
                        <div>
                            <button class="btn btn-primary">Kirim Feedback</button>
                        </div>
                    </form>
                @else
                    <div class="text-muted">Anda tidak memiliki izin untuk memberikan feedback pada hasil ini.</div>
                @endif
            @endauth

            @if(isset($hasil->feedbacks) && $hasil->feedbacks->isNotEmpty())
                <hr />
                <h6>Riwayat Feedback</h6>
                <ul class="list-group mt-2">
                    @foreach($hasil->feedbacks as $fb)
                        <li class="list-group-item">
                            <div><strong>{{ $fb->user->name ?? 'Anon' }}</strong> <small class="text-muted">({{ $fb->created_at->format('Y-m-d H:i') }})</small></div>
                            <div>{{ $fb->message }}</div>
                        </li>
                    @endforeach
                </ul>
            @endif
        </div>
    </div>
</div>
@endsection
