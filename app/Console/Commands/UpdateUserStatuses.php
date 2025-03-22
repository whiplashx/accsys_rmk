<?php

namespace App\Console\Commands;

use App\Http\Controllers\UserController;
use Illuminate\Console\Command;

class UpdateUserStatuses extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:update-statuses';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update user statuses based on program schedules';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userController = new UserController();
        $result = $userController->updateUserStatuses();
        
        $data = json_decode($result->getContent());
        $this->info("User statuses updated successfully. {$data->updated_count} users affected.");
        
        return Command::SUCCESS;
    }
}
