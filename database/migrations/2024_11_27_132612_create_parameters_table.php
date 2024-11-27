<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParametersTable extends Migration
{
    public function up()
    {
        Schema::create('parameters', function (Blueprint $table) {
            $table->unsignedBigInteger('id', 10)->primary();
            $table->unsignedBigInteger('area_id', 10);
            $table->string('name');
            $table->timestamps();

            $table->foreign('area_id')->references('id')->on('areas')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('parameters');
    }
}
