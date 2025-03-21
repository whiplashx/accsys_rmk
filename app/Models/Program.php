<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'college',
        'description',
        'schedule',
        'schedule_start',
        'schedule_end',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'programs', 'id');
    }

    // If you have a relationship with an Area model, you can define it here
    public function area()
    {
        return $this->belongsTo(Area::class, 'areaID');
    }
}

