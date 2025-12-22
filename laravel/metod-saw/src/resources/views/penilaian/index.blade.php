@extends('layouts.dashboard')

@section('title','Penilaian')

@section('content')
<div class="container-fluid">
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Daftar Penilaian</h5>
            <div class="mb-2">
                @if(auth()->check() && in_array(auth()->user()->role, config('roles.groups.penilaian', [])))
                    <a href="{{ route('penilaian.create') }}" class="btn btn-sm btn-primary">Tambah Penilaian</a>
                @endif
            </div>
            <p class="text-muted">Berisi penilaian yang sudah diinput per karyawan dan kriteria.</p>

            <table class="table table-sm table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Karyawan</th>
                        <th>Kriteria</th>
                        <th>Nilai</th>
                        <th>Periode</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($penilaians as $p)
                        <tr>
                            <td>{{ $loop->iteration + ($penilaians->currentPage()-1)*$penilaians->perPage() }}</td>
                            <td>{{ $p->karyawan->name ?? 'N/A' }}</td>
                            <td>{{ $p->kriteria->nama_kriteria ?? 'N/A' }}</td>
                            <td>{{ $p->nilai }}</td>
                            <td>{{ optional($p->periodePenilaian)->nama_periode ?? '-' }}</td>
                            <td>{{ ucfirst($p->status ?? 'pending') }}</td>
                            <td>
                                @if(auth()->check() && in_array(auth()->user()->role, config('roles.groups.approvals', [])) && ($p->status ?? 'pending') === 'pending')
                                    <button type="button" class="btn btn-sm btn-success btn-open-approve" data-action="{{ route('penilaian.approve', $p->id) }}">Approve</button>
                                    <button type="button" class="btn btn-sm btn-danger btn-open-reject" data-action="{{ route('penilaian.reject', $p->id) }}" style="margin-left:6px">Reject</button>
                                @else
                                    -
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="5">Belum ada data penilaian.</td></tr>
                    @endforelse
                </tbody>
            </table>

            {{ $penilaians->links() }}
        </div>
    </div>
</div>
<!-- Confirmation modal for approve/reject -->
<div class="modal fade" id="confirmModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <form id="confirmForm" method="POST">
                @csrf
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmModalLabel">Konfirmasi</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p id="confirmMessage">Apakah Anda yakin?</p>
                    <div class="mb-3">
                        <label for="confirmNote" class="form-label">Catatan (opsional)</label>
                        <textarea id="confirmNote" name="note" class="form-control" rows="3"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                    <button type="submit" id="confirmSubmit" class="btn btn-primary">OK</button>
                </div>
            </form>
        </div>
    </div>
</div>

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function(){
    var modalEl = document.getElementById('confirmModal');
    var bsModal = new bootstrap.Modal(modalEl);
    var form = document.getElementById('confirmForm');
    var msg = document.getElementById('confirmMessage');
    var note = document.getElementById('confirmNote');
    var submitBtn = document.getElementById('confirmSubmit');

    function openModal(actionUrl, type){
        form.action = actionUrl;
        msg.textContent = type === 'approve' ? 'Apakah Anda yakin ingin menyetujui penilaian ini?' : 'Apakah Anda yakin ingin menolak penilaian ini?';
        submitBtn.textContent = type === 'approve' ? 'Approve' : 'Reject';
        submitBtn.className = 'btn btn-sm ' + (type === 'approve' ? 'btn-success' : 'btn-danger');
        note.value = '';
        bsModal.show();
    }

    document.querySelectorAll('.btn-open-approve').forEach(function(b){
        b.addEventListener('click', function(){ openModal(this.dataset.action, 'approve'); });
    });
    document.querySelectorAll('.btn-open-reject').forEach(function(b){
        b.addEventListener('click', function(){ openModal(this.dataset.action, 'reject'); });
    });
});
</script>
</push>
@endsection
