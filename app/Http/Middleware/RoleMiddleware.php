<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $role)
    {
        if (!auth()->check() || auth()->user()->role !== $role) {
            // Debug line to see what's happening
            \Log::debug('Role check failed. User role: ' . (auth()->check() ? auth()->user()->role : 'Not logged in') . ', Required role: ' . $role);
            
            abort(403, 'Unauthorized access.');
        }
        
        return $next($request);
    }
}
