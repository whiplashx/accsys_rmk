<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentAccessRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'document_id', 
        'program_id',
        'dean_id',
        'status',
        'reason',
        'rejection_reason',
        'approved_at',
        'expires_at'
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function document()
    {
        return $this->belongsTo(Document::class);
    }

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function dean()
    {
        return $this->belongsTo(User::class, 'dean_id');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    // Helper methods
    public function isExpired()
    {
        return $this->expires_at && $this->expires_at < now();
    }

    public function hasAccess()
    {
        return $this->status === 'approved' && !$this->isExpired();
    }
}
