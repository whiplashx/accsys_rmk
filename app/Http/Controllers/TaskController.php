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
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'assignee' => 'required|exists:team_members,id',
            'status' => 'required|in:pending,in-progress,completed',
            'criteriaId' => 'required|exists:criteria,id',
        ]);

        $task = Task::create([
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
            'assignee' => $validatedData['assignee'],
            'status' => $validatedData['status'],
            'criteria_id' => $validatedData['criteriaId'],
        ]);

        return response()->json($task, 201);
    }
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

            $task = Task::create([
                'title' => $request->title,
                'description' => $request->description,
                'assignee' => $user->id,
                'status' => 'pending',
                'indicator_id' => $indicator->id,
            ]);

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
    public function fetchAssignedTasks()
    {
        try {
            $tasks = Task::with('indicator')->get(); // Replace with your actual logic
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
}

