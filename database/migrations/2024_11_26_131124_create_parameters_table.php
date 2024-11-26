<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIndicatorTable extends Migration
{
    public function up()
    {
        Schema::create('indicator', function (Blueprint $table) {
            $table->string('id', 10)->primary();
            $table->string('parameter_id', 10);
            $table->text('description');
            $table->timestamps();

            $table->foreign('parameter_id')->references('id')->on('parameters')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('indicator');
    }
}
