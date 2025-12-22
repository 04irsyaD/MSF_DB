<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HasilSaw extends Model
{
    protected $fillable = [
        'karyawan_id',
        'periode_penilaian_id',
        'nilai_preferensi',
        'ranking',
        'detail_perhitungan'
    ];

    protected $casts = [
        'nilai_preferensi' => 'decimal:6',
        'detail_perhitungan' => 'array'
    ];

    // Relationship dengan User (karyawan)
    public function karyawan()
    {
        return $this->belongsTo(User::class, 'karyawan_id');
    }

    // Relationship dengan PeriodePenilaian
    public function periodePenilaian()
    {
        return $this->belongsTo(PeriodePenilaian::class);
    }

    // Scope untuk hasil berdasarkan periode
    public function scopeByPeriode($query, $periodeId)
    {
        return $query->where('periode_penilaian_id', $periodeId);
    }

    // Scope untuk urutan ranking
    public function scopeOrderByRanking($query)
    {
        return $query->orderBy('ranking', 'asc');
    }

    // Scope untuk top performers
    public function scopeTopPerformers($query, $limit = 10)
    {
        return $query->orderBy('ranking', 'asc')->limit($limit);
    }
}
