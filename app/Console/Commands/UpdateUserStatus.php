<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UpdateUserStatus extends Command
{
    protected $signature = 'users:update-status';
    protected $description = 'Update user status based on their program schedule';

    public function handle()
    {
        $now = Carbon::now();
        
        // Update users to active if current time is between program schedule_start and schedule_end
        DB::table('users')
            ->join('programs', 'users.program_id', '=', 'programs.id')
            ->where('programs.schedule_start', '<=', $now)
            ->where('programs.schedule_end', '>=', $now)
            ->update(['users.status' => 'active']);
            
        // Update users to inactive if current time is outside program schedule
        DB::table('users')
            ->join('programs', 'users.program_id', '=', 'programs.id')
            ->where(function($query) use ($now) {
                $query->where('programs.schedule_start', '>', $now)
                    ->orWhere('programs.schedule_end', '<', $now);
            })
            ->update(['users.status' => 'inactive']);
            
        $this->info('User statuses updated successfully!');
    }
}
