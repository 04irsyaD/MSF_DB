<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kriteria extends Model
{
    protected $fillable = [
        'kode_kriteria',
        'nama_kriteria', 
        'jenis_kriteria',
        'bobot',
        'deskripsi',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'bobot' => 'decimal:4'
    ];

    // Relationship dengan SubKriteria
    public function subKriterias()
    {
        return $this->hasMany(SubKriteria::class);
    }

    // Relationship dengan Penilaian
    public function penilaians()
    {
        return $this->hasMany(Penilaian::class);
    }

    // Scope untuk kriteria aktif
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope untuk jenis kriteria
    public function scopeJenis($query, $jenis)
    {
        return $query->where('jenis_kriteria', $jenis);
    }
}
