<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubKriteria extends Model
{
    protected $fillable = [
        'kriteria_id',
        'nama_sub_kriteria',
        'nilai', 
        'deskripsi',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'nilai' => 'decimal:2'
    ];

    // Relationship dengan Kriteria
    public function kriteria()
    {
        return $this->belongsTo(Kriteria::class);
    }

    // Relationship dengan Penilaian
    public function penilaians()
    {
        return $this->hasMany(Penilaian::class);
    }

    // Scope untuk sub kriteria aktif
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
