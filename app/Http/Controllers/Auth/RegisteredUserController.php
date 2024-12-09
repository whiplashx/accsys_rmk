<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */

     public function store(Request $request): RedirectResponse
     {
         $request->validate([
             'name' => 'required|string|max:255',
             'role' => 'required|string|max:255', // Ensure the role exists in your system
             'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
             'departments' => 'required|string|max:255', 
             'password' => ['required', 'confirmed', Rules\Password::defaults()],
         ]);
     
         // Create the user
         $user = User::create([
             'name' => $request->name,
             'role' => $request->role,
             'email' => $request->email,
             'password' => Hash::make($request->password),
             'departments' => $request->departments,
         ]);
     
         // Assign the role to the user
         $roleName = $request->role;
         $departmentname = $request->departments;
     
         // Check if the role exists and assign it
         $role = Role::findByName($roleName); // Throws error if role doesn't exist
         if ($role) {
             $user->assignRole($roleName);
         } else {
             return redirect()->back()->withErrors(['role' => 'Invalid role selected.']);
         }
         $departments = Role::findByName($departmentname); // Throws error if role doesn't exist
         if ($departments) {
             $user->assignDepartmen($departmentname);
         } else {
             return redirect()->back()->withErrors(['department' => 'Invalid role selected.']);
         }
     
         // Trigger registered event
         event(new Registered($user));
     
         // Log the user in
         //Auth::login($user);
     
         return redirect(route('accounts'));
     }
}
