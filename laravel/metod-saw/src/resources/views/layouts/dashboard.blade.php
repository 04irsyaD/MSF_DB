<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'SAW App') }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        body { background: #f6f8fb; }
    .sidebar { width: 260px; background: linear-gradient(135deg,#4facfe 0%,#00f2fe 100%); min-height:100vh; color:#fff; transition: width .18s ease; overflow: hidden; }
        .sidebar a { color: rgba(255,255,255,0.9); text-decoration:none; }
    .sidebar .nav-link { color: rgba(255,255,255,0.85); display:flex; align-items:center; gap:8px; padding:8px 12px; transition: background .12s ease; border-radius:6px; }
    .sidebar .nav-link i { font-size:20px; width:20px; height:20px; display:inline-block; flex-shrink:0; }
    .sidebar .nav-link .label { display:inline-block; transition: opacity .15s ease, transform .18s ease; transform-origin:left center; }
        .sidebar.collapsed { width:64px !important; }
    .sidebar.collapsed .nav-link { justify-content:center; padding:8px 6px; }
    .sidebar.collapsed .nav-link .label { opacity:0; transform: translateX(-6px); }
        .content-area { margin-left:260px; padding:24px; transition: margin-left .18s ease; }
        .stat-card { border-radius: 8px; }
    </style>
</head>
<body>

<div class="d-flex">
    <aside class="sidebar p-3 position-fixed" id="main-sidebar">
        <div class="mb-4">
            <h4 class="mb-0" style="color:#fff">{{ config('app.name', 'SAW') }}</h4>
            <div class="small text-muted">Penilaian Karyawan</div>
        </div>

        <nav class="nav flex-column">
            <a class="nav-link mb-2" href="{{ route('dashboard') }}" data-bs-toggle="tooltip" data-bs-placement="right" title="Dashboard">
                <i class="bi bi-speedometer2 text-white"></i>
                <span class="label">Dashboard</span>
            </a>

            <a class="nav-link mb-2" href="{{ route('kriteria.index') }}" data-bs-toggle="tooltip" data-bs-placement="right" title="Kriteria">
                <i class="bi bi-list-columns text-white"></i>
                <span class="label">Kriteria</span>
            </a>

            @if(auth()->check() && auth()->user()->isSuperAdmin())
                <a class="nav-link mb-2" href="{{ route('kriteria.bobot.edit') }}" data-bs-toggle="tooltip" data-bs-placement="right" title="Edit Bobot">
                    <i class="bi bi-sliders text-white"></i>
                    <span class="label">Edit Bobot</span>
                </a>
            @endif

            @if(auth()->check() && in_array(auth()->user()->role, config('roles.groups.view_dashboard', [])))
                <a class="nav-link mb-2" href="{{ route('penilaian.index') }}" data-bs-toggle="tooltip" data-bs-placement="right" title="Penilaian">
                    <i class="bi bi-clipboard-check text-white"></i>
                    <span class="label">Penilaian</span>
                </a>
            @endif

            @if(auth()->check() && in_array(auth()->user()->role, config('roles.groups.view_dashboard', [])))
                <a class="nav-link mb-2" href="{{ route('hasil.index') }}" data-bs-toggle="tooltip" data-bs-placement="right" title="Hasil">
                    <i class="bi bi-trophy text-white"></i>
                    <span class="label">Hasil</span>
                </a>
            @elseif(auth()->check() && auth()->user()->role === 'karyawan')
                <a class="nav-link mb-2" href="{{ route('my.results') }}" data-bs-toggle="tooltip" data-bs-placement="right" title="Hasil Saya">
                    <i class="bi bi-person-circle text-white"></i>
                    <span class="label">Hasil Saya</span>
                </a>
            @endif

            @if(auth()->check() && auth()->user()->isSuperAdmin())
                <a class="nav-link mb-2" href="{{ route('users.index') }}" data-bs-toggle="tooltip" data-bs-placement="right" title="Users">
                    <i class="bi bi-people text-white"></i>
                    <span class="label">Users</span>
                </a>
                <a class="nav-link mb-2" href="{{ route('departments.index') }}" data-bs-toggle="tooltip" data-bs-placement="right" title="Departments">
                    <i class="bi bi-building text-white"></i>
                    <span class="label">Departments</span>
                </a>
            @endif
        </nav>
    </aside>

    <main class="content-area w-100" id="main-content">
        <nav class="navbar navbar-expand-lg navbar-dark" style="background: linear-gradient(135deg,#4facfe 0%,#00f2fe 100%); position:fixed; left:260px; right:0; top:0; z-index:1030;">
            <div class="container-fluid">
                <button class="btn btn-sm btn-transparent text-white me-3" id="btn-toggle-sidebar" aria-label="Toggle sidebar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="6" width="18" height="2" fill="white"/>
                        <rect x="3" y="11" width="18" height="2" fill="white"/>
                        <rect x="3" y="16" width="18" height="2" fill="white"/>
                    </svg>
                </button>

                <a class="navbar-brand text-white" href="#">{{ config('app.name', 'SAW') }}</a>

                <div class="ms-auto d-flex align-items-center">
                    @auth
                        <span class="me-2 text-white">{{ auth()->user()->name }}</span>
                        <span class="badge bg-white text-primary me-2" style="font-weight:600">{{ strtoupper(optional(auth()->user())->role) }}</span>
                    @endauth
                </div>
            </div>
        </nav>
        <div style="height:56px"></div>
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="mb-0">@yield('title', 'Dashboard')</h2>
            <div>
                @auth
                    <span class="me-2">{{ auth()->user()->name }}</span>
                    <a href="#" onclick="event.preventDefault();document.getElementById('logout-form').submit();">Logout</a>
                    <form id="logout-form" action="{{ url('/logout') }}" method="POST" style="display:none">@csrf</form>
                @endauth
            </div>
        </div>

        @yield('content')
    </main>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script>
    (function(){
    const btn = document.getElementById('btn-toggle-sidebar');
    const sidebar = document.getElementById('main-sidebar');
    const content = document.getElementById('main-content');
    const topnav = document.querySelector('nav.navbar');
        if (!btn || !sidebar || !content) return;

        // initialize bootstrap tooltips for sidebar items
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

        // restore collapsed state from localStorage
        try {
            var stored = localStorage.getItem('sidebarCollapsed');
            if (stored === '1') {
                sidebar.classList.add('collapsed');
                sidebar.style.width = '64px';
                content.style.marginLeft = '64px';
                if (topnav) topnav.style.left = '64px';
            } else {
                sidebar.classList.remove('collapsed');
                sidebar.style.width = '260px';
                content.style.marginLeft = '260px';
                if (topnav) topnav.style.left = '260px';
            }
        } catch (e) {
            // ignore storage errors
        }

        btn.addEventListener('click', function(e){
            sidebar.classList.toggle('collapsed');
            if (sidebar.classList.contains('collapsed')){
                sidebar.style.width = '64px';
                content.style.marginLeft = '64px';
                if (topnav) topnav.style.left = '64px';
                try { localStorage.setItem('sidebarCollapsed','1'); } catch(e){}
            } else {
                sidebar.style.width = '260px';
                content.style.marginLeft = '260px';
                if (topnav) topnav.style.left = '260px';
                try { localStorage.setItem('sidebarCollapsed','0'); } catch(e){}
            }
        });
    })();
</script>
@stack('scripts')
</body>
</html>
