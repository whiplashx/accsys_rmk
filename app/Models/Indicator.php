<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Indicator extends Model
{
    protected $fillable = [
        'criteriaid', 'criteriaName', 'docid', 'reviewid', 'status', 
        'taskforceid', 'subid', 'paramId', 'programid'
    ];

    public function parameter()
    {
        return $this->belongsTo(Parameter::class, 'paramId', 'id');
    }
}
