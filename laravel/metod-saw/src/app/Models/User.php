<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'employee_id',
        'department',
        'position',
        'phone',
        'hire_date',
        'is_active'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'hire_date' => 'date',
            'is_active' => 'boolean'
        ];
    }

    // Relationship dengan Penilaian sebagai karyawan yang dinilai
    public function penilaianSebagaiKaryawan()
    {
        return $this->hasMany(Penilaian::class, 'karyawan_id');
    }

    // Relationship dengan Penilaian sebagai penilai
    public function penilaianSebagaiPenilai()
    {
        return $this->hasMany(Penilaian::class, 'penilai_id');
    }

    // Relationship dengan HasilSaw
    public function hasilSaws()
    {
        return $this->hasMany(HasilSaw::class, 'karyawan_id');
    }

    // Scope untuk role tertentu
    public function scopeRole($query, $role)
    {
        return $query->where('role', $role);
    }

    // Scope untuk karyawan aktif
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope untuk karyawan (bukan admin)
    public function scopeKaryawan($query)
    {
        return $query->where('role', 'karyawan');
    }

    // Check apakah user adalah super admin
    public function isSuperAdmin()
    {
        return $this->role === 'super_admin';
    }

    // Check apakah user adalah admin atau super admin
    public function isAdmin()
    {
        return in_array($this->role, ['admin', 'super_admin']);
    }

    // Check apakah user adalah HR
    public function isHR()
    {
        return $this->role === 'hr';
    }
}
