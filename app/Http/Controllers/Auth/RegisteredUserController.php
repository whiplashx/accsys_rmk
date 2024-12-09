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
        $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255', // Ensure the role exists in your system
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'departments' => 'bigint|unsigned',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password),
            'departments' => $request->departments,
        ]);

        $role = Role::findByName($request->role);
        $user->assignRole($role);
        $user->
        event(new Registered($user));

        return redirect(route('accounts'));
    }
}
