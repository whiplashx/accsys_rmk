<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Area;
use App\Models\Parameter;

class ParameterSeeder extends Seeder
{
    public function run()
    {
        $parametersData = [
            'Vision, Mission, Goals and Objectives' => [
                'Statement of Vision, Mission, Goals and Objectives',
                'Dissemination and Acceptability',
                'Congruence of Activities to Vision, Mission, Goals and Objectives',
            ],
            'Faculty' => [
                'Academic Qualifications',
                'Professional Experience and Length of Service',
                'Recruitment, Selection and Orientation',
                'Rank and Tenure',
                'Teaching Assignments',
                'Research and Extension Work',
            ],
            'Curriculum and Instruction' => [
                'Curriculum',
                'Teaching-Learning Process',
                'Teaching Methods and Techniques',
                'Assessment of Academic Performance',
            ],
            // Add more areas and parameters as needed
        ];

        foreach ($parametersData as $areaName => $parameters) {
            $area = Area::where('name', $areaName)->first();
            if ($area) {
                foreach ($parameters as $parameterName) {
                    Parameter::create([
                        'area_id' => $area->id,
                        'name' => $parameterName,
                    ]);
                }
            }
        }
    }
}

