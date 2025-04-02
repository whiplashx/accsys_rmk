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
                'tasks' => []
            ];

            // Get all programs with their relevant details
            try {
                // Check if tasks relationship exists on Program model
                if (method_exists(Program::class, 'tasks')) {
                    $programs = Program::select('id', 'name', 'college', 'schedule_start', 'schedule_end', 'updated_at')
                        ->withCount(['tasks as completed_tasks' => function($query) {
                            $query->where('status', 'completed');
                        }])
                        ->withCount('tasks')
                        ->get();
                        
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
                } else {
                    // Fallback if relationship doesn't exist
                    $data['programs'] = Program::select('id', 'name', 'college', 'schedule_start', 'schedule_end', 'updated_at')
                        ->get();
                }
            } catch (Exception $e) {
                Log::error("Error fetching programs: " . $e->getMessage());
            }

            // Get all areas with their indicators and parameters
            try {
                // Check if indicators relationship exists on Area model
                if (method_exists(Area::class, 'indicators')) {
                    $areas = Area::withCount(['indicators as total_indicators'])
                        ->withCount(['indicators as completed_indicators' => function($query) {
                            $query->whereHas('documents');
                        }])
                        ->get();
                    
                    $data['areas'] = $areas->map(function ($area) {
                        // Calculate area progress based on completed indicators
                        $progress = $area->total_indicators > 0
                            ? round(($area->completed_indicators / $area->total_indicators) * 100)
                            : 0;
                        
                        return [
                            'name' => $area->name,
                            'progress' => $progress,
                            'total_indicators' => $area->total_indicators,
                            'completed_indicators' => $area->completed_indicators
                        ];
                    });
                } else {
                    // Fallback if relationship doesn't exist
                    $data['areas'] = Area::all();
                }
            } catch (Exception $e) {
                Log::error("Error fetching areas: " . $e->getMessage());
            }

            // Calculate total and completed indicators across all areas
            try {
                $totalCriteria = Indicator::count();
                $completedCriteria = 0;
                
                // Check if documents relationship exists on Indicator model
                if (method_exists(Indicator::class, 'documents')) {
                    $completedCriteria = Indicator::whereHas('documents')->count();
                }
                
                // Calculate overall progress based on completed indicators
                $overallProgress = $totalCriteria > 0 ? round(($completedCriteria / $totalCriteria) * 100) : 0;
                
                $data['totalCriteria'] = $totalCriteria;
                $data['completedCriteria'] = $completedCriteria;
                $data['overallProgress'] = $overallProgress;
                
                // Criteria completion data for pie chart
                $data['criteriaCompletionData'] = [
                    ['name' => 'Completed', 'value' => $completedCriteria],
                    ['name' => 'Remaining', 'value' => $totalCriteria - $completedCriteria]
                ];
            } catch (Exception $e) {
                Log::error("Error calculating indicator stats: " . $e->getMessage());
            }

            // Recent activities - get recent task status changes
            try {
                $data['recentActivities'] = Task::select('title as description', 'status', 'updated_at as date')
                    ->orderBy('updated_at', 'desc')
                    ->limit(5)
                    ->get();
            } catch (Exception $e) {
                Log::error("Error fetching recent activities: " . $e->getMessage());
            }

            // Upcoming deadlines
            try {
                $data['upcomingDeadlines'] = Task::select('title as task', 'due_date as date')
                    ->where('status', '!=', 'completed')
                    ->whereNotNull('due_date')
                    ->orderBy('due_date', 'asc')
                    ->limit(3)
                    ->get();
            } catch (Exception $e) {
                Log::error("Error fetching upcoming deadlines: " . $e->getMessage());
            }

            // Team members count - users involved in tasks
            try {
                $data['teamMembers'] = User::whereIn('role', ['localtaskforce', 'localaccreditor'])->count();
            } catch (Exception $e) {
                Log::error("Error counting team members: " . $e->getMessage());
            }

            // Progress over time data - handle separately with error handling
            try {
                $data['progressOverTime'] = [
                    'daily' => $this->getDailyProgressData(),
                    'weekly' => $this->getWeeklyProgressData(),
                    'monthly' => $this->getMonthlyProgressData()
                ];
            } catch (Exception $e) {
                Log::error("Error calculating progress over time: " . $e->getMessage());
            }
            
            // Get tasks for frontend use - handle relationships carefully
            try {
                $tasksQuery = Task::query()->orderBy('updated_at', 'desc');
                
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

    private function getDailyProgressData(): array
    {
        try {
            // Get data for the last 14 days
            $endDate = Carbon::now();
            $startDate = Carbon::now()->subDays(13);
            
            // Get total task count
            $totalTasks = Task::count() ?: 1; // Avoid division by zero
            
            // Get completed tasks before start date (starting count)
            $startingCount = Task::where('status', 'completed')
                ->where('updated_at', '<', $startDate)
                ->count();
            
            // Prepare dates array
            $dates = [];
            $current = $startDate->copy();
            while ($current <= $endDate) {
                $dates[] = $current->format('Y-m-d');
                $current = $current->addDay();
            }
            
            // Get completion data from database
            $completionData = Task::where('status', 'completed')
                ->whereBetween('updated_at', [$startDate, $endDate])
                ->select(DB::raw('DATE(updated_at) as date'), DB::raw('count(*) as count'))
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->keyBy('date');
            
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
    
    private function getWeeklyProgressData(): array
    {
        try {
            // Get data for the last 12 weeks
            $endDate = Carbon::now()->endOfWeek();
            $startDate = Carbon::now()->subWeeks(11)->startOfWeek();
            
            // Get total task count
            $totalTasks = Task::count() ?: 1;
            
            // Get completed tasks before start date (starting count)
            $startingCount = Task::where('status', 'completed')
                ->where('updated_at', '<', $startDate)
                ->count();
            
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
                $completedThisWeek = Task::where('status', 'completed')
                    ->whereBetween('updated_at', [$week['start'], $week['end']])
                    ->count();
                    
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
    
    private function getMonthlyProgressData(): array
    {
        try {
            // Get data for the last 12 months
            $endDate = Carbon::now()->endOfMonth();
            $startDate = Carbon::now()->subMonths(11)->startOfMonth();
            
            // Get total task count
            $totalTasks = Task::count() ?: 1;
            
            // Get completed tasks before start date (starting count)
            $startingCount = Task::where('status', 'completed')
                ->where('updated_at', '<', $startDate)
                ->count();
            
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
                $completedThisMonth = Task::where('status', 'completed')
                    ->whereBetween('updated_at', [$month['start'], $month['end']])
                    ->count();
                    
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