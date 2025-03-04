<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     * 
     */
    
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'departments',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        // Remove the empty cast for status since it's a varchar(255)
    ];
    
    public function tasks()
    {
        return $this->hasMany(Task::class, 'assignee');
    }
    
    public function department()
    {
        return $this->belongsTo(Department::class, 'departments', 'id');
    }

    // Add a helper method to check if the user is active
    public function isActive()
    {
        return $this->status === 'active';
    }
}

