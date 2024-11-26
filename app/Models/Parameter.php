<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Parameter extends Model
{
    protected $fillable = ['id', 'area_id', 'name'];

    public function indicator()
    {
        return $this->hasMany(Indicator::class);
    }
}
