<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class CreateSupervisorUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create-supervisor {email=supervisor@saw.com} {--password=secret123} {--name="Supervisor"} {--department=General}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a supervisor user (idempotent)';

    public function handle()
    {
        $email = $this->argument('email');
        $password = $this->option('password');
        $name = $this->option('name');
        $department = $this->option('department');

        $user = User::where('email', $email)->first();
        if ($user) {
            $this->info("User with email {$email} already exists. Updating role to 'supervisor'.");
            $user->role = 'supervisor';
            $user->department = $department;
            $user->name = $name;
            $user->is_active = true;
            $user->save();
            $this->info("Updated existing user (id={$user->id}).");
            return 0;
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => bcrypt($password),
            'role' => 'supervisor',
            'employee_id' => strtoupper(preg_replace('/[^A-Z0-9]/', '', explode('@', $email)[0])) . rand(10,999),
            'department' => $department,
            'position' => 'Supervisor',
            'is_active' => true,
        ]);

        $this->info("Created supervisor user: {$user->email} (id={$user->id}).");
        return 0;
    }
}
