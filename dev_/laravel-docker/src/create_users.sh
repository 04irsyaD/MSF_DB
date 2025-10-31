#!/bin/bash
php artisan tinker << 'EOF'
$admin = \App\Models\Role::where('name', 'admin')->first();
\App\Models\User::firstOrCreate(['email' => 'admin@example.com'], ['name' => 'Admin', 'password' => bcrypt('password'), 'role_id' => $admin->id]);

$penulis = \App\Models\Role::where('name', 'penulis')->first();
\App\Models\User::firstOrCreate(['email' => 'penulis@example.com'], ['name' => 'Penulis Demo', 'password' => bcrypt('password'), 'role_id' => $penulis->id]);

$user = \App\Models\Role::where('name', 'user')->first();
\App\Models\User::firstOrCreate(['email' => 'user@example.com'], ['name' => 'User Demo', 'password' => bcrypt('password'), 'role_id' => $user->id]);

echo "Demo users created!\n";
echo "Admin: admin@example.com / password\n";
echo "Penulis: penulis@example.com / password\n";
echo "User: user@example.com / password\n";
exit
EOF