<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SelfSurvey extends Model
{
    use HasFactory;

    protected $fillable = ['task_id', 'indicator_id', 'ratings'];

    protected $casts = [
        'ratings' => 'array',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function indicator()
    {
        return $this->belongsTo(Indicator::class);
    }
}

