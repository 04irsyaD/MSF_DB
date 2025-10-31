<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    /**
     * Relasi: category memiliki banyak articles
     */
    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }

    /**
     * Get category by slug
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }
}