<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use HasFactory;

    protected $table = 'areas';

    protected $fillable = [
        'name',
        'program_id'
    ];

    public function parameters()
    {
        return $this->hasMany(Parameter::class);
    }

    public function program()
    {
        return $this->belongsTo(Program::class);
    }
}

