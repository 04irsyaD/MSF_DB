<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>{{ config('app.name', 'Laravel') }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-100 text-gray-900">
    <div class="min-h-screen flex">
        <!-- Sidebar -->
        <aside class="w-64 bg-white border-r hidden md:block">
            <div class="p-6">
                <a href="{{ route('dashboard') }}" class="text-xl font-semibold text-indigo-700">
                    {{ config('app.name', 'Dashboard') }}
                </a>
            </div>

            <nav class="px-4 pb-6">
                <ul class="space-y-1">
                    <li>
                        <a href="{{ route('dashboard') }}"
                           class="flex items-center px-3 py-2 rounded hover:bg-indigo-50 {{ request()->routeIs('dashboard') ? 'bg-indigo-100 font-medium' : 'text-gray-700' }}">
                            <span class="mr-2">🏠</span> Dashboard
                        </a>
                    </li>

                    <li>
                        <a href="{{ route('articles.index') }}"
                           class="flex items-center px-3 py-2 rounded hover:bg-indigo-50 {{ request()->routeIs('articles.*') ? 'bg-indigo-100 font-medium' : 'text-gray-700' }}">
                            <span class="mr-2">📰</span> Manajemen Artikel
                        </a>
                    </li>

                    <li>
                        <a href="{{ route('users.index') }}"
                           class="flex items-center px-3 py-2 rounded hover:bg-indigo-50 {{ request()->routeIs('users.*') ? 'bg-indigo-100 font-medium' : 'text-gray-700' }}">
                            <span class="mr-2">👥</span> Manajemen User
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>

        <!-- Main content -->
        <div class="flex-1">
            <!-- Topbar -->
            <header class="bg-white border-b">
                <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div>
                        <button id="mobile-menu-btn" class="md:hidden px-2 py-1 rounded bg-indigo-100">Menu</button>
                    </div>

                    <div class="flex items-center space-x-4">
                        <span class="text-sm text-gray-600 hidden sm:inline">Halo, <strong>{{ Auth::user()->name }}</strong></span>

                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button type="submit" class="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Logout</button>
                        </form>
                    </div>
                </div>
            </header>

            <!-- Page content -->
            <main class="max-w-7xl mx-auto px-4 py-6">
                @yield('content')
            </main>
        </div>
    </div>

    <script>
        // simple mobile toggle untuk sidebar (opsional)
        document.getElementById('mobile-menu-btn')?.addEventListener('click', function () {
            const aside = document.querySelector('aside');
            if (!aside) return;
            aside.classList.toggle('hidden');
        });
    </script>
</body>
</html>
