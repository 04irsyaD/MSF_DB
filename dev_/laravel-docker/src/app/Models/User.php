<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Relasi: user memiliki banyak article
     */
    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }

    /**
     * Relasi: user belongs to role
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    // Helper methods untuk cek role
    public function isAdmin(): bool
    {
        return $this->role->name === 'admin';
    }

    public function isPenulis(): bool
    {
        return $this->role->name === 'penulis';
    }

    public function isUser(): bool
    {
        return $this->role->name === 'user';
    }

    public function hasRole(string $roleName): bool
    {
        return $this->role->name === $roleName;
    }

    public function canManageUsers(): bool
    {
        return $this->isAdmin();
    }

    public function canCreateArticle(): bool
    {
        return $this->isAdmin() || $this->isPenulis();
    }

    public function canEditArticle($article): bool
    {
        if ($this->isAdmin()) {
            return true;
        }
        
        if ($this->isPenulis()) {
            return $article->user_id === $this->id;
        }
        
        return false;
    }

    public function canDeleteArticle($article): bool
    {
        return $this->canEditArticle($article);
    }
}
