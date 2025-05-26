<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Indicator extends Model
{    protected $fillable = [
        'parameter_id',
        'description',
        'documents',
        'task',
        'user_id'
    ];

    // Ensure these fields can be null
    protected $attributes = [
        'documents' => null,
        'task' => null
    ];    protected $table = 'indicators';

    // Define a relationship with the Task model
    public function task()
    {
        return $this->belongsTo(Task::class, 'task', 'id'); // Assuming 'task' in indicators is a foreign key referencing 'id' in tasks
    }

    // Define a relationship with the Document model if documents are stored in a separate table
    public function documents()
    {
        return $this->hasMany(Document::class, 'indicator_id'); // Assuming 'indicator_id' is the foreign key in the documents table
    }

    // Define a relationship with the Parameter model
    public function parameter()
    {
        return $this->belongsTo(Parameter::class, 'parameter_id'); // Assuming 'parameter_id' is the foreign key
    }

    // Define relationship with User model
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }}

