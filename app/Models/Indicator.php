<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Indicator extends Model
{
    use HasFactory;

    protected $fillable = ['description', 'parameter_id', 'task'];

    public function parameter()
    {
        return $this->belongsTo(Parameter::class);
    }
    public function task()
{
    return $this->belongsTo(Task::class, 'task');
}

}

