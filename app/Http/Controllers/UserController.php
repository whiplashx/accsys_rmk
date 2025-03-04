<?php

namespace App\Http\Controllers;

use App\Mail\LoginCredentials;
use App\Models\User;
use App\Models\Department;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Mail;
use Spatie\Permission\Models\Role;
use Str;

class UserController extends Controller
{
    /**
     * Get user ID for the authenticated user
     */
    public function getUserId(Request $request)
    {
        return response()->json(['id' => $request->user()->id]);
    }

    public function getLocalTaskForceUsers()
    {
        return User::where('role', 'localtaskforce')->get();
    }

    /**
     * Get all users for the admin dashboard
     */
    public function getUsers()
    {
        $users = User::all();
        return response()->json($users);
    }

    /**
     * Get all departments for user management
     */
    public function getDepartments()
    {
        $departments = Department::all();
        return response()->json($departments);
    }

    /**
     * Update user information
     */
    public function updateUser(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);
            
            // Validate the incoming request
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'role' => 'required|string',
                'departments' => 'required',
                'status' => 'required|string|in:active,inactive',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Update the user with validated data
            $user->name = $request->name;
            $user->role = $request->role;
            $user->departments = $request->departments;
            $user->status = $request->status;
            $user->save();
            
            return response()->json($user);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating user',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Delete a user
     */
    public function deleteUser($id)
    {
        try {
            $user = User::findOrFail($id);
            
            // Prevent deletion of the authenticated user
            if ($user->id === auth()->id()) {
                return response()->json(['message' => 'Cannot delete your own account'], 403);
            }
            
            $user->delete();
            return response()->json(['message' => 'User deleted successfully']);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting user',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Create a new user (for AddUserModal)
     */
    
    public function createUser(Request $request): RedirectResponse//|JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'role' => 'required|string|in:admin,localtaskforce,localaccreditor',
            'departments' => 'required|exists:departments,id',
        ]);
        
        // Generate a random password
        $password = Str::random(10);
        
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'departments' => $validated['departments'],
            'password' => Hash::make($password),
            'status' => 'active',
        ]);

        $role = Role::findByName($request->role);
        $user->assignRole($role);
        
        // Send the login credentials email using the LoginCredentials mailable
        Mail::to($user->email)->send(new LoginCredentials($user->name, $user->email, $password));

        event(new Registered($user));

        return redirect(route('accounts'));
    }
}

