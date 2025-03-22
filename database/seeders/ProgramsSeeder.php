<?php

namespace Database\Seeders;

use App\Models\Program;
use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\Area;
use Carbon\Carbon;

class ProgramsSeeder extends Seeder
{
    public function run()
    {
        $areas = Area::all();

        $programs = [
            ['name' => 'Colege of Computer Studies', 'college' => 'CpE'],
            ['name' => 'Colege of Computer Studies', 'college' => 'IT'],
            ['name' => 'College of Teacher Education', 'college' => 'EDU'],
            ['name' => 'College of Arts and Sciences', 'college' => 'PolSci'],  
            ['name' => 'College of Fisheries', 'college' => 'Fi'],
        ];

        foreach ($programs as $dept) {
            // Generate random scheduling dates for some programs
            $hasSchedule = rand(0, 1) === 1;
            $now = Carbon::now();
            

            
            Program::create([
                'name' => $dept['name'],
                'college' => $dept['college'],
                // 'areaID' => $areas->random()->id,
                'schedule' => null,
                'schedule_start' => null,
                'schedule_end' => null,
            ]);
        }
    }
}