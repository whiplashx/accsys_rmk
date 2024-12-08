<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Area;

class AreaSeeder extends Seeder
{
    public function run()
    {
        $areas = [
            'Vision, Mission, Goals and Objectives',
            'Faculty',
            'Curriculum and Instruction',
            'Students',
            'Research',
            'Extension and Community Involvement',
            'Library',
            'Physical Plant and Facilities',
            'Laboratories',
            'Administration',
        ];

        foreach ($areas as $area) {
            Area::create(['name' => $area]);
        }
    }
}

