<?php

namespace App\Http\Controllers;

use App\Models\Indicator;
use App\Models\Parameter;
use Illuminate\Http\Request;

class IndicatorController extends Controller
{
    public function index()
    {
        $indicator = Indicator::with('parameter')->get();
        return response()->json($indicator);
    }
    public function getRatings()
    {
        try {
            $ratings = Indicator::with(['task' => function ($query) {
                $query->select('id', 'selfsurvey_rating'); // Only select the selfsurvey_rating and task ID
            }])->get(['id', 'task']); // Select only indicator ID and task field
    
            return response()->json($ratings);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch selfsurvey ratings'], 500);
        }
    }
    
}
