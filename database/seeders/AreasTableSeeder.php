<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AreasTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $areas = [
            'Mission, Goals and Objectives',
            'Faculty',
            'Curriculum and Instruction',
            'Students',
            'Research',
            'Extension and Community Involvement',
            'Library',
            'Physical Facilities',
            'Laboratories',
            'Administration'
        ];

        foreach ($areas as $area) {
            DB::table('areas')->insert([
                'name' => $area,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
