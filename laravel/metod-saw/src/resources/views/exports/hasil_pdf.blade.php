<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size:12px }
        table { width:100%; border-collapse:collapse }
        th,td{ border:1px solid #ddd; padding:6px; text-align:left }
        th{ background:#f4f4f4 }
    </style>
    <title>Hasil SAW - {{ $periode }}</title>
</head>
<body>
    <h4>Hasil SAW - {{ $periode }}</h4>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Karyawan</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Nilai Preferensi</th>
                <th>Ranking</th>
            </tr>
        </thead>
        <tbody>
            @foreach($rows as $i => $r)
            <tr>
                <td>{{ $i+1 }}</td>
                <td>{{ $r[0] }}</td>
                <td>{{ $r[1] }}</td>
                <td>{{ $r[2] }}</td>
                <td style="text-align:right">{{ $r[4] }}</td>
                <td>{{ $r[5] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
