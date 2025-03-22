<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->string('name'); // Department name
            $table->string('college')->unique(); // Unique department college
            $table->string('areaID')->nullable(); // Foreign key for area
            $table->timestamp('schedule')->nullable(); // Original schedule field for backward compatibility
            $table->timestamp('schedule_start')->nullable(); // Start time for scheduling
            $table->timestamp('schedule_end')->nullable(); // End time for scheduling
            $table->timestamps(); // Created at and updated at timestamps
            // Foreign key constraints (optional, depends on the related tables)
            //$table->foreign('areaID')->references('id')->on('areas')->onDelete('set null');
        });
    }
    
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('programs');
    }
};