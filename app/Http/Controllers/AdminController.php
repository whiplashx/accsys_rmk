<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    //
    public function getUser(){
        $data = DB::table('users')
        ->get();

        return response()->json($data);
    }
}
