<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class BackupRestore extends Command
{
    protected $signature = 'backup:restore {file}';
    protected $description = 'Restore a simple SQLite backup by copying file to database/database.sqlite (dev-only).';

    public function handle()
    {
        $file = $this->argument('file');
        if (!file_exists($file)) {
            $this->error('File not found: ' . $file);
            return 1;
        }

        $driver = config('database.default');
        if ($driver !== 'sqlite') {
            $this->error('This restore command currently supports only sqlite driver.');
            return 1;
        }

        $dst = database_path('database.sqlite');
        if (!is_dir(dirname($dst))) mkdir(dirname($dst), 0755, true);
        copy($file, $dst);
        $this->info('Restored SQLite DB to: ' . $dst);
        return 0;
    }
}
