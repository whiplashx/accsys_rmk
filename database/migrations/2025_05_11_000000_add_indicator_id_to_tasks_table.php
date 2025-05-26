<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */    public function up(): void
    {
        // Check if column already exists before adding
        if (!Schema::hasColumn('tasks', 'indicator_id')) {
            Schema::table('tasks', function (Blueprint $table) {
                $table->foreignId('indicator_id')->nullable()->after('program_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn('indicator_id');
        });
    }
};
