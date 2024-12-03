<?php
namespace App\Http\Controllers;

use App\Models\Area;
use Illuminate\Http\Request;

class AccreditationController extends Controller
{
    public function index()
    {
        $areas = Area::with('parameters.indicators')->get(); // Load relationships
        return response()->json($areas);
    }
}
