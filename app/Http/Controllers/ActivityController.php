<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index()
    {
        try {
            // Fetch activity logs with related user information
            $activities = Activity::with('user:id,name')
                ->orderBy('created_at', 'desc')
                ->get();
        return response()->json($activities, 200);
    
        } catch (\Exception $e) {
            // Log error and return a 500 response
            \Log::error('Failed to fetch activity logs:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Failed to fetch activity logs.'], 500);
        }
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'action' => 'required|string',
            'description' => 'required|string',
            'related_model' => 'nullable|string',
            'related_id' => 'nullable|integer',
        ]);

        $activity = Activity::create([
            'user_id' => auth()->id(),
            'action' => $validatedData['action'],
            'description' => $validatedData['description'],
            'related_model' => $validatedData['related_model'] ?? null,
            'related_id' => $validatedData['related_id'] ?? null,
        ]);

        return response()->json($activity, 201);
    }
}
