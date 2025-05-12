<?php

namespace App\Http\Controllers;

use App\Models\Indicator;
use App\Models\Parameter;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class IndicatorController extends Controller
{
    public function index()
    {
        $indicator = Indicator::with('parameter')->get();
        return response()->json($indicator);
    }
    
    public function getRatings()
    {
        try {
            $ratings = Indicator::with(['task' => function ($query) {
                $query->select('id', 'selfsurvey_rating'); // Only select the selfsurvey_rating and task ID
            }])->get(['id', 'task']); // Select only indicator ID and task field
    
            return response()->json($ratings);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch selfsurvey ratings'], 500);
        }
    }
    
    public function all(Parameter $parameter)
    {
        return $parameter->indicators;
    }    /**
     * Get indicators assigned to the current user
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAssignedIndicators()
    {
        try {
            // Get the current authenticated user's ID
            $userId = Auth::id();
            
            // Get indicators directly assigned to the current user
            $indicators = Indicator::with(['parameter', 'user', 'task'])
                ->where('user_id', $userId)
                ->get();

            // If no direct assignments found, fall back to task-based assignments (for backward compatibility)
            if ($indicators->isEmpty()) {
                $indicators = Indicator::select('indicators.*')
                    ->join('tasks', 'indicators.id', '=', 'tasks.indicator_id')
                    ->join('users', 'tasks.assignee', '=', 'users.id')
                    ->with(['parameter', 'task' => function($query) {
                        $query->with('assignedUser:id,name,email'); 
                    }])
                    ->where('tasks.assignee', $userId)
                    ->get();
            }

            // Transform the indicators to include user reference
            $indicatorsWithUsers = $indicators->map(function($indicator) {
                // Get user from direct relationship if available, otherwise get from task
                $user = $indicator->user;
                if (!$user && $indicator->task && $indicator->task->assignedUser) {
                    $user = $indicator->task->assignedUser;
                }
                
                return [
                    'id' => $indicator->id,
                    'description' => $indicator->description,
                    'parameter_id' => $indicator->parameter_id,
                    'task_id' => $indicator->task ? $indicator->task->id : null,
                    'status' => $indicator->task ? $indicator->task->status : 'not-assigned',
                    'documents' => $indicator->documents,
                    'assigned_user' => $user ? [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email
                    ] : null,
                    'parameter' => $indicator->parameter ? [
                        'id' => $indicator->parameter->id,
                        'name' => $indicator->parameter->name
                    ] : null,
                    'selfsurvey_rating' => $indicator->task ? $indicator->task->selfsurvey_rating : null,
                    'created_at' => $indicator->created_at,
                    'updated_at' => $indicator->updated_at
                ];
            });

            return response()->json($indicatorsWithUsers);
        } catch (\Exception $e) {
            Log::error('Error fetching assigned indicators: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch assigned indicators'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'description' => 'required|string',
                'parameter_id' => 'required|exists:parameters,id',
                'user_id' => 'nullable|exists:users,id',
                'documents' => 'nullable',
                'task' => 'nullable'
            ]);
            
            $indicator = Indicator::create($validatedData);
            
            return response()->json([
                'message' => 'Indicator created successfully',
                'indicator' => $indicator
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating indicator: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create indicator'], 500);
        }
    }

    public function update(Request $request, Indicator $indicator)
    {
        try {
            $validatedData = $request->validate([
                'description' => 'sometimes|string',
                'parameter_id' => 'sometimes|exists:parameters,id',
                'user_id' => 'sometimes|nullable|exists:users,id',
                'documents' => 'sometimes|nullable',
                'task' => 'sometimes|nullable'
            ]);
            
            $indicator->update($validatedData);
            
            return response()->json([
                'message' => 'Indicator updated successfully',
                'indicator' => $indicator
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating indicator: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update indicator'], 500);
        }
    }

    public function assignToUser(Request $request, Indicator $indicator)
    {
        try {
            $validatedData = $request->validate([
                'user_id' => 'required|exists:users,id',
            ]);
            
            $indicator->user_id = $validatedData['user_id'];
            $indicator->save();
            
            return response()->json([
                'message' => 'Indicator assigned to user successfully',
                'indicator' => $indicator->load('user', 'parameter')
            ]);
        } catch (\Exception $e) {
            Log::error('Error assigning indicator to user: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to assign indicator to user'], 500);
        }
    }
}
