<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'assignee',
        'status',
        'indicator_id',
    ];

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assignee');
    }

    public function indicator()
    {
        return $this->belongsTo(Indicator::class);
    }
}

