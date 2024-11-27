<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


class CreateIndicatorsTable extends Migration
{
    public function up()
    {


        // Modify the 'indicators' table
        Schema::create('indicators', function (Blueprint $table) {
            // Add the new columns
            $table->unsignedBigInteger('indicatorsid')->nullable();
            $table->string('indicatorName')->nullable();
            $table->unsignedBigInteger('docid')->nullable();
            $table->unsignedBigInteger('reviewid')->nullable();
            $table->string('status')->nullable();
            $table->unsignedBigInteger('taskforceid')->nullable();
            $table->unsignedBigInteger('subid')->nullable();
            $table->unsignedBigInteger('paramId')->nullable();
            $table->unsignedBigInteger('departmentsid')->nullable();

            // Set up foreign key relations if necessary (you can adjust the table names as per your relationships)
            $table->foreign('paramId')->references('id')->on('parameters')->onDelete('cascade');
            $table->foreign('departmentsid')->references('id')->on('departments')->onDelete('cascade');
        });
    }

    public function down()
    {
        // Drop the 'indicators' table or revert the changes

        Schema::dropIfExists('indicators');
    }
}

