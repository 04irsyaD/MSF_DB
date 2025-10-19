<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    // Tambahkan properti ini
    protected $fillable = ['title', 'content', 'pdf_path'];

}