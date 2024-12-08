<?php

namespace App\Http\Controllers;

use App\Models\Indicator;
use App\Models\Parameter;
use Illuminate\Http\Request;

class IndicatorController extends Controller
{
    public function index(Parameter $parameter)
    {
        return $parameter->indicators()->whereNull('task')->get();
    }
}
