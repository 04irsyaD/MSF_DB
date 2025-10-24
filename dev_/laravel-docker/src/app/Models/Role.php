<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Relasi: role memiliki banyak user
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    // Helper methods untuk cek role
    public static function admin()
    {
        return self::where('name', 'admin')->first();
    }

    public static function penulis()
    {
        return self::where('name', 'penulis')->first();
    }

    public static function user()
    {
        return self::where('name', 'user')->first();
    }
}