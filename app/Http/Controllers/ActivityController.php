<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index()
    {
        $activities = Activity::with('user')
            ->whereHas('user', function ($query) {
                $query->whereIn('role', ['outside_accreditor', 'local_accreditor', 'local_taskforce']);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($activities);
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
