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
        Schema::table('users', function (Blueprint $table) {
            // Add the departments column as a foreign key
            $table->unsignedBigInteger('departments')->nullable();

            // Define the foreign key constraint
            $table->foreign('departments')
                ->references('id')
                ->on('departments')
                ->onDelete('set null'); // Set to null if the department is deleted
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop the foreign key constraint first
            $table->dropForeign(['departments']);

            // Drop the departments column
            $table->dropColumn('departments');
        });
    }
};
