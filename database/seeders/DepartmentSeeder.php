<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\Area;
use Carbon\Carbon;

class DepartmentSeeder extends Seeder
{
    public function run()
    {
        $areas = Area::all();

        $departments = [
            ['name' => 'Computer Engineering', 'code' => 'CpE'],
            ['name' => 'Information Technology', 'code' => 'IT'],
            ['name' => 'Education', 'code' => 'EDU'],
            ['name' => 'Political Science', 'code' => 'PolSci'],  
            ['name' => 'Fisheries', 'code' => 'Fi'],
        ];

        foreach ($departments as $dept) {
            // Generate random scheduling dates for some departments
            $hasSchedule = rand(0, 1) === 1;
            $now = Carbon::now();
            
            $scheduleStart = $hasSchedule ? $now->copy()->addDays(rand(-5, 30)) : null;
            $scheduleEnd = $scheduleStart ? $scheduleStart->copy()->addDays(rand(5, 60)) : null;
            
            Department::create([
                'name' => $dept['name'],
                'code' => $dept['code'],
                // 'areaID' => $areas->random()->id,
                'schedule' => $scheduleStart ? $scheduleStart->toDateTimeString() : null,
                'schedule_start' => $scheduleStart ? $scheduleStart->toDateTimeString() : null,
                'schedule_end' => $scheduleEnd ? $scheduleEnd->toDateTimeString() : null,
            ]);
        }
    }
}