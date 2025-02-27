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
        'created_at', 
        'updated_at'
    ];

    protected $table = 'tasks';

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assignee');
    }

    public function indicator()
    {
        return $this->hasOne(Indicator::class, 'task', 'id'); // Linking task to its related indicator
    }
}