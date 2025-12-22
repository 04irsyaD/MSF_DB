<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_karyawan_cannot_access_penilaian_create()
    {
        $k = User::factory()->create([
            'role' => 'karyawan'
        ]);

        $this->actingAs($k)
            ->get(route('penilaian.create'))
            ->assertStatus(403);
    }

    public function test_supervisor_sees_only_department_employees_on_create()
    {
        $supervisor = User::factory()->create([
            'role' => 'supervisor',
            'department' => 'IT'
        ]);

        $inDept = User::factory()->create([
            'role' => 'karyawan',
            'department' => 'IT',
            'name' => 'Employee A'
        ]);

        $outDept = User::factory()->create([
            'role' => 'karyawan',
            'department' => 'Finance',
            'name' => 'Employee B'
        ]);

        // Supervisors are approvers and should not be able to input penilaian
        $res = $this->actingAs($supervisor)->get(route('penilaian.create'));
        $res->assertStatus(403);
    }

    public function test_hr_sees_saw_button_on_dashboard()
    {
        $hr = User::factory()->create([
            'role' => 'hr'
        ]);

        $res = $this->actingAs($hr)->get(route('dashboard'));
        $res->assertStatus(200);
        $res->assertSee('Hitung SAW');
    }
}
