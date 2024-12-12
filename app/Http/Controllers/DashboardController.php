<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Indicator;
use App\Models\Task;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function getDashboardData(): JsonResponse
    {
        $departments = Department::select('name')->get();
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
            'progressTrendData' => $this->getProgressTrendData()
        ];

        return response()->json($data);
    }

    private function getProgressTrendData(): array
    {
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
        return array_map(function ($month) {
            return [
                'month' => $month,
                'progress' => rand(20, 80) // Simulated progress
            ];
        }, $months);
    }
}