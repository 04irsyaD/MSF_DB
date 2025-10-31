<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class CreateDemoUsersSeeder extends Seeder
{
    public function run()
    {
        // Buat admin user
        $adminRole = Role::where('name', 'admin')->first();
        
        User::firstOrCreate([
            'email' => 'admin@example.com'
        ], [
            'name' => 'Admin',
            'password' => Hash::make('password'),
            'role_id' => $adminRole->id,
        ]);

        // Buat penulis user
        $penulisRole = Role::where('name', 'penulis')->first();
        
        User::firstOrCreate([
            'email' => 'penulis@example.com'
        ], [
            'name' => 'Penulis Demo',
            'password' => Hash::make('password'),
            'role_id' => $penulisRole->id,
        ]);

        // Buat user biasa
        $userRole = Role::where('name', 'user')->first();
        
        User::firstOrCreate([
            'email' => 'user@example.com'
        ], [
            'name' => 'User Demo',
            'password' => Hash::make('password'),
            'role_id' => $userRole->id,
        ]);

        echo "Demo users created successfully!\n";
        echo "Admin: admin@example.com / password\n";
        echo "Penulis: penulis@example.com / password\n";
        echo "User: user@example.com / password\n";
    }
}