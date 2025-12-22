@extends('layouts.dashboard')

@section('title','Edit Bobot Kriteria')

@section('content')
<div class="container-fluid">
    <div class="card p-3">
        <h5 class="mb-3">Edit Bobot Kriteria</h5>

        @if(session('error'))
            <div class="alert alert-danger">{{ session('error') }}</div>
        @endif

        <form method="POST" action="{{ route('kriteria.bobot.update') }}">
            @csrf
            <div class="table-responsive">
            <table class="table table-bordered">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Kode</th>
                    <th>Nama Kriteria</th>
                    <th>Jenis</th>
                    <th>Bobot</th>
                </tr>
            </thead>
            <tbody>
                @foreach($kriterias as $k)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $k->kode_kriteria }}</td>
                    <td>{{ $k->nama_kriteria }}</td>
                    <td>{{ $k->jenis_kriteria }}</td>
                    <td style="width:200px;">
                        <input type="number" step="0.0001" min="0" max="1" name="bobot[{{ $k->id }}]" value="{{ old('bobot.'.$k->id, number_format($k->bobot,4,'.','')) }}" class="form-control bobot-input">
                    </td>
                </tr>
                @endforeach
            </tbody>
            </table>
            </div>

            <div class="mb-3">
                <strong>Total Bobot: </strong> <span id="total-bobot">0</span>
            </div>

            <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary" id="submit-btn">Simpan Bobot</button>
                <a href="{{ route('kriteria.index') }}" class="btn btn-secondary">Batal</a>
            </div>
        </form>
    </div>
</div>

<script>
    function updateTotal() {
        const inputs = document.querySelectorAll('.bobot-input');
        let total = 0;
        inputs.forEach(i => {
            const v = parseFloat(i.value);
            if (!isNaN(v)) total += v;
        });
        document.getElementById('total-bobot').innerText = total.toFixed(4);
        const submit = document.getElementById('submit-btn');
        // Allow small floating diff
        submit.disabled = Math.abs(total - 1) > 0.0001;
    }

    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.bobot-input').forEach(i => {
            i.addEventListener('input', updateTotal);
        });
        updateTotal();
    });
</script>
@endsection
