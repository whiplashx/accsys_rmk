<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

         $admin = Role::create(['name' => 'admin']);
         $localtaskforce = Role::create(['name' => 'localtaskforce']);
         $localaccreditor = Role::create(['name' => 'localaccreditor']);
         $outsideaccreditor = Role::create(['name' => 'outsideaccreditor']);
    }
}
