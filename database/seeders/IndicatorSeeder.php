<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Parameter;
use App\Models\Indicator;

class IndicatorSeeder extends Seeder
{
    public function run()
    {
        $indicatorsData = [
            'Statement of Vision, Mission, Goals and Objectives' => [
                'The institution has a clear statement of its vision and mission.',
                'The goals and objectives are consistent with the vision and mission.',
                "The vision, mission, goals, and objectives reflect the institution's educational philosophy.",
            ],
            'Academic Qualifications' => [
                'Faculty members possess the required academic degrees for their teaching assignments.',
                'A significant number of faculty members have graduate degrees in their field of specialization.',
                'Faculty members regularly update their knowledge through further studies, training, or professional development activities.',
            ],
            'Curriculum' => [
                'The curriculum is aligned with the Commission on Higher Education (CHED) policies and standards.',
                "The curriculum reflects the institution's vision, mission, goals, and objectives.",
                'The curriculum is regularly reviewed and updated to meet industry and societal needs.',
                'The curriculum includes opportunities for research, community service, and internships.',
            ],
            // Add more parameters and indicators as needed
        ];

        foreach ($indicatorsData as $parameterName => $indicators) {
            $parameter = Parameter::where('name', $parameterName)->first();
            if ($parameter) {
                foreach ($indicators as $indicatorDescription) {
                    Indicator::create([
                        'parameter_id' => $parameter->id,
                        'description' => $indicatorDescription,
                    ]);
                }
            }
        }
    }
}

