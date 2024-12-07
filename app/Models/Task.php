<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'assignee', 'status', 'criteria_id'];

    public function criterion()
    {
        return $this->belongsTo(Indicator::class);
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assignee');
    }
}

