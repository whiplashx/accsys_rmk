<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AreasTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Sample area names for the seeder
        $areas = [
            'Vision, Mission, Goals and Objectives',
            'Faculty',
            'Curriculum and Instruction',
            'Support to Students',
            'Research',
            'Extension and Community Involvement',
            'Library',
            'Physical Plant and Facilities',
            'Laboratories',
            'Administration'
        ];

        // Insert each area with program_id = 2
        foreach ($areas as $area) {
            DB::table('areas')->insert([
                'name' => $area,
                'program_id' => 2,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
