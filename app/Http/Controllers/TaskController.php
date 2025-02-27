<?php

namespace App\Http\Controllers;

use App\Models\Indicator;
use App\Models\Task;
use App\Models\User;
use DB;
use Illuminate\Http\Request;
use Log;

class TaskController extends Controller
{
    public function assignTask(Request $request)
{
    try {
        $request->validate([
            'indicator_id' => 'required|exists:indicators,id',
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $user = User::findOrFail($request->user_id);
        $indicator = Indicator::findOrFail($request->indicator_id);

        DB::beginTransaction();

        // Create the task and associate it with the indicator
        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'assignee' => $user->id,
            'status' => 'pending',
        ]);

        // Update the indicator's `task` field to reference the created task
        $indicator->update(['task' => $task->id]);

        DB::commit();

        return response()->json(['message' => 'Task assigned successfully', 'task' => $task], 201);
    } catch (\Illuminate\Validation\ValidationException $e) {
        DB::rollBack();
        return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Error assigning task: ' . $e->getMessage());
        return response()->json(['message' => 'An error occurred while assigning the task'], 500);
    }
}

public function getRatings()
{
    try {
        $tasks = Task::select('id', 'title', 'description', 'assignee', 'selfsurvey_rating', 'status', 'created_at', 'updated_at')
            ->with('assignedUser:id,name')
            ->get();

        return response()->json($tasks);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to fetch tasks'], 500);
    }
}
    public function fetchAssignedTasks()
    {
        try {
            // Fetch tasks where the assignee matches the authenticated user's ID
            $userId = auth()->id(); // Get the authenticated user's ID
            $tasks = Task::with('indicator')
                ->where('assignee', $userId) // Adjust the column name if it's different in your database
                ->get();
    
            return response()->json($tasks, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function updateTaskStatus(Request $request, $taskId)
    {
        $task = Task::findOrFail($taskId);
        $task->status = $request->input('status');
        $task->save();

        return response()->json(['message' => 'Task status updated successfully']);
    }

    public function index()
    {
        try {
            // Eager load the assignedUser relationship
            $tasks = Task::with('assignedUser')->orderBy('created_at', 'desc')->get();
            return response()->json($tasks, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch tasks'], 500);
        }
    }
}

