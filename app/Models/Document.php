<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'path', 'task_id', 'user_id', 'indicator_id'];

    // Define inverse relationships
    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function indicator()
    {
        return $this->belongsTo(Indicator::class);
    }
}
