@extends('layouts.dashboard')

@section('title','Edit User')

@section('content')
<div class="container-fluid">
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Edit User</h5>

            @if($errors->any())
                <div class="alert alert-danger"><ul class="mb-0">@foreach($errors->all() as $e)<li>{{ $e }}</li>@endforeach</ul></div>
            @endif

            <form method="POST" action="{{ route('users.update',$user->id) }}">
                @csrf
                @method('PUT')

                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Nama</label>
                        <input name="name" class="form-control" value="{{ old('name',$user->name) }}" required />
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Email</label>
                        <input name="email" type="email" class="form-control" value="{{ old('email',$user->email) }}" required />
                    </div>

                    <div class="col-md-4">
                        <label class="form-label">Password (kosongkan kalau tidak diganti)</label>
                        <input name="password" type="password" class="form-control" />
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Konfirmasi Password</label>
                        <input name="password_confirmation" type="password" class="form-control" />
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Role</label>
                        <select name="role" class="form-select">
                            @foreach(config('roles.roles') as $r)
                                <option value="{{ $r }}" {{ old('role', $user->role) == $r ? 'selected' : '' }}>{{ ucwords(str_replace('_',' ',$r)) }}</option>
                            @endforeach
                        </select>
                    </div>

                    <div class="col-md-4">
                        <label class="form-label">Employee ID</label>
                        <input name="employee_id" class="form-control" value="{{ old('employee_id',$user->employee_id) }}" />
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Department</label>
                        <input name="department" list="departmentsList" class="form-control" value="{{ old('department',$user->department) }}" />
                        @isset($departments)
                            <datalist id="departmentsList">
                                @foreach($departments as $d)
                                    <option value="{{ $d }}">{{ $d }}</option>
                                @endforeach
                            </datalist>
                        @endisset
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Position</label>
                        <input name="position" class="form-control" value="{{ old('position',$user->position) }}" />
                    </div>

                    <div class="col-md-4">
                        <label class="form-label">Phone</label>
                        <input name="phone" class="form-control" value="{{ old('phone',$user->phone) }}" />
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Hire Date</label>
                        <input name="hire_date" type="date" class="form-control" value="{{ old('hire_date', $user->hire_date?->format('Y-m-d')) }}" />
                    </div>
                    <div class="col-md-4 d-flex align-items-center">
                        <div class="form-check mt-3">
                            <input type="hidden" name="is_active" value="0">
                            <input class="form-check-input" type="checkbox" name="is_active" id="is_active" value="1" {{ $user->is_active ? 'checked' : '' }}>
                            <label class="form-check-label" for="is_active">Active</label>
                        </div>
                    </div>
                </div>

                <div class="mt-3">
                    <button class="btn btn-primary">Simpan</button>
                    <a class="btn btn-secondary" href="{{ route('users.index') }}">Batal</a>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
