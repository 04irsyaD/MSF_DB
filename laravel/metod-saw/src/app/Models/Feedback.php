<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $fillable = ['hasil_saw_id','user_id','message'];

    public function hasil()
    {
        return $this->belongsTo(HasilSaw::class, 'hasil_saw_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
