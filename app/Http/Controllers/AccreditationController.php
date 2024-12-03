<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Area;

class AccreditationController extends Controller
{
    public function index()
    {
        $areas = Area::with('parameters.indicators')->get(); // Assumes relationships exist
        return response()->json($areas);
    }
}
