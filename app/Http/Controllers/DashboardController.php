<?php

namespace App\Http\Controllers;

use App\Models\Indicator;
use App\Models\Parameter;
use App\Models\Program;
use App\Models\Task;
use App\Models\Document;
use App\Models\User;
use App\Models\Area;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class DashboardController extends Controller
{
    public function getDashboardData(): JsonResponse
    {
        try {
            // Get the program_id from the request
            $programId = request('program_id');
            
            // Default empty data structure
            $data = [
                'programs' => [],
                'areas' => [],
                'recentActivities' => [],
                'upcomingDeadlines' => [],
                'overallProgress' => 0,
                'teamMembers' => 0,
                'completedCriteria' => 0,
                'totalCriteria' => 0,
                'criteriaCompletionData' => [
                    ['name' => 'Completed', 'value' => 0],
                    ['name' => 'Remaining', 'value' => 0]
                ],
                'progressOverTime' => [
                    'daily' => [],
                    'weekly' => [],
                    'monthly' => []
                ],
                'tasks' => [],
                'inProgressCriteria' => 0,
                'activeTasks' => 0,
                'completedTasks' => 0,
                'totalTasks' => 0,
                'totalDocuments' => 0,
                'pendingReviewDocuments' => 0,
                'criteriaList' => []
            ];

            // Get all programs with their relevant details
            try {
                // Base query for programs
                $programsQuery = Program::select('id', 'name', 'college', 'schedule_start', 'schedule_end', 'updated_at');
                
                // If programId is provided, filter by it
                if ($programId) {
                    $programsQuery->where('id', $programId);
                }
                
                // Check if tasks relationship exists on Program model
                if (method_exists(Program::class, 'tasks')) {
                    $programsQuery->withCount(['tasks as completed_tasks' => function($query) {
                        $query->where('status', 'completed');
                    }])
                    ->withCount('tasks');
                }
                
                $programs = $programsQuery->get();
                        
                $data['programs'] = $programs->map(function ($program) {
                    // Calculate program progress based on tasks
                    $progress = $program->tasks_count > 0
                        ? round(($program->completed_tasks / $program->tasks_count) * 100)
                        : 0;
                    
                    return [
                        'id' => $program->id,
                        'name' => $program->name,
                        'college' => $program->college,
                        'progress' => $progress,
                        'schedule_start' => $program->schedule_start,
                        'schedule_end' => $program->schedule_end,
                        'updated_at' => $program->updated_at,
                    ];
                });
            } catch (Exception $e) {
                Log::error("Error fetching programs: " . $e->getMessage());
            }

            // Get areas with their indicators and parameters, filtered by program_id if provided
            try {
                $areasQuery = Area::query();
                
                // If programId is provided, filter areas by program_id
                if ($programId) {
                    $areasQuery->where('program_id', $programId);
                }
                
                // Check if indicators relationship exists on Area model
                if (method_exists(Area::class, 'indicators')) {
                    $areasQuery->withCount(['indicators as total_indicators'])
                        ->withCount(['indicators as completed_indicators' => function($query) {
                            $query->whereHas('documents');
                        }]);
                }
                
                $areas = $areasQuery->get();
                
                $data['areas'] = $areas->map(function ($area) {
                    // Calculate area progress based on completed indicators
                    $progress = $area->total_indicators > 0
                        ? round(($area->completed_indicators / $area->total_indicators) * 100)
                        : 0;
                    
                    return [
                        'id' => $area->id,
                        'name' => $area->name,
                        'progress' => $progress,
                        'total_indicators' => $area->total_indicators,
                        'completed_indicators' => $area->completed_indicators
                    ];
                });
            } catch (Exception $e) {
                Log::error("Error fetching areas: " . $e->getMessage());
            }

            // Calculate total and completed indicators across all areas, filtered by program_id if provided
            try {
                // Query indicators directly through tasks instead of via parameters
                $indicatorsQuery = Indicator::query();
                
                // If programId is provided, filter indicators by that program
                if ($programId) {
                    $indicatorsQuery->whereHas('task', function($query) use ($programId) {
                        $query->where('program_id', $programId);
                    });
                }
                
                $totalCriteria = $indicatorsQuery->count();
                $completedCriteria = 0;
                $inProgressCriteria = 0;
                
                // Count completed indicators based on their associated tasks being completed
                if (method_exists(Indicator::class, 'task')) {
                    $completedQuery = clone $indicatorsQuery;
                    $completedCriteria = $completedQuery->whereHas('task', function($query) {
                        $query->where('status', 'completed');
                    })->count();
                    
                    // Count in-progress indicators (has tasks that aren't completed)
                    $inProgressQuery = clone $indicatorsQuery;
                    $inProgressCriteria = $inProgressQuery->whereHas('task', function($query) {
                        $query->where('status', 'in-progress');
                    })->count();
                }
                
                // Calculate overall progress based on completed indicators
                $overallProgress = $totalCriteria > 0 ? round(($completedCriteria / $totalCriteria) * 100) : 0;
                
                $data['totalCriteria'] = $totalCriteria;
                $data['completedCriteria'] = $completedCriteria;
                $data['inProgressCriteria'] = $inProgressCriteria;
                $data['overallProgress'] = $overallProgress;
                
                // Criteria completion data for pie chart
                $data['criteriaCompletionData'] = [
                    ['name' => 'Completed', 'value' => $completedCriteria],
                    ['name' => 'In Progress', 'value' => $inProgressCriteria],
                    ['name' => 'Not Started', 'value' => $totalCriteria - $completedCriteria - $inProgressCriteria]
                ];
                
                // Generate criteria list for datatable based directly on indicators linked to tasks
                $criteriaListQuery = Indicator::query();
                
                if ($programId) {
                    $criteriaListQuery->whereHas('task', function($query) use ($programId) {
                        $query->where('program_id', $programId);
                    });
                }
                
                $criteriaListQuery->with(['task', 'documents']);
                
                $criteriaList = $criteriaListQuery->get();
                
                $data['criteriaList'] = $criteriaList->map(function($indicator) {
                    // Get task directly from the indicator
                    $task = $indicator->task;
                    $totalTasks = $task ? 1 : 0; // Each indicator has one task
                    $completedTasks = ($task && $task->status === 'completed') ? 1 : 0;
                    $docCount = $indicator->documents->count();
                    
                    // Determine status based on the task status
                    $status = 'not-started';
                    if ($task) {
                        $status = $task->status;
                    }
                    
                    // Calculate progress based on task status
                    $progress = 0;
                    if ($task) {
                        if ($task->status === 'completed') {
                            $progress = 100;
                        } else if ($task->status === 'in-progress') {
                            $progress = 50;
                        }
                    }
                    
                    return [
                        'id' => $indicator->id,
                        'name' => $indicator->description, // Use description as name
                        'description' => $indicator->description,
                        'status' => $status,
                        'progress' => $progress,
                        'completedTasks' => $completedTasks,
                        'totalTasks' => $totalTasks,
                        'documents' => $docCount,
                        'deadline' => $task && $task->due_date ? $task->due_date : 'Not set',
                        'taskTitle' => $task ? $task->title : '',
                        'taskId' => $task ? $task->id : null
                    ];
                });
                
            } catch (Exception $e) {
                Log::error("Error calculating indicator stats: " . $e->getMessage());
            }

            // Recent activities - get recent task status changes, filtered by program_id
            try {
                $activitiesQuery = Task::select('title as description', 'status', 'updated_at as date')
                    ->orderBy('updated_at', 'desc')
                    ->limit(5);
                
                if ($programId) {
                    $activitiesQuery->whereHas('indicator.parameter.area', function($query) use ($programId) {
                        $query->where('program_id', $programId);
                    });
                }
                
                $data['recentActivities'] = $activitiesQuery->get();
            } catch (Exception $e) {
                Log::error("Error fetching recent activities: " . $e->getMessage());
            }

            // Upcoming deadlines, filtered by program_id
            try {
                $deadlinesQuery = Task::select('title as task', 'due_date as date')
                    ->where('status', '!=', 'completed')
                    ->whereNotNull('due_date')
                    ->orderBy('due_date', 'asc')
                    ->limit(3);
                
                if ($programId) {
                    $deadlinesQuery->whereHas('indicator.parameter.area', function($query) use ($programId) {
                        $query->where('program_id', $programId);
                    });
                }
                
                $data['upcomingDeadlines'] = $deadlinesQuery->get();
            } catch (Exception $e) {
                Log::error("Error fetching upcoming deadlines: " . $e->getMessage());
            }

            // Team members count - users involved in tasks, filtered by program_id
            try {
                $usersQuery = User::query();
                
                if ($programId) {
                    $usersQuery->where('program_id', $programId);
                }
                
                $usersQuery->whereIn('role', ['localtaskforce', 'localaccreditor']);
                $data['teamMembers'] = $usersQuery->count();
            } catch (Exception $e) {
                Log::error("Error counting team members: " . $e->getMessage());
            }

            // Active tasks count
            try {
                $activeTasksQuery = Task::where('status', '!=', 'completed');
                
                if ($programId) {
                    $activeTasksQuery->whereHas('indicator.parameter.area', function($query) use ($programId) {
                        $query->where('program_id', $programId);
                    });
                }
                
                $data['activeTasks'] = $activeTasksQuery->count();
            } catch (Exception $e) {
                Log::error("Error counting active tasks: " . $e->getMessage());
            }
            
            // Task counts for the new completed tasks card
            try {
                $taskCountsQuery = Task::query();
                
                if ($programId) {
                    $taskCountsQuery->whereHas('indicator.parameter.area', function($query) use ($programId) {
                        $query->where('program_id', $programId);
                    });
                }
                
                $data['totalTasks'] = $taskCountsQuery->count();
                
                $completedTasksQuery = clone $taskCountsQuery;
                $data['completedTasks'] = $completedTasksQuery->where('status', 'completed')->count();
            } catch (Exception $e) {
                Log::error("Error counting tasks: " . $e->getMessage());
            }
            
            // Document counts
            try {
                $documentsQuery = Document::query();
                
                if ($programId) {
                    $documentsQuery->whereHas('indicator.parameter.area', function($query) use ($programId) {
                        $query->where('program_id', $programId);
                    });
                }
                
                $data['totalDocuments'] = $documentsQuery->count();
                
                $pendingReviewQuery = clone $documentsQuery;
                $data['pendingReviewDocuments'] = $pendingReviewQuery->where('status', 'pending_review')->count();
            } catch (Exception $e) {
                Log::error("Error counting documents: " . $e->getMessage());
            }

            // Progress over time data - handle separately with error handling
            try {
                $data['progressOverTime'] = [
                    'daily' => $this->getDailyProgressData($programId),
                    'weekly' => $this->getWeeklyProgressData($programId),
                    'monthly' => $this->getMonthlyProgressData($programId)
                ];
            } catch (Exception $e) {
                Log::error("Error calculating progress over time: " . $e->getMessage());
            }
            
            // Get tasks for frontend use - handle relationships carefully
            try {
                $tasksQuery = Task::query()->orderBy('updated_at', 'desc');
                
                if ($programId) {
                    $tasksQuery->whereHas('indicator.parameter.area', function($query) use ($programId) {
                        $query->where('program_id', $programId);
                    });
                }
                
                // Only include these relationships if they exist
                if (method_exists(Task::class, 'indicator')) {
                    $tasksQuery->with('indicator');
                }
                
                if (method_exists(Task::class, 'documents')) {
                    $tasksQuery->with('documents')->withCount('documents');
                }
                
                $data['tasks'] = $tasksQuery->get();
            } catch (Exception $e) {
                Log::error("Error fetching tasks: " . $e->getMessage());
            }

            return response()->json($data);
            
        } catch (Exception $e) {
            Log::error("Dashboard data error: " . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'error' => 'An error occurred while fetching dashboard data',
                'message' => config('app.debug') ? $e->getMessage() : 'Server Error'
            ], 500);
        }
    }

    private function getDailyProgressData($programId = null): array
    {
        try {
            // Get data for the last 14 days
            $endDate = Carbon::now();
            $startDate = Carbon::now()->subDays(13);
            
            // Get total task count
            $totalTasksQuery = Task::query();
            if ($programId) {
                $totalTasksQuery->whereHas('indicator.parameter.area', function($query) use ($programId) {
                    $query->where('program_id', $programId);
                });
            }
            $totalTasks = $totalTasksQuery->count() ?: 1; // Avoid division by zero
            
            // Get completed tasks before start date (starting count)
            $startingCountQuery = Task::where('status', 'completed')
                ->where('updated_at', '<', $startDate);
            if ($programId) {
                $startingCountQuery->whereHas('indicator.parameter.area', function($query) use ($programId) {
                    $query->where('program_id', $programId);
                });
            }
            $startingCount = $startingCountQuery->count();
            
            // Prepare dates array
            $dates = [];
            $current = $startDate->copy();
            while ($current <= $endDate) {
                $dates[] = $current->format('Y-m-d');
                $current = $current->addDay();
            }
            
            // Get completion data from database
            $completionDataQuery = Task::where('status', 'completed')
                ->whereBetween('updated_at', [$startDate, $endDate])
                ->select(DB::raw('DATE(updated_at) as date'), DB::raw('count(*) as count'))
                ->groupBy('date')
                ->orderBy('date');
            if ($programId) {
                $completionDataQuery->whereHas('indicator.parameter.area', function($query) use ($programId) {
                    $query->where('program_id', $programId);
                });
            }
            $completionData = $completionDataQuery->get()->keyBy('date');
            
            // Calculate cumulative progress
            $cumulativeCount = $startingCount;
            $result = [];
            
            foreach ($dates as $date) {
                $dateStr = Carbon::parse($date)->format('Y-m-d');
                $count = isset($completionData[$dateStr]) ? $completionData[$dateStr]->count : 0;
                $cumulativeCount += $count;
                
                $result[] = [
                    'date' => Carbon::parse($date)->format('M d'),
                    'progress' => round(($cumulativeCount / $totalTasks) * 100)
                ];
            }
            
            return $result;
        } catch (Exception $e) {
            Log::error("Error in getDailyProgressData: " . $e->getMessage());
            return [];
        }
    }
    
    private function getWeeklyProgressData($programId = null): array
    {
        try {
            // Get data for the last 12 weeks
            $endDate = Carbon::now()->endOfWeek();
            $startDate = Carbon::now()->subWeeks(11)->startOfWeek();
            
            // Get total task count
            $totalTasksQuery = Task::query();
            if ($programId) {
                $totalTasksQuery->whereHas('indicator.parameter.area', function($query) use ($programId) {
                    $query->where('program_id', $programId);
                });
            }
            $totalTasks = $totalTasksQuery->count() ?: 1;
            
            // Get completed tasks before start date (starting count)
            $startingCountQuery = Task::where('status', 'completed')
                ->where('updated_at', '<', $startDate);
            if ($programId) {
                $startingCountQuery->whereHas('indicator.parameter.area', function($query) use ($programId) {
                    $query->where('program_id', $programId);
                });
            }
            $startingCount = $startingCountQuery->count();
            
            // Create weekly buckets
            $weeks = [];
            $current = $startDate->copy();
            while ($current <= $endDate) {
                $weekStart = $current->copy()->startOfWeek();
                $weekEnd = $current->copy()->endOfWeek();
                $weeks[] = [
                    'start' => $weekStart->format('Y-m-d'),
                    'end' => $weekEnd->format('Y-m-d'),
                    'label' => 'Week ' . $weekStart->format('W')
                ];
                $current = $current->addWeek();
            }
            
            // Calculate cumulative progress
            $cumulativeCount = $startingCount;
            $result = [];
            
            foreach ($weeks as $week) {
                $completedThisWeekQuery = Task::where('status', 'completed')
                    ->whereBetween('updated_at', [$week['start'], $week['end']]);
                if ($programId) {
                    $completedThisWeekQuery->whereHas('indicator.parameter.area', function($query) use ($programId) {
                        $query->where('program_id', $programId);
                    });
                }
                $completedThisWeek = $completedThisWeekQuery->count();
                    
                $cumulativeCount += $completedThisWeek;
                
                $result[] = [
                    'date' => $week['label'],
                    'progress' => round(($cumulativeCount / $totalTasks) * 100)
                ];
            }
            
            return $result;
        } catch (Exception $e) {
            Log::error("Error in getWeeklyProgressData: " . $e->getMessage());
            return [];
        }
    }
    
    private function getMonthlyProgressData($programId = null): array
    {
        try {
            // Get data for the last 12 months
            $endDate = Carbon::now()->endOfMonth();
            $startDate = Carbon::now()->subMonths(11)->startOfMonth();
            
            // Get total task count
            $totalTasksQuery = Task::query();
            if ($programId) {
                $totalTasksQuery->whereHas('indicator.parameter.area', function($query) use ($programId) {
                    $query->where('program_id', $programId);
                });
            }
            $totalTasks = $totalTasksQuery->count() ?: 1;
            
            // Get completed tasks before start date (starting count)
            $startingCountQuery = Task::where('status', 'completed')
                ->where('updated_at', '<', $startDate);
            if ($programId) {
                $startingCountQuery->whereHas('indicator.parameter.area', function($query) use ($programId) {
                    $query->where('program_id', $programId);
                });
            }
            $startingCount = $startingCountQuery->count();
            
            // Create monthly buckets
            $months = [];
            $current = $startDate->copy();
            while ($current <= $endDate) {
                $monthStart = $current->copy()->startOfMonth();
                $monthEnd = $current->copy()->endOfMonth();
                $months[] = [
                    'start' => $monthStart->format('Y-m-d'),
                    'end' => $monthEnd->format('Y-m-d'),
                    'label' => $monthStart->format('M Y')
                ];
                $current = $current->addMonth();
            }
            
            // Calculate cumulative progress
            $cumulativeCount = $startingCount;
            $result = [];
            
            foreach ($months as $month) {
                $completedThisMonthQuery = Task::where('status', 'completed')
                    ->whereBetween('updated_at', [$month['start'], $month['end']]);
                if ($programId) {
                    $completedThisMonthQuery->whereHas('indicator.parameter.area', function($query) use ($programId) {
                        $query->where('program_id', $programId);
                    });
                }
                $completedThisMonth = $completedThisMonthQuery->count();
                    
                $cumulativeCount += $completedThisMonth;
                
                $result[] = [
                    'date' => $month['label'],
                    'progress' => round(($cumulativeCount / $totalTasks) * 100)
                ];
            }
            
            return $result;
        } catch (Exception $e) {
            Log::error("Error in getMonthlyProgressData: " . $e->getMessage());
            return [];
        }
    }
}