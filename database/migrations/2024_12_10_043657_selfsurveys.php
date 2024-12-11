<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Migration for SelfSurvey Table
return new class extends Migration
{
    public function up()
    {
        Schema::create('self_surveys', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('indicator_id');
            $table->string('document')->nullable();
            $table->integer('rating')->nullable();
            $table->unsignedBigInteger('assignee_id');
            $table->timestamps();

            $table->foreign('indicator_id')->references('id')->on('indicators')->onDelete('cascade');
            $table->foreign('assignee_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('self_surveys');
    }
};

