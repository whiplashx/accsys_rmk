<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Parameter extends Model
{
    //
    public function area()
{
    return $this->belongsTo(Area::class);
}

public function indicators()
{
    return $this->hasMany(Indicator::class);
}

}
