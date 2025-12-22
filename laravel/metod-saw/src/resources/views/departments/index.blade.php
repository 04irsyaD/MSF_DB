@extends('layouts.dashboard')

@section('title','Departments')

@section('content')
<div class="container-fluid">
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Departments</h5>
            <a href="{{ route('departments.create') }}" class="btn btn-primary mb-3">Buat Department</a>
            @if(session('success'))<div class="alert alert-success">{{ session('success') }}</div>@endif
            <table class="table table-striped">
                <thead><tr><th>#</th><th>Name</th><th>Code</th><th>Active</th><th>Actions</th></tr></thead>
                <tbody>
                @foreach($departments as $d)
                    <tr>
                        <td>{{ $d->id }}</td>
                        <td>{{ $d->name }}</td>
                        <td>{{ $d->code }}</td>
                        <td>{{ $d->is_active ? 'Yes' : 'No' }}</td>
                        <td>
                            <a href="{{ route('departments.edit',$d->id) }}" class="btn btn-sm btn-secondary">Edit</a>
                            <form action="{{ route('departments.destroy',$d->id) }}" method="POST" style="display:inline-block" onsubmit="return confirm('Hapus department?');">
                                @csrf @method('DELETE')
                                <button class="btn btn-sm btn-danger">Hapus</button>
                            </form>
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
            {{ $departments->links() }}
        </div>
    </div>
</div>
@endsection
