<?php

namespace Database\Seeders;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $admin = Role::create(['name' => 'admin']);
        $user = Role::create(['name' => 'user']);
    
        $manageUsers = Permission::create(['name' => 'manage users']);
        $viewDashboard = Permission::create(['name' => 'view dashboard']);
    
        $admin->givePermissionTo([$manageUsers, $viewDashboard]);
        $user->givePermissionTo($viewDashboard);
    }

}
