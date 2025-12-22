<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\PeriodePenilaian;
use App\Models\HasilSaw;

class ExportHasilTest extends TestCase
{
    use RefreshDatabase;

    public function test_hr_can_export_csv_with_rows()
    {
        // create HR user
        $hr = User::factory()->create(['role' => 'hr']);

        $periode = PeriodePenilaian::create([
            'nama_periode' => 'P1',
            'tahun' => date('Y'),
            'bulan' => (int) date('m'),
            'status' => 'active',
            'tanggal_mulai' => date('Y-m-d'),
            'tanggal_selesai' => date('Y-m-d', strtotime('+1 month')),
        ]);

        // create employees and hasil
        $k1 = User::factory()->create(['role' => 'karyawan', 'name' => 'Emp A', 'employee_id' => 'E001', 'department' => 'IT']);
        $k2 = User::factory()->create(['role' => 'karyawan', 'name' => 'Emp B', 'employee_id' => 'E002', 'department' => 'Finance']);

        HasilSaw::create(['karyawan_id' => $k1->id, 'periode_penilaian_id' => $periode->id, 'nilai_preferensi' => 0.8, 'ranking' => 1]);
        HasilSaw::create(['karyawan_id' => $k2->id, 'periode_penilaian_id' => $periode->id, 'nilai_preferensi' => 0.6, 'ranking' => 2]);

    $res = $this->actingAs($hr)->get(route('hasil.export', ['periode_id' => $periode->id]));
    $res->assertStatus(200);
    $content = $res->streamedContent();
    // header may be quoted by fputcsv, so assert key column names exist
    $this->assertStringContainsString('Karyawan', $content);
    $this->assertStringContainsString('Employee ID', $content);
    $this->assertStringContainsString('Nilai Preferensi', $content);
        $this->assertStringContainsString('Emp A', $content);
        $this->assertStringContainsString('Emp B', $content);
    }

    public function test_supervisor_export_is_scoped_to_department()
    {
        $sup = User::factory()->create(['role' => 'supervisor', 'department' => 'IT']);
        $periode = PeriodePenilaian::create([
            'nama_periode' => 'P2',
            'tahun' => date('Y'),
            'bulan' => (int) date('m'),
            'status' => 'active',
            'tanggal_mulai' => date('Y-m-d'),
            'tanggal_selesai' => date('Y-m-d', strtotime('+1 month')),
        ]);

        $k1 = User::factory()->create(['role' => 'karyawan', 'name' => 'IT Emp', 'employee_id' => 'I001', 'department' => 'IT']);
        $k2 = User::factory()->create(['role' => 'karyawan', 'name' => 'Fin Emp', 'employee_id' => 'F001', 'department' => 'Finance']);

        HasilSaw::create(['karyawan_id' => $k1->id, 'periode_penilaian_id' => $periode->id, 'nilai_preferensi' => 0.7, 'ranking' => 1]);
        HasilSaw::create(['karyawan_id' => $k2->id, 'periode_penilaian_id' => $periode->id, 'nilai_preferensi' => 0.5, 'ranking' => 2]);

    $res = $this->actingAs($sup)->get(route('hasil.export', ['periode_id' => $periode->id]));
    $res->assertStatus(200);
    $content = $res->streamedContent();
        $this->assertStringContainsString('IT Emp', $content);
        $this->assertStringNotContainsString('Fin Emp', $content);
    }

    public function test_karyawan_cannot_access_export()
    {
        $k = User::factory()->create(['role' => 'karyawan']);
        $res = $this->actingAs($k)->get(route('hasil.export'));
        $res->assertStatus(403);
    }
}
