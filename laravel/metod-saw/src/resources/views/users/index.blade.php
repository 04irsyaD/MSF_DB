@extends('layouts.dashboard')

@section('title','Manajemen User')

@section('content')
<div class="container-fluid">
    <div class="card">
        <div class="card-body">
            <div class="d-flex justify-content-between mb-3 align-items-center">
                <h5 class="card-title mb-0">Daftar User</h5>
                <div class="d-flex gap-2 align-items-center">
                    <form id="bulk-form" method="POST" action="{{ route('users.bulk') }}" onsubmit="return confirmBulkAction();">
                        @csrf
                        <div class="input-group">
                            <select name="action" id="bulk-action" class="form-select">
                                <option value="">-- Pilih aksi bulk --</option>
                                <option value="enable">Aktifkan</option>
                                <option value="disable">Nonaktifkan</option>
                                <option value="delete">Hapus</option>
                            </select>
                            <button class="btn btn-secondary" type="submit">Apply</button>
                        </div>
                        <input type="hidden" name="ids" id="bulk-ids" />
                    </form>
                    <a href="{{ route('users.create') }}" class="btn btn-primary">Buat User</a>
                </div>
            </div>

            @if(session('success'))
                <div class="alert alert-success">{{ session('success') }}</div>
            @endif
            @if(session('error'))
                <div class="alert alert-danger">{{ session('error') }}</div>
            @endif
@extends('layouts.dashboard')

@section('title','Manajemen User')

@section('content')
<div class="container-fluid">
    <div class="card">
        <div class="card-body">
            <div class="d-flex justify-content-between mb-3 align-items-center">
                <h5 class="card-title mb-0">Daftar User</h5>
                <div class="d-flex gap-2 align-items-center">
                    <form id="bulk-form" method="POST" action="{{ route('users.bulk') }}">
                        @csrf
                        <div class="input-group">
                            <select name="action" id="bulk-action" class="form-select">
                                <option value="">-- Pilih aksi bulk --</option>
                                <option value="enable">Aktifkan</option>
                                <option value="disable">Nonaktifkan</option>
                                <option value="delete">Hapus</option>
                            </select>
                            <button class="btn btn-secondary" type="submit">Apply</button>
                        </div>
                        <input type="hidden" name="ids" id="bulk-ids" />
                    </form>
                    <a href="{{ route('users.create') }}" class="btn btn-primary">Buat User</a>
                </div>
            </div>

            @if(session('success'))
                <div class="alert alert-success">{{ session('success') }}</div>
            @endif
            @if(session('error'))
                <div class="alert alert-danger">{{ session('error') }}</div>
            @endif

            <!-- Delete confirmation modal -->
            <div class="modal fade" id="bulkDeleteModal" tabindex="-1" aria-labelledby="bulkDeleteModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="bulkDeleteModalLabel">Konfirmasi Hapus</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>Anda akan menghapus <strong id="bulk-delete-count">0</strong> user:</p>
                            <ul id="bulk-delete-names" class="list-group list-group-flush small"></ul>
                            <p class="mt-2 text-danger">Tindakan ini tidak dapat dibatalkan.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                            <button type="button" id="confirm-bulk-delete" class="btn btn-danger">Hapus</button>
                        </div>
                    </div>
                </div>
            </div>

            <table class="table table-striped">
                <thead>
                    <tr>
                        <th style="width:40px"><input type="checkbox" id="check-all" /></th>
                        <th>#</th>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Active</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($users as $u)
                        <tr>
                            <td><input type="checkbox" class="row-check" value="{{ $u->id }}" data-name="{{ $u->name }}" /></td>
                            <td>{{ $loop->iteration + ($users->currentPage()-1)*$users->perPage() }}</td>
                            <td>{{ $u->name }}</td>
                            <td>{{ $u->email }}</td>
                            <td>{{ $u->role }}</td>
                            <td>{{ $u->is_active ? 'Yes' : 'No' }}</td>
                            <td class="text-end">
                                <a href="{{ route('users.edit',$u->id) }}" class="btn btn-sm btn-outline-secondary">Edit</a>
                                @if(auth()->id() !== $u->id)
                                    <form action="{{ route('users.destroy',$u->id) }}" method="POST" style="display:inline-block" onsubmit="return confirm('Hapus user ini?');">
                                        @csrf
                                        @method('DELETE')
                                        <button class="btn btn-sm btn-danger">Hapus</button>
                                    </form>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="7">Belum ada user.</td></tr>
                    @endforelse
                </tbody>
            </table>

            {{ $users->links() }}
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
    // master checkbox and collect selected ids to hidden input
    document.addEventListener('DOMContentLoaded', function(){
        const checkAll = document.getElementById('check-all');
        const rowChecks = Array.from(document.querySelectorAll('.row-check'));
        const bulkIds = document.getElementById('bulk-ids');
        const bulkDeleteModal = new bootstrap.Modal(document.getElementById('bulkDeleteModal'));
        const bulkDeleteNamesEl = document.getElementById('bulk-delete-names');
        const bulkDeleteCountEl = document.getElementById('bulk-delete-count');
        const confirmBulkDeleteBtn = document.getElementById('confirm-bulk-delete');

        if (checkAll){
            checkAll.addEventListener('change', function(){
                rowChecks.forEach(ch => ch.checked = checkAll.checked);
            });
        }

        // update hidden ids before submit; handle delete via modal
        const form = document.getElementById('bulk-form');
        if (form){
            form.addEventListener('submit', function(e){
                e.preventDefault();
                const action = document.getElementById('bulk-action').value;
                const selectedCheckboxes = rowChecks.filter(r => r.checked);
                const selected = selectedCheckboxes.map(r => r.value);
                if (selected.length === 0){
                    alert('Pilih setidaknya satu user untuk aksi bulk.');
                    return false;
                }

                if (!action){ alert('Pilih aksi bulk terlebih dahulu.'); return false; }

                if (action === 'delete'){
                    // populate modal with names
                    bulkDeleteNamesEl.innerHTML = '';
                    selectedCheckboxes.forEach(ch => {
                        const name = ch.dataset.name || ch.value;
                        const li = document.createElement('li');
                        li.className = 'list-group-item';
                        li.textContent = name;
                        bulkDeleteNamesEl.appendChild(li);
                    });
                    bulkDeleteCountEl.textContent = selected.length;
                    // show modal
                    bulkDeleteModal.show();
                    // when confirmed, set ids and submit
                    const onConfirm = function(){
                        bulkIds.value = selected.join(',');
                        // remove listener to avoid double-submit
                        confirmBulkDeleteBtn.removeEventListener('click', onConfirm);
                        form.submit();
                    };
                    confirmBulkDeleteBtn.addEventListener('click', onConfirm);
                    return false;
                }

                // non-delete actions: set ids and submit
                bulkIds.value = selected.join(',');
                form.submit();
            });
        }
    });

    // kept for backward compatibility if needed
    function confirmBulkAction(){
        return true;
    }
</script>
@endsection
