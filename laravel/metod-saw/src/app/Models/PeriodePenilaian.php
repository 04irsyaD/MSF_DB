<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PeriodePenilaian extends Model
{
    protected $fillable = [
        'nama_periode',
        'tahun', 
        'bulan',
        'status',
        'tanggal_mulai',
        'tanggal_selesai',
        'deskripsi'
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date'
    ];

    // Relationship dengan Penilaian
    public function penilaians()
    {
        return $this->hasMany(Penilaian::class);
    }

    // Relationship dengan HasilSaw
    public function hasilSaws()
    {
        return $this->hasMany(HasilSaw::class);
    }

    // Scope untuk periode aktif
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // Scope untuk periode berdasarkan tahun
    public function scopeByYear($query, $year)
    {
        return $query->where('tahun', $year);
    }

    // Get nama bulan dalam bahasa Indonesia
    public function getBulanIndonesiaAttribute()
    {
        $bulan = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret',
            4 => 'April', 5 => 'Mei', 6 => 'Juni',
            7 => 'Juli', 8 => 'Agustus', 9 => 'September', 
            10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];
        return $bulan[$this->bulan] ?? '';
    }
}
