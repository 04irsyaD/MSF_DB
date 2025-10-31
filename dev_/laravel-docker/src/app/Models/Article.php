<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\relations\BelongsTo;
use App\Models\User;

class Article extends Model
{
    use HasFactory;

    // Tambahkan properti ini
    protected $fillable = ['title', 'content', 'pdf_path', 'user_id', 'category_id', 'level'];

    /**
     * Relasi ke user yang membuat article
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke category
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get level options
     */
    public static function getLevelOptions(): array
    {
        return [
            'pemula' => 'Pemula',
            'menengah' => 'Menengah',
            'lanjutan' => 'Lanjutan',
        ];
    }

    /**
     * Get level label
     */
    public function getLevelLabelAttribute(): string
    {
        return self::getLevelOptions()[$this->level] ?? ucfirst($this->level);
    }

    /**
     * Get level badge color
     */
    public function getLevelBadgeColorAttribute(): string
    {
        return match($this->level) {
            'pemula' => 'bg-green-100 text-green-800',
            'menengah' => 'bg-yellow-100 text-yellow-800',
            'lanjutan' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

}