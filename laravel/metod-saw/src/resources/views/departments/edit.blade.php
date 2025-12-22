@extends('layouts.dashboard')

@section('title','Edit Department')

@section('content')
<div class="container-fluid">
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Edit Department</h5>
            @if($errors->any())<div class="alert alert-danger"><ul>@foreach($errors->all() as $e)<li>{{ $e }}</li>@endforeach</ul></div>@endif
            <form method="POST" action="{{ route('departments.update',$department->id) }}">
                @csrf @method('PUT')
                <div class="mb-3">
                    <label class="form-label">Nama</label>
                    <input name="name" class="form-control" value="{{ old('name',$department->name) }}" required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Code</label>
                    <input name="code" class="form-control" value="{{ old('code',$department->code) }}" />
                </div>
                <div class="form-check mb-3">
                    <input type="hidden" name="is_active" value="0">
                    <input class="form-check-input" type="checkbox" name="is_active" id="is_active" value="1" {{ $department->is_active ? 'checked' : '' }}>
                    <label class="form-check-label" for="is_active">Active</label>
                </div>
                <button class="btn btn-primary">Simpan</button>
                <a class="btn btn-secondary" href="{{ route('departments.index') }}">Batal</a>
            </form>
        </div>
    </div>
</div>
@endsection
