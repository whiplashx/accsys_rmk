<?php

namespace App\Http\Controllers;

use App\Models\Indicator;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

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
        $request->validate([
            'indicator_id' => 'required|exists:indicators,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $indicator = Indicator::findOrFail($request->indicator_id);
        $user = User::findOrFail($request->user_id);

        $indicator->task = 'Assigned to ' . $user->name;
        $indicator->save();

        return response()->json(['message' => 'Task assigned successfully']);
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

