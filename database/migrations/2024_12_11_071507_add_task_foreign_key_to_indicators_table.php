<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTaskForeignKeyToIndicatorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('indicators', function (Blueprint $table) {
            // Ensure 'task' column exists and is unsigned
            $table->unsignedBigInteger('task')->nullable()->change();

            // Add foreign key constraint
            $table->foreign('task')
                  ->references('id')
                  ->on('tasks')
                  ->onDelete('cascade'); // Optional: adjust cascade behavior as needed
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('indicators', function (Blueprint $table) {
            // Drop foreign key constraint
            $table->dropForeign(['task']);
            
            // Optionally, revert the column back to the original state
            $table->integer('task')->nullable()->change();
        });
    }
}
