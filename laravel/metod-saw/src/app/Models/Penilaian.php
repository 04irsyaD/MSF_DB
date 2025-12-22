<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penilaian extends Model
{
    protected $fillable = [
        'karyawan_id',
        'periode_penilaian_id',
        'kriteria_id',
        'sub_kriteria_id',
        'nilai',
        'penilai_id',
        'catatan',
        'status',
        'approved_by',
        'approved_at',
        'approval_note'
    ];

    protected $casts = [
        'nilai' => 'decimal:2'
    ];

    // Relationship dengan User (karyawan)
    public function karyawan()
    {
        return $this->belongsTo(User::class, 'karyawan_id');
    }

    // Relationship dengan User (penilai)
    public function penilai()
    {
        return $this->belongsTo(User::class, 'penilai_id');
    }

    // Relationship dengan PeriodePenilaian
    public function periodePenilaian()
    {
        return $this->belongsTo(PeriodePenilaian::class);
    }

    // Relationship dengan Kriteria
    public function kriteria()
    {
        return $this->belongsTo(Kriteria::class);
    }

    // Relationship dengan SubKriteria
    public function subKriteria()
    {
        return $this->belongsTo(SubKriteria::class);
    }

    // Scope untuk penilaian berdasarkan periode
    public function scopeByPeriode($query, $periodeId)
    {
        return $query->where('periode_penilaian_id', $periodeId);
    }

    // Scope untuk penilaian berdasarkan karyawan
    public function scopeByKaryawan($query, $karyawanId)
    {
        return $query->where('karyawan_id', $karyawanId);
    }
}
