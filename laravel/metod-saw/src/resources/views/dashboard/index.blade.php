@extends('layouts.dashboard')

@section('title','Dashboard')

@section('content')
<div class="container-fluid">
    <div class="row mb-3">
        <div class="col-md-8">
            <div class="row g-3">
                <div class="col-12">
                    {{-- Role-specific top area --}}
                    @php $role = optional(auth()->user())->role; @endphp

                    @if($role === 'super_admin')
                        <div class="d-flex gap-2 mb-3">
                            <div class="card flex-fill p-3">
                                <div class="small text-muted">Total Kriteria</div>
                                <h3 class="mb-0">{{ $kriteria_count ?? 0 }}</h3>
                            </div>
                            <div class="card flex-fill p-3">
                                <div class="small text-muted">Jumlah Karyawan</div>
                                <h3 class="mb-0">{{ $user_count ?? 0 }}</h3>
                            </div>
                            <div class="card flex-fill p-3">
                                <div class="small text-muted">Periode Aktif</div>
                                <h3 class="mb-0">{{ $selectedPeriode->nama_periode ?? '-' }}</h3>
                            </div>
                            <div class="card flex-fill p-3">
                                <div class="small text-muted">Pending Approvals</div>
                                <h3 class="mb-0">{{ $pending_count ?? 0 }}</h3>
                                <div class="mt-2"><a href="{{ route('penilaian.pending') }}">Lihat Pending</a></div>
                            </div>
                        </div>

                        <div class="card mb-3">
                            <div class="card-body">
                                <h5 class="card-title">Top Performers (Global)</h5>
                                @include('dashboard._top_table', ['rows' => $top_performers])
                            </div>
                        </div>

                    @elseif($role === 'admin')
                        <div class="d-flex gap-2 mb-3">
                            <div class="card flex-fill p-3">
                                <div class="small text-muted">Total Kriteria</div>
                                <h3 class="mb-0">{{ $kriteria_count ?? 0 }}</h3>
                            </div>
                            <div class="card flex-fill p-3">
                                <div class="small text-muted">Jumlah Karyawan</div>
                                <h3 class="mb-0">{{ $user_count ?? 0 }}</h3>
                            </div>
                            <div class="card flex-fill p-3">
                                <div class="small text-muted">Periode Aktif</div>
                                <h3 class="mb-0">{{ $selectedPeriode->nama_periode ?? '-' }}</h3>
                            </div>
                        </div>

                        <div class="card mb-3">
                            <div class="card-body">
                                <h5 class="card-title">Top Performers (Global)</h5>
                                @include('dashboard._top_table', ['rows' => $top_performers])
                            </div>
                        </div>

                    @elseif($role === 'hr')
                        <div class="d-flex gap-2 mb-3">
                            <div class="card flex-fill p-3">
                                <div class="small text-muted">Jumlah Karyawan</div>
                                <h3 class="mb-0">{{ $user_count ?? 0 }}</h3>
                            </div>
                            <div class="card flex-fill p-3">
                                <div class="small text-muted">Periode Aktif</div>
                                <h3 class="mb-0">{{ $selectedPeriode->nama_periode ?? '-' }}</h3>
                            </div>
                            <div class="card flex-fill p-3">
                                <a href="{{ route('penilaian.create') }}" class="btn btn-primary">Tambah Penilaian</a>
                            </div>
                        </div>

                        <div class="card mb-3">
                            <div class="card-body">
                                <h5 class="card-title">Daftar Karyawan</h5>
                                <div class="small text-muted">Jumlah karyawan: {{ $user_count ?? 0 }}</div>
                                {{-- optionally show first few users --}}
                                @if(!empty($users))
                                    <ul class="mt-2">
                                        @foreach($users as $u)
                                            <li>{{ $u->name }} — {{ $u->employee_id ?? '-' }}</li>
                                        @endforeach
                                    </ul>
                                @endif
                            </div>
                        </div>

                    @elseif($role === 'supervisor')
                        <div class="d-flex gap-2 mb-3">
                            <div class="card flex-fill p-3">
                                <div class="small text-muted">Departemen</div>
                                <h3 class="mb-0">{{ $department ?? '—' }}</h3>
                            </div>
                            <div class="card flex-fill p-3">
                                <div class="small text-muted">Pending Approvals (Dept)</div>
                                <h3 class="mb-0">{{ $pending_count ?? 0 }}</h3>
                                <div class="mt-2"><a href="{{ route('penilaian.pending') }}">Lihat Pending</a></div>
                            </div>
                        </div>

                        <div class="card mb-3">
                            <div class="card-body">
                                <h5 class="card-title">Top Performers (Departemen: {{ $department }})</h5>
                                @include('dashboard._top_table', ['rows' => $top_performers])
                            </div>
                        </div>

                    @else
                        {{-- default: karyawan view --}}
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5 class="card-title">Hasil Saya</h5>
                                @if(!empty($personal))
                                    <div>Nilai: {{ number_format($personal->nilai_preferensi ?? 0, 4) }}</div>
                                    <div>Rank: {{ $personal->ranking ?? '-' }}</div>
                                @else
                                    <div class="text-muted">Belum ada hasil untuk periode ini.</div>
                                @endif
                            </div>
                        </div>
                    @endif
                </div>
            </div>
        </div>

        <div class="col-md-4">
                <div class="card mb-3 p-3">
                <h6>Periode</h6>
                <form method="GET" action="{{ route('dashboard') }}">
                    <select name="periode_id" class="form-select mb-2" onchange="this.form.submit()">
                        @foreach($periodes as $p)
                            <option value="{{ $p->id }}" {{ (optional($selectedPeriode)->id == $p->id) ? 'selected' : '' }}>{{ $p->nama_periode }}</option>
                        @endforeach
                    </select>
                </form>

                @if(in_array(optional(auth()->user())->role, config('roles.groups.view_dashboard', [])))
                <form method="POST" action="{{ route('saw.calculate') }}" onsubmit="return confirm('Run SAW for selected periode?');">
                    @csrf
                    <input type="hidden" name="periode_id" value="{{ optional($selectedPeriode)->id }}" />
                    <button class="btn btn-primary btn-block">Hitung SAW</button>
                </form>
                @endif

                @if(in_array(optional(auth()->user())->role, config('roles.groups.export', [])))
                    <a href="{{ route('hasil.export', ['periode_id' => optional($selectedPeriode)->id, 'format' => 'csv']) }}" class="btn btn-outline-secondary btn-block mt-2">Export CSV</a>
                    <a href="{{ route('hasil.export', ['periode_id' => optional($selectedPeriode)->id, 'format' => 'excel']) }}" class="btn btn-outline-secondary btn-block mt-2">Export XLSX</a>
                    <a href="{{ route('hasil.export', ['periode_id' => optional($selectedPeriode)->id, 'format' => 'pdf']) }}" class="btn btn-outline-secondary btn-block mt-2">Export PDF</a>
                @endif
            </div>

                <div class="card p-3">
                <h6>Recent Activities</h6>
                <div class="small text-muted">– Hasil terbaru akan muncul di sini.</div>
            </div>
        </div>
    </div>
</div>

@endsection

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<script>
    (function(){
        const labels = {!! json_encode($trend_labels ?? []) !!};
        const data = {!! json_encode($trend_values ?? []) !!};
        const dataTop3 = {!! json_encode($trend_top3 ?? []) !!};
        const chartEl = document.getElementById('trendChart');
        if (labels.length && chartEl) {
            const ctx = chartEl.getContext('2d');

            // gradient fill
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, 'rgba(54,162,235,0.25)');
            gradient.addColorStop(1, 'rgba(54,162,235,0.03)');

            const lastValue = data.length ? data[data.length-1] : null;

            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Rata-rata Nilai Preferensi',
                            data: data,
                            borderColor: 'rgba(54,162,235,1)',
                            backgroundColor: gradient,
                            pointBackgroundColor: labels.map((_,i) => i === labels.length-1 ? 'rgba(255,99,132,1)' : 'rgba(54,162,235,1)'),
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            tension: 0.36,
                            fill: true,
                        },
                        {
                            label: 'Top-3 Rata-rata',
                            data: dataTop3,
                            borderColor: 'rgba(255,159,64,1)',
                            backgroundColor: 'rgba(255,159,64,0.06)',
                            pointBackgroundColor: 'rgba(255,159,64,1)',
                            pointRadius: 3,
                            pointHoverRadius: 5,
                            tension: 0.28,
                            borderDash: [6,4],
                            fill: true,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: true, position: 'top' },
                        tooltip: {
                            enabled: true,
                            callbacks: {
                                label: function(context) {
                                    const v = context.parsed.y;
                                    return 'Nilai: ' + (v !== null ? Number(v).toFixed(4) : '-');
                                }
                            }
                        }
                    },
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { color: '#6c757d' }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: { color: '#6c757d' },
                            grid: { color: 'rgba(200,200,200,0.08)' }
                        }
                    }
                }
            });

            // last value badge (show main and top3)
            const container = chartEl.closest('.card-body');
            const lastTop3 = dataTop3.length ? dataTop3[dataTop3.length-1] : null;
            if (container && lastValue !== null) {
                let badge = container.querySelector('.chart-last-value');
                if (!badge) {
                    badge = document.createElement('div');
                    badge.className = 'chart-last-value small text-muted';
                    badge.style.cssText = 'position:absolute; right:20px; top:18px; background:rgba(255,255,255,0.95); padding:6px 10px; border-radius:14px; font-weight:600; box-shadow:0 1px 6px rgba(0,0,0,0.06);';
                    container.style.position = 'relative';
                    container.appendChild(badge);
                }
                let txt = 'Terakhir: ' + Number(lastValue).toFixed(4);
                if (lastTop3 !== null) txt += ' · Top3: ' + Number(lastTop3).toFixed(4);
                badge.innerHTML = txt;
            }

            // download chart button
            let exportArea = container.querySelector('.chart-export-area');
            if (!exportArea) {
                exportArea = document.createElement('div');
                exportArea.className = 'chart-export-area';
                exportArea.style.marginTop = '8px';
                const btn = document.createElement('button');
                btn.className = 'btn btn-sm btn-outline-primary';
                btn.textContent = 'Download Chart PNG';
                btn.addEventListener('click', function(){
                    const url = chart.toBase64Image();
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'trend_chart.png';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                });
                exportArea.appendChild(btn);
                container.appendChild(exportArea);
            }
        }
    })();
</script>
@endpush
