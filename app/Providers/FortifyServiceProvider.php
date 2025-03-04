<?php 
use Laravel\Fortify\Fortify;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

// In the boot method
Fortify::authenticateUsing(function ($request) {
    $user = User::where('email', $request->email)->first();

    if ($user &&
        Hash::check($request->password, $user->password)) {
        
        // Check if the user account is active
        if ($user->status !== 'active') {
            throw ValidationException::withMessages([
                'email' => ['Your account is inactive. Please contact an administrator.'],
            ]);
        }
        
        return $user;
    }
});