<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Kriteria;
use App\Models\SubKriteria;
use App\Models\PeriodePenilaian;
use App\Models\Penilaian;
use App\Models\HasilSaw;

class SawFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_saw_calculation_and_persistence()
    {
        // create admin user to run SAW
        $admin = User::factory()->create(['role' => 'hr']);

        // create periode
        $periode = PeriodePenilaian::create([
            'nama_periode' => 'P-Test',
            'tahun' => date('Y'),
            'bulan' => (int) date('m'),
            'status' => 'active',
            'tanggal_mulai' => date('Y-m-d'),
            'tanggal_selesai' => date('Y-m-d', strtotime('+1 month')),
        ]);

        // create 2 kriteria with weights summing to 1
    $k1 = Kriteria::create(['kode_kriteria' => 'K1','nama_kriteria' => 'K1','jenis_kriteria'=>'benefit','bobot'=>0.6,'is_active'=>true]);
    $k2 = Kriteria::create(['kode_kriteria' => 'K2','nama_kriteria' => 'K2','jenis_kriteria'=>'benefit','bobot'=>0.4,'is_active'=>true]);

        // subkriteria
    $s11 = SubKriteria::create(['kriteria_id'=>$k1->id,'nama_sub_kriteria'=>'A','nilai'=>80,'is_active'=>true]);
    $s12 = SubKriteria::create(['kriteria_id'=>$k1->id,'nama_sub_kriteria'=>'B','nilai'=>60,'is_active'=>true]);

    $s21 = SubKriteria::create(['kriteria_id'=>$k2->id,'nama_sub_kriteria'=>'X','nilai'=>70,'is_active'=>true]);
    $s22 = SubKriteria::create(['kriteria_id'=>$k2->id,'nama_sub_kriteria'=>'Y','nilai'=>50,'is_active'=>true]);

        // create two employees
        $e1 = User::factory()->create(['role'=>'karyawan','name'=>'Emp1']);
        $e2 = User::factory()->create(['role'=>'karyawan','name'=>'Emp2']);

        // penilaian: e1 has higher values
        Penilaian::create(['karyawan_id'=>$e1->id,'periode_penilaian_id'=>$periode->id,'kriteria_id'=>$k1->id,'sub_kriteria_id'=>$s11->id,'nilai'=>$s11->nilai,'penilai_id'=>$admin->id]);
        Penilaian::create(['karyawan_id'=>$e1->id,'periode_penilaian_id'=>$periode->id,'kriteria_id'=>$k2->id,'sub_kriteria_id'=>$s21->id,'nilai'=>$s21->nilai,'penilai_id'=>$admin->id]);

        Penilaian::create(['karyawan_id'=>$e2->id,'periode_penilaian_id'=>$periode->id,'kriteria_id'=>$k1->id,'sub_kriteria_id'=>$s12->id,'nilai'=>$s12->nilai,'penilai_id'=>$admin->id]);
        Penilaian::create(['karyawan_id'=>$e2->id,'periode_penilaian_id'=>$periode->id,'kriteria_id'=>$k2->id,'sub_kriteria_id'=>$s22->id,'nilai'=>$s22->nilai,'penilai_id'=>$admin->id]);

        // Run SAW as HR
        $res = $this->actingAs($admin)->post(route('saw.calculate'), ['periode_id'=>$periode->id]);
        $res->assertRedirect();

        // Assert HasilSaw created and ranking correct (Emp1 should be rank 1)
        $this->assertDatabaseHas('hasil_saws', ['karyawan_id'=>$e1->id, 'periode_penilaian_id'=>$periode->id]);
        $this->assertDatabaseHas('hasil_saws', ['karyawan_id'=>$e2->id, 'periode_penilaian_id'=>$periode->id]);

        $h = HasilSaw::where('periode_penilaian_id',$periode->id)->orderBy('ranking')->get();
        $this->assertEquals($e1->id, $h->first()->karyawan_id);
    }
}
