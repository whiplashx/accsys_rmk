<?php

namespace App\Http\Controllers;

use App\Models\Indicator;
use App\Models\Task;
use App\Models\User;
use App\Models\SelfSurvey; // Add missing import
use DB;
use Illuminate\Http\Request;
use Log;

class TaskController extends Controller
{
    public function getRatings()
    {
        try {
            $tasks = Task::select('id', 'title', 'description', 'assignee', 'selfsurvey_rating', 'status', 'created_at', 'updated_at')
                ->with('assignedUser')
                ->get();
            return response()->json($tasks);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch ratings'], 500);
        }
    }

    public function getTaskRating($taskId)
    {
        try {
            $task = Task::findOrFail($taskId);
            return response()->json([
                'rating' => $task->selfsurvey_rating
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch rating'], 500);
        }
    }    public function updateSelfSurveyRating(Request $request, $taskId)
    {
        try {
            $task = Task::findOrFail($taskId);
            $task->selfsurvey_rating = $request->input('rating');
            
            // Make sure indicator_id is set if we have an indicator related to this task
            if (!$task->indicator_id) {
                $indicator = Indicator::where('task', $task->id)->first();
                if ($indicator) {
                    $task->indicator_id = $indicator->id;
                }
            }
            
            $task->save();

            return response()->json([
                'message' => 'Self-survey rating updated successfully',
                'task' => $task
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update rating'], 500);
        }
    }    public function assignTask(Request $request)
    {
        try {
            $request->validate([
                'indicator_id' => 'required|exists:indicators,id',
                'user_id' => 'required|exists:users,id',
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'program_id' => 'required|exists:programs,id',
            ]);

            $user = User::findOrFail($request->user_id);
            $indicator = Indicator::findOrFail($request->indicator_id);

            DB::beginTransaction();            // Create the task and associate it with the indicator
            $task = Task::create([
                'title' => $request->title,
                'description' => $request->description,
                'assignee' => $user->id,
                'status' => 'pending',
                'program_id' => $request->program_id,
                'indicator_id' => $request->indicator_id, // Store the indicator ID directly in the task
            ]);

            // Update the indicator's `task` field to reference the created task (bidirectional relationship)
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
        try {
            $task = Task::findOrFail($taskId);
            $task->status = $request->input('status');

            // Add self-survey rating if provided
            if ($request->has('selfsurvey_rating')) {
                $task->selfsurvey_rating = $request->input('selfsurvey_rating');
            }

            $task->save();

            return response()->json([
                'message' => 'Task status and rating updated successfully',
                'task' => $task
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update task'], 500);
        }
    }

    public function getSelfSurveyRatings()
    {
        try {
            // Get all tasks with a self-survey rating that are completed
            $tasks = Task::whereNotNull('selfsurvey_rating')
                ->where('status', 'completed')
                ->with('assignedUser')
                ->get();
                
            // Calculate the average rating
            $avgRating = $tasks->avg('selfsurvey_rating');
            
            // Group tasks by department if needed
            $tasksByDepartment = $tasks->groupBy(function ($task) {
                return $task->assignedUser->department_id ?? 'unknown';
            });
            
            // Calculate average rating per department
            $departmentRatings = [];
            foreach ($tasksByDepartment as $deptId => $deptTasks) {
                $departmentRatings[$deptId] = $deptTasks->avg('selfsurvey_rating');
            }
            
            return response()->json([
                'tasks' => $tasks,
                'averageRating' => round($avgRating, 1),
                'departmentRatings' => $departmentRatings
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching self-survey ratings: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch self-survey ratings'], 500);
        }
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

    /**
     * Bulk assign tasks to a user
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function bulkAssignTasks(Request $request)
    {
        $request->validate([
            'tasks' => 'required|array',
            'tasks.*.indicator_id' => 'required|exists:indicators,id',
            'tasks.*.user_id' => 'required|exists:users,id',
            'tasks.*.title' => 'required|string|max:255',
            'tasks.*.description' => 'required|string',
            'tasks.*.program_id' => 'required|exists:programs,id',
        ]);

        $createdTasks = [];

        DB::beginTransaction();
        try {
            foreach ($request->tasks as $taskData) {                // Create the task with consistent field names and the new indicator_id
                $task = Task::create([
                    'title' => $taskData['title'],
                    'description' => $taskData['description'],
                    'assignee' => $taskData['user_id'], // Make sure this matches your assignTask method
                    'status' => 'pending',
                    'program_id' => $taskData['program_id'],
                    'indicator_id' => $taskData['indicator_id'], // Store the indicator ID directly in the task
                ]);

                // Link the indicator to this task (keeping the bidirectional relationship for backward compatibility)
                $indicator = Indicator::findOrFail($taskData['indicator_id']);
                $indicator->update(['task' => $task->id]);

                // If you have a SelfSurvey model and table, create the record
                // Uncomment this if needed and make sure the model exists
                // SelfSurvey::create([
                //     'task_id' => $task->id,
                //     'rating' => null,
                //     'remarks' => null,
                // ]);

                $createdTasks[] = $task;
            }

            DB::commit();
            return response()->json([
                'message' => count($createdTasks) . ' tasks assigned successfully',
                'tasks' => $createdTasks
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk task assignment error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to assign tasks: ' . $e->getMessage()
            ], 500);
        }
    }    public function getTaskHistoryByIndicator($indicatorId)
    {
        try {
            // Find the indicator
            $indicator = Indicator::findOrFail($indicatorId);
            Log::info('Found indicator with ID: ' . $indicatorId . ', Parameter ID: ' . $indicator->parameter_id);
            
            // Use the direct model method to get tasks
            $tasks = Task::getTasksByIndicator($indicatorId);
            
            // If no tasks found with this indicator_id, try getting the current task from indicator
            if ($tasks->isEmpty() && $indicator->task) {
                $currentTask = Task::find($indicator->task);
                if ($currentTask) {
                    // Update this task with the indicator_id for future queries
                    $currentTask->indicator_id = $indicatorId;
                    $currentTask->save();
                    
                    // Use just this task
                    $tasks = collect([$currentTask]);
                    Log::info('Updated task #' . $currentTask->id . ' with indicator_id: ' . $indicatorId);
                }
            }
            
            // Map tasks with additional info
            $mappedTasks = $tasks->map(function ($task) {
                // Add a flag indicating if this task has a document
                $hasDocument = $task->documents()->exists();
                $indicatorData = $task->indicator()->first();
                
                return array_merge($task->toArray(), [
                    'has_document' => $hasDocument,
                    'indicator' => $indicatorData
                ]);
            });
            
            Log::info('Returning ' . count($mappedTasks) . ' tasks for the timeline');
            return response()->json($mappedTasks);
        } catch (\Exception $e) {
            Log::error('Error fetching task history: ' . $e->getMessage() . ' - Trace: ' . $e->getTraceAsString());
            return response()->json([
                'error' => 'Failed to fetch task history',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}

