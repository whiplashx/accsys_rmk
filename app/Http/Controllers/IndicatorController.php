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
}
