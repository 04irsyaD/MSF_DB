@extends('layouts.dashboard')

@section('title','Buat Department')

@section('content')
<div class="container-fluid">
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Buat Department</h5>
            @if($errors->any())<div class="alert alert-danger"><ul>@foreach($errors->all() as $e)<li>{{ $e }}</li>@endforeach</ul></div>@endif
            <form method="POST" action="{{ route('departments.store') }}">
                @csrf
                <div class="mb-3">
                    <label class="form-label">Nama</label>
                    <input name="name" class="form-control" value="{{ old('name') }}" required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Code</label>
                    <input name="code" class="form-control" value="{{ old('code') }}" />
                </div>
                <div class="form-check mb-3">
                    <input type="hidden" name="is_active" value="0">
                    <input class="form-check-input" type="checkbox" name="is_active" id="is_active" value="1" checked>
                    <label class="form-check-label" for="is_active">Active</label>
                </div>
                <button class="btn btn-primary">Simpan</button>
                <a class="btn btn-secondary" href="{{ route('departments.index') }}">Batal</a>
            </form>
        </div>
    </div>
</div>
@endsection
