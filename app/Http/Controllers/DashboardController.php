<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Indicator;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getDashboardData(): JsonResponse
    {
        $departments = Department::select('id', 'name')->get();
        $areas = Department::select('areaID as name')->distinct()->get();
        $recentActivities = Task::select('title as description', 'updated_at as date')
            ->orderBy('updated_at', 'desc')
            ->limit(3)
            ->get();
        $upcomingDeadlines = Task::select('title as task', 'updated_at as date')
            ->where('status', '!=', 'completed')
            ->orderBy('updated_at', 'asc')
            ->limit(3)
            ->get();

        $totalCriteria = Indicator::count();
        $completedCriteria = Indicator::whereNotNull('documents')->count();

        $data = [
            'departments' => $departments->map(function ($dept) {
                return [
                    'id' => $dept->id,
                    'name' => $dept->name,
                    'progress' => rand(50, 100) // Simulated progress
                ];
            }),
            'areas' => $areas->map(function ($area) {
                return [
                    'name' => $area->name,
                    'progress' => rand(50, 100) // Simulated progress
                ];
            }),
            'recentActivities' => $recentActivities,
            'upcomingDeadlines' => $upcomingDeadlines,
            'overallProgress' => round(($completedCriteria / $totalCriteria) * 100),
            'teamMembers' => Task::distinct('assignee')->count(),
            'completedCriteria' => $completedCriteria,
            'totalCriteria' => $totalCriteria,
            'criteriaCompletionData' => [
                ['name' => 'Completed', 'value' => $completedCriteria],
                ['name' => 'Remaining', 'value' => $totalCriteria - $completedCriteria]
            ],
            'progressOverTime' => [
                'daily' => $this->getDailyProgressData(),
                'weekly' => $this->getWeeklyProgressData(),
                'monthly' => $this->getMonthlyProgressData()
            ]
        ];

        return response()->json($data);
    }

    private function getDailyProgressData(): array
    {
        // Get data for the last 14 days
        $endDate = Carbon::now();
        $startDate = Carbon::now()->subDays(13);
        
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
        $totalTasks = Task::count() ?: 1; // Avoid division by zero
        $cumulativeCount = 0;
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
    }
    
    private function getWeeklyProgressData(): array
    {
        // Get data for the last 12 weeks
        $endDate = Carbon::now()->endOfWeek();
        $startDate = Carbon::now()->subWeeks(11)->startOfWeek();
        
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
        
        // Get completion data
        $completionData = [];
        $totalTasks = Task::count() ?: 1;
        $cumulativeCount = 0;
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
    }
    
    private function getMonthlyProgressData(): array
    {
        // Get data for the last 12 months
        $endDate = Carbon::now()->endOfMonth();
        $startDate = Carbon::now()->subMonths(11)->startOfMonth();
        
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
        
        // Get completion data
        $totalTasks = Task::count() ?: 1;
        $cumulativeCount = 0;
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
    }
}