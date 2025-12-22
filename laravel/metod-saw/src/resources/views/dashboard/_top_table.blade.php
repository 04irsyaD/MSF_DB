<table class="table table-striped">
    <thead>
        <tr>
            <th>#</th>
            <th>Nama</th>
            <th>Nilai Preferensi</th>
            <th>Rank</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        @forelse($rows as $i => $h)
            <tr>
                <td>{{ $i+1 }}</td>
                <td>{{ optional($h->karyawan)->name ?? (is_array($h) && isset($h['karyawan']) ? ($h['karyawan']->name ?? 'N/A') : 'N/A') }}</td>
                <td>{{ number_format($h->nilai_preferensi ?? 0,4) }}</td>
                <td>{{ $h->ranking ?? '-' }}</td>
                <td>@if(!empty($h->id))<a href="{{ route('saw.detail',$h->id) }}">Detail</a>@endif</td>
            </tr>
        @empty
            <tr><td colspan="5">No hasil yet. Run SAW to compute rankings.</td></tr>
        @endforelse
    </tbody>
</table>
