<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameCriteriaToIndicators extends Migration
{
    public function up()
    {
        // Rename the 'criteria' table to 'indicators'
        Schema::rename('criteria', 'indicators');

        // Modify the 'indicators' table to add new columns
        Schema::table('indicators', function (Blueprint $table) {
            $table->string('criteriaid')->after('id');
            $table->string('criteriaName')->after('criteriaid');
            $table->string('docid')->nullable()->after('criteriaName');
            $table->string('reviewid')->nullable()->after('docid');
            $table->string('status')->nullable()->after('reviewid');
            $table->string('taskforceid')->nullable()->after('status');
            $table->string('subid')->nullable()->after('taskforceid');
            $table->string('paramId')->after('subid');
            $table->string('programid')->nullable()->after('paramId');
        });
    }

    public function down()
    {
        // Rollback the changes: remove added columns and rename table back
        Schema::table('indicators', function (Blueprint $table) {
            $table->dropColumn([
                'criteriaid', 'criteriaName', 'docid', 'reviewid', 'status',
                'taskforceid', 'subid', 'paramId', 'programid'
            ]);
        });

        // Rename the table back to 'criteria'
        Schema::rename('indicators', 'criteria');
    }
}
