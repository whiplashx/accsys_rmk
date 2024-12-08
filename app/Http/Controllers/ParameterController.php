<?php

namespace App\Http\Controllers;

use App\Models\Area;
use Illuminate\Http\Request;

class ParameterController extends Controller
{
    public function index(Area $area)
    {
        return $area->parameters;
    }
}

