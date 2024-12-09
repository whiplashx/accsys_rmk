<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Spatie\Permission\Contracts\Role;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $user =  User::create([
            'name' => 'Josh Manalo',
            'email' => 'lwhip91@gmail.com',
            //'department' => 'lwhip91@gmail.com',
            'role' => 'admin',
            'password' => Hash::make('password'), // Hash the password
        ]);
        $user->assignRole('admin');
    }
}
