<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function getUserId(Request $request)
    {
        // Assuming user is authenticated
        if (Auth::check()) {
            return response()->json(['id' => Auth::id()]);
        }

        return response()->json(['message' => 'User not authenticated'], 401);
    }
    public function getLocalTaskForceUsers()
    {
        return User::where('role', 'localtaskforce')->get();
    }
}

