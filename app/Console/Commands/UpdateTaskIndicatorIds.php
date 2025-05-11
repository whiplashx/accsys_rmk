<?php

namespace App\Console\Commands;

use App\Models\Indicator;
use App\Models\Task;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class UpdateTaskIndicatorIds extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tasks:update-indicator-ids';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update existing tasks with indicator_id based on indicators that reference them';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to update task indicator IDs...');
        $count = 0;

        // Get all indicators that reference a task
        $indicators = Indicator::whereNotNull('task')->get();
        $this->info("Found {$indicators->count()} indicators with task references");

        foreach ($indicators as $indicator) {
            // Skip if task reference is invalid
            if (!$indicator->task) {
                continue;
            }

            $task = Task::find($indicator->task);
            if ($task) {
                $task->indicator_id = $indicator->id;
                $task->save();
                $count++;
                
                $this->info("Updated Task #{$task->id} with Indicator #{$indicator->id}");
            } else {
                $this->warn("Task #{$indicator->task} referenced by Indicator #{$indicator->id} not found");
            }
        }

        $this->info("Updated $count tasks with indicator IDs");
        Log::info("Updated $count tasks with indicator IDs via command");
    }
}
