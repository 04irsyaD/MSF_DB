<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PeriodePenilaian;
use App\Models\Kriteria;
use App\Models\User;
use App\Models\Penilaian;
use App\Http\Controllers\SawController;
use Illuminate\Http\Request;

class GenerateSawSample extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'saw:generate-sample {--periode_id=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate sample penilaian and run SAW calculation for a periode (dev only)';

    public function handle()
    {
        $this->info('Generating sample SAW data...');

        $periodeId = $this->option('periode_id');
        $periode = null;
        if ($periodeId) {
            $periode = PeriodePenilaian::find($periodeId);
            if (!$periode) {
                $this->error('Periode with id ' . $periodeId . ' not found.');
                return 1;
            }
        } else {
            $periode = PeriodePenilaian::latest()->first();
            if (!$periode) {
                $this->error('No periode found. Create a periode first.');
                return 1;
            }
        }

        $kriterias = Kriteria::active()->with('subKriterias')->get();
        if ($kriterias->isEmpty()) {
            $this->error('No active kriterias found.');
            return 1;
        }

        $karyawans = User::where('role','karyawan')->get();
        if ($karyawans->isEmpty()) {
            $this->error('No karyawan users found.');
            return 1;
        }

        $penilaiUser = User::whereIn('role',['hr','admin','super_admin'])->first();
        $penilaiId = $penilaiUser ? $penilaiUser->id : null;

        $this->info('Creating penilaian for periode: ' . $periode->nama_periode);

        foreach ($karyawans as $karyawan) {
            foreach ($kriterias as $kriteria) {
                $subs = $kriteria->subKriterias->where('is_active', true)->values();
                if ($subs->isEmpty()) continue;
                $chosen = $subs->random();

                Penilaian::updateOrCreate(
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

        $this->info('Penilaian sample created. Running SAW calculation...');

        try {
            $request = new Request();
            $request->replace(['periode_id' => $periode->id]);
            $controller = new SawController();
            $controller->calculate($request);
            $this->info('SAW calculation completed.');
        } catch (\Throwable $e) {
            $this->error('SAW calculation failed: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
