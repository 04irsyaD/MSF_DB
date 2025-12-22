<?php
// Lightweight script to run SAW calculation for a periode from CLI.
// Usage: php scripts/run_saw.php [periode_id]

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Http\Request;
use App\Models\PeriodePenilaian;
use App\Http\Controllers\SawController;

$periodeId = $argv[1] ?? null;
if (!$periodeId) {
    $latest = PeriodePenilaian::latest()->first();
    if (!$latest) {
        echo "No periode found. Create a PeriodePenilaian first.\n";
        exit(1);
    }
    $periodeId = $latest->id;
}

echo "Running SAW for periode_id={$periodeId}\n";

try {
    $request = Request::create('/', 'POST', ['periode_id' => $periodeId]);
    $controller = new SawController();
    $resp = $controller->calculate($request);

    // If controller returned a RedirectResponse, consider it success
    if (is_object($resp) && method_exists($resp, 'getStatusCode')) {
        echo "Calculation executed. Response status: " . $resp->getStatusCode() . "\n";
    } else {
        echo "Calculation executed.\n";
    }
} catch (Throwable $e) {
    echo "Error while running SAW: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
    exit(1);
}

echo "Done.\n";
