<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Area;
use App\Models\Parameter;
use App\Models\Indicator;

class AccreditationController extends Controller
{
    public function index(Request $request)
    {
        $programId = $request->query('program_id');

        $query = Area::with(['parameters.indicators']);

        if ($programId) {
            $query->where('program_id', $programId);
        }

        $areas = $query->get();
        
        return response()->json($areas);
    }

    public function addArea(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'program_id' => 'required|exists:programs,id',
        ]);

        $area = Area::create([
            'name' => $validated['name'],
            'program_id' => $validated['program_id'],
        ]);

        return response()->json($area, 201);
    }

    public function addParameter(Request $request)
    {
        $request->validate([
            'area_id' => 'required|exists:areas,id',
            'name' => 'required|string|max:255'
        ]);
        $parameter = Parameter::create($request->all());
        return response()->json($parameter, 201);
    }

    public function addIndicator(Request $request)
    {
        $request->validate([
            'parameter_id' => 'required|exists:parameters,id',
            'description' => 'required|string'
        ]);
        $indicator = Indicator::create($request->all());
        return response()->json($indicator, 201);
    }

    public function deleteArea($id)
    {
        $area = Area::findOrFail($id);
        $area->delete();
        return response()->json(null, 204);
    }

    public function deleteParameter($id)
    {
        $parameter = Parameter::findOrFail($id);
        $parameter->delete();
        return response()->json(null, 204);
    }

    public function deleteIndicator($id)
    {
        $indicator = Indicator::findOrFail($id);
        $indicator->delete();
        return response()->json(null, 204);
    }
}

