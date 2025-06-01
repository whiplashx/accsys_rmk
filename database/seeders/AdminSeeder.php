<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Program;
use Spatie\Permission\Contracts\Role;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if program with ID 1 exists, if not create it
        $program = Program::find(1);
        if (!$program) {
            $program = Program::create([
                'id' => 1,
                'name' => 'Default Program',
                'college' => 'Default College',
                'schedule_start' => now(),    
            ]);
        }

        $user = User::create([
            'name' => 'Josh Manalo',
            'email' => 'lwhip91@gmail.com',
            'program_id' => $program->id,
            'role' => 'admin',
            'status' => 'active',
            'password' => Hash::make('password'), // Hash the password
        ]);
        $user->assignRole('admin');
    }
}
