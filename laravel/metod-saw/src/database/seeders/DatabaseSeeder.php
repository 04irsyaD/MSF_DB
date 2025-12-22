<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Super Admin
        User::updateOrCreate(
            ['email' => 'superadmin@saw.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('password'),
                'role' => 'super_admin',
                'employee_id' => 'SA001',
                'department' => 'IT',
                'position' => 'System Administrator',
                'phone' => '081234567890',
                'hire_date' => '2024-01-01',
                'is_active' => true
            ]
        );

        // Create HR Admin
        User::updateOrCreate(
            ['email' => 'hr@saw.com'],
            [
                'name' => 'HR Manager',
                'password' => bcrypt('password'),
                'role' => 'hr',
                'employee_id' => 'HR001',
                'department' => 'Human Resources',
                'position' => 'HR Manager',
                'phone' => '081234567891',
                'hire_date' => '2024-01-15',
                'is_active' => true
            ]
        );

        // Create Admin Sistem (optional additional admin account)
        User::updateOrCreate(
            ['email' => 'admin@saw.com'],
            [
                'name' => 'Admin Sistem',
                'password' => bcrypt('password'),
                'role' => 'admin',
                'employee_id' => 'AD001',
                'department' => 'IT',
                'position' => 'Administrator',
                'phone' => '081234567892',
                'hire_date' => '2024-02-01',
                'is_active' => true
            ]
        );

        // Create a Supervisor account
        User::updateOrCreate(
            ['email' => 'supervisor@saw.com'],
            [
                'name' => 'Supervisor Sample',
                'password' => bcrypt('password'),
                'role' => 'supervisor',
                'employee_id' => 'SPV001',
                'department' => 'IT',
                'position' => 'Supervisor',
                'phone' => '081234567893',
                'hire_date' => '2024-03-01',
                'is_active' => true
            ]
        );

        // Create sample employees
        $departments = ['IT', 'Finance', 'Marketing', 'Operations', 'HR'];
        $positions = ['Staff', 'Senior Staff', 'Supervisor', 'Manager', 'Coordinator'];

        for ($i = 1; $i <= 10; $i++) {
            $employeeId = 'EMP' . str_pad($i, 3, '0', STR_PAD_LEFT);
            User::updateOrCreate(
                ['employee_id' => $employeeId],
                [
                    'name' => 'Karyawan ' . $i,
                    'email' => 'karyawan' . $i . '@saw.com',
                    'password' => bcrypt('password'),
                    'role' => 'karyawan',
                    'department' => $departments[array_rand($departments)],
                    'position' => $positions[array_rand($positions)],
                    'phone' => '08123456789' . $i,
                    'hire_date' => '2024-' . str_pad(rand(1, 12), 2, '0', STR_PAD_LEFT) . '-' . str_pad(rand(1, 28), 2, '0', STR_PAD_LEFT),
                    'is_active' => true
                ]
            );
        }

        // Create sample criteria
        $this->createSampleKriteria();
        
        // Create sample periode
        $this->createSamplePeriode();

        // Create sample penilaian and run SAW to generate hasil
        $this->createSamplePenilaian();
    }

    private function createSampleKriteria()
    {
        $kriterias = [
            [
                'kode_kriteria' => 'K01',
                'nama_kriteria' => 'Kualitas Kerja',
                'jenis_kriteria' => 'benefit',
                'bobot' => 0.25,
                'deskripsi' => 'Penilaian terhadap kualitas hasil kerja karyawan'
            ],
            [
                'kode_kriteria' => 'K02',
                'nama_kriteria' => 'Kuantitas Kerja',
                'jenis_kriteria' => 'benefit',
                'bobot' => 0.20,
                'deskripsi' => 'Penilaian terhadap jumlah pekerjaan yang diselesaikan'
            ],
            [
                'kode_kriteria' => 'K03',
                'nama_kriteria' => 'Disiplin',
                'jenis_kriteria' => 'benefit',
                'bobot' => 0.15,
                'deskripsi' => 'Penilaian terhadap kedisiplinan karyawan'
            ],
            [
                'kode_kriteria' => 'K04',
                'nama_kriteria' => 'Kerjasama',
                'jenis_kriteria' => 'benefit',
                'bobot' => 0.20,
                'deskripsi' => 'Penilaian terhadap kemampuan bekerjasama'
            ],
            [
                'kode_kriteria' => 'K05',
                'nama_kriteria' => 'Absensi',
                'jenis_kriteria' => 'cost',
                'bobot' => 0.20,
                'deskripsi' => 'Jumlah hari tidak hadir (semakin kecil semakin baik)'
            ]
        ];

        foreach ($kriterias as $kriteria) {
            \App\Models\Kriteria::updateOrCreate(
                ['kode_kriteria' => $kriteria['kode_kriteria']],
                $kriteria
            );
        }

        // Create sub kriteria untuk setiap kriteria
        $this->createSubKriteria();
    }

    private function createSubKriteria()
    {
        $subKriterias = [
            // Untuk K01 - Kualitas Kerja
            1 => [
                ['nama_sub_kriteria' => 'Sangat Baik', 'nilai' => 5],
                ['nama_sub_kriteria' => 'Baik', 'nilai' => 4],
                ['nama_sub_kriteria' => 'Cukup', 'nilai' => 3],
                ['nama_sub_kriteria' => 'Kurang', 'nilai' => 2],
                ['nama_sub_kriteria' => 'Sangat Kurang', 'nilai' => 1]
            ],
            // Untuk K02 - Kuantitas Kerja
            2 => [
                ['nama_sub_kriteria' => 'Sangat Tinggi', 'nilai' => 5],
                ['nama_sub_kriteria' => 'Tinggi', 'nilai' => 4],
                ['nama_sub_kriteria' => 'Sedang', 'nilai' => 3],
                ['nama_sub_kriteria' => 'Rendah', 'nilai' => 2],
                ['nama_sub_kriteria' => 'Sangat Rendah', 'nilai' => 1]
            ],
            // Untuk K03 - Disiplin
            3 => [
                ['nama_sub_kriteria' => 'Sangat Disiplin', 'nilai' => 5],
                ['nama_sub_kriteria' => 'Disiplin', 'nilai' => 4],
                ['nama_sub_kriteria' => 'Cukup Disiplin', 'nilai' => 3],
                ['nama_sub_kriteria' => 'Kurang Disiplin', 'nilai' => 2],
                ['nama_sub_kriteria' => 'Tidak Disiplin', 'nilai' => 1]
            ],
            // Untuk K04 - Kerjasama
            4 => [
                ['nama_sub_kriteria' => 'Sangat Kooperatif', 'nilai' => 5],
                ['nama_sub_kriteria' => 'Kooperatif', 'nilai' => 4],
                ['nama_sub_kriteria' => 'Cukup Kooperatif', 'nilai' => 3],
                ['nama_sub_kriteria' => 'Kurang Kooperatif', 'nilai' => 2],
                ['nama_sub_kriteria' => 'Tidak Kooperatif', 'nilai' => 1]
            ],
            // Untuk K05 - Absensi (dalam hari)
            5 => [
                ['nama_sub_kriteria' => '0 hari tidak hadir', 'nilai' => 0],
                ['nama_sub_kriteria' => '1-2 hari tidak hadir', 'nilai' => 1.5],
                ['nama_sub_kriteria' => '3-4 hari tidak hadir', 'nilai' => 3.5],
                ['nama_sub_kriteria' => '5-6 hari tidak hadir', 'nilai' => 5.5],
                ['nama_sub_kriteria' => '7+ hari tidak hadir', 'nilai' => 8]
            ]
        ];

        foreach ($subKriterias as $kriteriaId => $subs) {
            foreach ($subs as $sub) {
                \App\Models\SubKriteria::updateOrCreate(
                    [
                        'kriteria_id' => $kriteriaId,
                        'nama_sub_kriteria' => $sub['nama_sub_kriteria']
                    ],
                    [
                        'nilai' => $sub['nilai'],
                        'is_active' => true
                    ]
                );
            }
        }
    }

    private function createSamplePeriode()
    {
        \App\Models\PeriodePenilaian::updateOrCreate(
            ['nama_periode' => 'Penilaian Kinerja November 2025'],
            [
                'tahun' => 2025,
                'bulan' => 11,
                'status' => 'active',
                'tanggal_mulai' => '2025-11-01',
                'tanggal_selesai' => '2025-11-30',
                'deskripsi' => 'Periode penilaian kinerja karyawan bulan November 2025'
            ]
        );
    }

    private function createSamplePenilaian()
    {
        $periode = \App\Models\PeriodePenilaian::latest()->first();
        if (!$periode) return;

        $kriterias = \App\Models\Kriteria::active()->with('subKriterias')->get();
        $karyawans = \App\Models\User::where('role','karyawan')->get();

        $penilaiUser = \App\Models\User::whereIn('role',['hr','admin','super_admin'])->first();
        $penilaiId = $penilaiUser ? $penilaiUser->id : null;

        foreach ($karyawans as $karyawan) {
            foreach ($kriterias as $kriteria) {
                // pick a random active subkriteria for the kriteria
                $subs = $kriteria->subKriterias->where('is_active', true)->values();
                if ($subs->isEmpty()) continue;
                $chosen = $subs->random();

                \App\Models\Penilaian::updateOrCreate(
                    [
                        'karyawan_id' => $karyawan->id,
                        'periode_penilaian_id' => $periode->id,
                        'kriteria_id' => $kriteria->id
                    ],
                    [
                        'sub_kriteria_id' => $chosen->id,
                        'nilai' => $chosen->nilai,
                        'penilai_id' => $penilaiId,
                        'catatan' => 'Auto-generated sample data'
                    ]
                );
            }
        }

        // Run SAW calculation (call controller method directly)
        try {
            $request = new \Illuminate\Http\Request();
            $request->replace(['periode_id' => $periode->id]);
            $controller = new \App\Http\Controllers\SawController();
            // call calculate directly (bypasses middleware) to generate HasilSaw
            $controller->calculate($request);
        } catch (\Throwable $e) {
            // ignore exceptions during seeding but log if possible
            // echo 'SAW seeding error: ' . $e->getMessage() . "\n";
        }
    }
}
