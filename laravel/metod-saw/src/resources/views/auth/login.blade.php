@extends('layouts.app')

@section('content')
<style>
    /* Center the login card in viewport even when rendered inside the app container */
    .login-wrapper { min-height: calc(100vh - 40px); display:flex; align-items:center; justify-content:center; }
    .left-panel {
        background: linear-gradient(135deg,#4facfe 0%,#00f2fe 100%);
        color: white;
        padding: 48px;
        border-radius: 12px 0 0 12px;
    }
    .right-panel { padding: 48px; }
    .login-card { border-radius: 12px; overflow: hidden; max-width: 900px; width: 100%; margin: 0 auto; }
    .btn-login { background:#1e90ff; color:#fff; }
    /* Make inputs slightly larger on the right panel for visual balance */
    .right-panel .form-control { background-color: #eef6ff; }
</style>

<div class="d-flex justify-content-center align-items-center login-wrapper">
    <div class="card login-card shadow-sm" style="max-width:900px; width:100%">
        <div class="row g-0">
            <div class="col-md-6 left-panel d-flex flex-column justify-content-center">
                <h2 class="fw-bold">Welcome to...</h2>
                <p class="mt-3">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <p class="mt-4 small">Lorem ipsum dolor sit amet</p>
            </div>
            <div class="col-md-6 right-panel">
                <h4 class="mb-3">Login</h4>

                @if($errors->any())
                    <div class="alert alert-danger">{{ $errors->first() }}</div>
                @endif

                <form method="POST" action="{{ url('/login') }}">
                    @csrf
                    <div class="mb-3">
                        <label for="email" class="form-label">User Name</label>
                        <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}" required autofocus>
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input id="password" type="password" class="form-control" name="password" required>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="remember" name="remember">
                        <label class="form-check-label" for="remember">Remember me</label>
                    </div>

                    <div class="d-grid">
                        <button type="submit" class="btn btn-login btn-lg">LOGIN</button>
                    </div>

                    <div class="mt-3 d-flex justify-content-between small">
                        <div>New User? <a href="#">Signup</a></div>
                        <div><a href="#">Forgot your password?</a></div>
                    </div>
                </form>

            </div>
        </div>
    </div>
</div>
@endsection
