<?php

namespace App\Http\Controllers\Auth;
use App\Mail\AuthMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
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
use App\Mail\LoginCredentials;
use Illuminate\Support\Str;

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

     public function store(Request $request): RedirectResponse//|JsonResponse
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
