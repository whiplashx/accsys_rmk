<?php

namespace App\Http\Controllers;

use App\Models\Task;
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
}

