<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
class AdminController extends Controller
{
    //
    public function getUser(){
        $data = DB::table('users')
        ->get();

        return response()->json($data);
    }


    public function updateUser(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            //'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);
        
    
        $user->update([
            'name' => $request->name,
            'role' => $request->role,
            'email' => $request->email,
        ]);
    
        return response()->json(['message' => 'User updated successfully!', 'user' => $user]);
    }
    
}
