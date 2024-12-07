<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Indicator extends Model
{
    use HasFactory;

    protected $fillable = ['description', 'parameter_id'];

    public function parameter()
    {
        return $this->belongsTo(Parameter::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
