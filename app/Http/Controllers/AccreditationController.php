<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Parameter;
use App\Models\Indicator;
use Illuminate\Http\Request;

class AccreditationController extends Controller
{
    public function index()
    {
        $areas = Area::with('parameters.indicators')->get();
        return response()->json($areas);
    }

    public function addArea(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);
        $area = Area::create($request->all());
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

