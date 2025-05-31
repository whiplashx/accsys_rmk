<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('document_access_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // User requesting access
            $table->foreignId('document_id')->constrained()->onDelete('cascade'); // Document being requested
            $table->foreignId('program_id')->constrained()->onDelete('cascade'); // Program the document belongs to
            $table->foreignId('dean_id')->nullable()->constrained('users')->onDelete('set null'); // Dean who can approve
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('reason')->nullable(); // Reason for request
            $table->text('rejection_reason')->nullable(); // Reason for rejection if applicable
            $table->timestamp('approved_at')->nullable(); // When it was approved
            $table->timestamp('expires_at')->nullable(); // When access expires (optional)
            $table->timestamps();
            
            // Ensure a user can't request the same document multiple times while pending
            $table->unique(['user_id', 'document_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_access_requests');
    }
};
