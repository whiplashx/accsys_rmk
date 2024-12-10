<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('indicators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parameter_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('documents')->nullable();
            $table->foreign('documents')->references('id')->on('documents')->onDelete('set null')->onUpdate('set null');
            $table->text('description');
            $table->text('task')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('indicators');
    }
};

