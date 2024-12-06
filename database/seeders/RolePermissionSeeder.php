<?php

namespace Database\Seeders;
use App\Models\User;
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
        //$admin = Role::create(['name' => 'admin']);
        //$localtaskforce = Role::create(['name' => 'localtaskforce']);
        //$localaccreditor = Role::create(['name' => 'localaccreditor']);
        //$outsideaccreditor = Role::create(['name' => 'outsideaccreditor']);
        // Find the user (replace `1` with the user's ID)
        $user = User::find(3);

        // Assign a role (e.g., 'admin')
        $user->assignRole('localtaskforce');
    
       // $manageUsers = Permission::create(['name' => 'manage users']);
       // $viewDashboard = Permission::create(['name' => 'view dashboard']);
    
       // $admin->givePermissionTo([$manageUsers, $viewDashboard]);
       // $user->givePermissionTo($viewDashboard);
    }

}
