<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Http\Controllers\SawController;
use App\Models\Kriteria;
use App\Models\SubKriteria;
use App\Models\PeriodePenilaian;
use App\Models\Penilaian;

class SawCalculationTest extends TestCase
{
    use RefreshDatabase;

    public function test_normalize_matrix_behavior()
    {
        $periode = PeriodePenilaian::create([
            'nama_periode' => 'UnitTest Periode',
            'tahun' => date('Y'),
            'bulan' => (int) date('m'),
            'status' => 'active',
            'tanggal_mulai' => date('Y-m-d'),
            'tanggal_selesai' => date('Y-m-d', strtotime('+1 month')),
        ]);

        $kb = Kriteria::create(['kode_kriteria' => 'KB', 'nama_kriteria' => 'Benefit', 'jenis_kriteria' => 'benefit', 'bobot' => 0.5, 'is_active' => true]);
        $kc = Kriteria::create(['kode_kriteria' => 'KC', 'nama_kriteria' => 'Cost', 'jenis_kriteria' => 'cost', 'bobot' => 0.5, 'is_active' => true]);

        $s1 = SubKriteria::create(['kriteria_id' => $kb->id, 'nama_sub_kriteria' => 'Good', 'nilai' => 80, 'is_active' => true]);
        $s2 = SubKriteria::create(['kriteria_id' => $kb->id, 'nama_sub_kriteria' => 'Ok', 'nilai' => 60, 'is_active' => true]);

        $s3 = SubKriteria::create(['kriteria_id' => $kc->id, 'nama_sub_kriteria' => 'Low', 'nilai' => 30, 'is_active' => true]);
        $s4 = SubKriteria::create(['kriteria_id' => $kc->id, 'nama_sub_kriteria' => 'High', 'nilai' => 90, 'is_active' => true]);

        $u1 = \App\Models\User::factory()->create(['role' => 'karyawan']);
        $u2 = \App\Models\User::factory()->create(['role' => 'karyawan']);

        Penilaian::create(['karyawan_id' => $u1->id, 'periode_penilaian_id' => $periode->id, 'kriteria_id' => $kb->id, 'sub_kriteria_id' => $s1->id, 'nilai' => $s1->nilai, 'penilai_id' => $u1->id]);
        Penilaian::create(['karyawan_id' => $u1->id, 'periode_penilaian_id' => $periode->id, 'kriteria_id' => $kc->id, 'sub_kriteria_id' => $s3->id, 'nilai' => $s3->nilai, 'penilai_id' => $u1->id]);

        Penilaian::create(['karyawan_id' => $u2->id, 'periode_penilaian_id' => $periode->id, 'kriteria_id' => $kb->id, 'sub_kriteria_id' => $s2->id, 'nilai' => $s2->nilai, 'penilai_id' => $u2->id]);
        Penilaian::create(['karyawan_id' => $u2->id, 'periode_penilaian_id' => $periode->id, 'kriteria_id' => $kc->id, 'sub_kriteria_id' => $s4->id, 'nilai' => $s4->nilai, 'penilai_id' => $u2->id]);

        $matrik = [
            $kb->id => 80,
            $kc->id => 30,
        ];

        $controller = new SawController();

        $ref = new \ReflectionClass($controller);
        $method = $ref->getMethod('normalizeMatrix');
        $method->setAccessible(true);

        $result = $method->invoke($controller, $matrik, collect([$kb, $kc]), $periode->id);

        $this->assertEqualsWithDelta(1.0, $result[$kb->id], 0.0001);
        $this->assertEqualsWithDelta(1.0, $result[$kc->id], 0.0001);
    }
}
