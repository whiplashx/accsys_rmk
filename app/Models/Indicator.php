<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Indicator extends Model
{
    protected $fillable = ['parameter_id', 'documents', 'description', 'task'];

    // Define a relationship with the Task model (if tasks are stored in a separate table)protected $table = 'indicators';

    protected $table = 'indicators';
    public function task()
    {
        return $this->belongsTo(Task::class, 'task', 'id'); // Assuming 'task' in indicators is a foreign key referencing 'id' in tasks
    }

    // If documents are stored as JSON, parse them directly or establish a relationship
    public function documents()
    {
        return $this->hasMany(Document::class, 'documents');
    }
    public function parameter()
{
    return $this->belongsTo(Parameter::class, 'parameter_id'); // Assuming 'parameter_id' is the foreign key
}

}
