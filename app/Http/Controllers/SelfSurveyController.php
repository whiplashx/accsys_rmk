<?php

namespace App\Http\Controllers;

use App\Models\SelfSurvey;
use Illuminate\Http\Request;

class SelfSurveyController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'indicator_id' => 'required|exists:indicators,id',
            'ratings' => 'required|array',
        ]);

        $selfSurvey = SelfSurvey::updateOrCreate(
            ['task_id' => $request->task_id, 'indicator_id' => $request->indicator_id],
            ['ratings' => $request->ratings]
        );

        return response()->json($selfSurvey, 201);
    }

    public function show($taskId)
    {
        $selfSurvey = SelfSurvey::where('task_id', $taskId)->first();

        if (!$selfSurvey) {
            return response()->json(null, 404);
        }

        return response()->json($selfSurvey);
    }
}

