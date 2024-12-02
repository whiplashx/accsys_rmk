<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'areaID',
        'schedule',
    ];

    // If you have a relationship with an Area model, you can define it here
    public function area()
    {
        return $this->belongsTo(Area::class, 'areaID');
    }
}

