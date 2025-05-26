<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exhibit extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'description',
        'file_path',
        'file_name',
        'file_type',
        'mime_type',
        'area_id',
        'program_id',
        'uploaded_by', // Changed from user_id to uploaded_by to match migration
    ];
    
    /**
     * Get the area that owns the exhibit.
     */
    public function area()
    {
        return $this->belongsTo(Area::class);
    }
    
    /**
     * Get the program that owns the exhibit.
     */
    public function program()
    {
        return $this->belongsTo(Program::class);
    }
    
    /**
     * Get the user that uploaded the exhibit.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'uploaded_by'); // Specify the foreign key
    }
}
