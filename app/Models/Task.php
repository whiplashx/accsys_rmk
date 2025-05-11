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
        'program_id',
        'selfsurvey_rating',
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
        return $this->hasOne(Indicator::class, 'task', 'id');
    }    public function documents()
    {
        return $this->hasMany(Document::class, 'task_id');
    }
    
    /**
     * Get tasks related to a specific indicator by ID
     * 
     * @param int $indicatorId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getTasksByIndicator($indicatorId)
    {
        return self::where('indicator_id', $indicatorId)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}