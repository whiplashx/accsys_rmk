<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\Area;

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
            Department::create([
                'name' => $dept['name'],
                'code' => $dept['code'],
                //'areaID' => $areas->random()->id,
                'schedule' => 'TBA',
            ]);
        }
    }
}