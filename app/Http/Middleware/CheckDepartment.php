<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckDepartment
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, $department)
    {
        $user = $request->user();

        // Check if the user belongs to the required department
        if (!$user || $user->department !== $department) {
            return redirect()->route('unauthorized')->with('error', 'Access denied to this department.');
        }

        return $next($request);
    }
}
