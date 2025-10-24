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
    protected $fillable = ['title', 'content', 'pdf_path','user_id'];

    /**
     * Relasi ke user yang membuat article
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

}