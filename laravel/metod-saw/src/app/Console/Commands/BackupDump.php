<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class BackupDump extends Command
{
    protected $signature = 'backup:dump {--path=storage/backups}';
    protected $description = 'Create a simple DB backup (dev-only). For sqlite it copies database file.';

    public function handle()
    {
        $path = $this->option('path') ?? 'storage/backups';
        $driver = config('database.default');

        if ($driver === 'sqlite') {
            $databasePath = database_path('database.sqlite');
            if (!file_exists($databasePath)) {
                $this->error('SQLite database file not found: ' . $databasePath);
                return 1;
            }
            $dstDir = base_path($path);
            if (!is_dir($dstDir)) mkdir($dstDir, 0755, true);
            $filename = 'backup-sqlite-' . date('Ymd_His') . '.sqlite';
            $dst = $dstDir . DIRECTORY_SEPARATOR . $filename;
            copy($databasePath, $dst);
            $this->info('SQLite DB copied to: ' . $dst);
            return 0;
        }

        // For other DBs, attempt to export using available CLI tools (mysqldump/pg_dump)
        $this->warn('Non-sqlite DB detected: attempting CLI dump. Ensure mysqldump or pg_dump is available.');
        $connection = config('database.connections.' . $driver);
        if (!$connection) {
            $this->error('Unsupported DB driver: ' . $driver);
            return 1;
        }

        $dstDir = base_path($path);
        if (!is_dir($dstDir)) mkdir($dstDir, 0755, true);

        if (in_array($driver, ['mysql', 'mysql2'])) {
            $host = $connection['host'] ?? '127.0.0.1';
            $port = $connection['port'] ?? '3306';
            $database = $connection['database'];
            $user = $connection['username'];
            $pass = $connection['password'];
            $file = $dstDir . DIRECTORY_SEPARATOR . "backup-mysql-" . date('Ymd_His') . ".sql";
            $cmd = sprintf('mysqldump -h %s -P %s -u %s -p"%s" %s > "%s"', $host, $port, $user, $pass, $database, $file);
            system($cmd, $ret);
            if ($ret === 0) {
                $this->info('mysqldump created: ' . $file);
                return 0;
            }
            $this->error('mysqldump failed or not available.');
            return 1;
        }

        if ($driver === 'pgsql') {
            $host = $connection['host'] ?? '127.0.0.1';
            $port = $connection['port'] ?? '5432';
            $database = $connection['database'];
            $user = $connection['username'];
            $file = $dstDir . DIRECTORY_SEPARATOR . "backup-pg-" . date('Ymd_His') . ".sql";
            $cmd = sprintf('PGPASSWORD="%s" pg_dump -h %s -p %s -U %s -F p -f "%s" %s', $connection['password'] ?? '', $host, $port, $user, $file, $database);
            system($cmd, $ret);
            if ($ret === 0) {
                $this->info('pg_dump created: ' . $file);
                return 0;
            }
            $this->error('pg_dump failed or not available.');
            return 1;
        }

        $this->error('Backup for driver ' . $driver . ' not implemented.');
        return 1;
    }
}
