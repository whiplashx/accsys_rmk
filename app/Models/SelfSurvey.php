<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SelfSurvey extends Model
{
    use HasFactory;

    protected $fillable = [
        'indicator_id',
        'document',
        'rating',
        'assignee_id',
    ];

    public function indicator()
    {
        return $this->belongsTo(Indicator::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }
}
