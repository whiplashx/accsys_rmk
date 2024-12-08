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

    public function getLocalTaskForceUsers()
    {
        return User::where('role', 'localtaskforce')->get();
    }

    public function updateUser(Request $request, User $user): JsonResponse
    {
        // Validate the fields you want to allow editing.
        $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
        ]);
    
        // Update only the fields that can be modified
        $user->update([
            'name' => $request->name,
            'role' => $request->role,
            // Do not include email if it's not allowed to change.
            // 'email' => $request->email, // Comment out or remove this line
        ]);
    
        // Return success response with the updated user data
        return response()->json(['message' => 'User updated successfully!', 'user' => $user]);
    }
    
}
