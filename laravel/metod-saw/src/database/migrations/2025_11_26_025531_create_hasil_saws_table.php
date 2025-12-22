<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hasil_saws', function (Blueprint $table) {
            $table->id();
            $table->foreignId('karyawan_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('periode_penilaian_id')->constrained('periode_penilaians')->onDelete('cascade');
            $table->decimal('nilai_preferensi', 10, 6)->comment('Hasil perhitungan SAW');
            $table->integer('ranking')->comment('Ranking berdasarkan nilai preferensi');
            $table->json('detail_perhitungan')->nullable()->comment('Detail breakdown perhitungan SAW');
            $table->timestamps();

            $table->unique(['karyawan_id', 'periode_penilaian_id'], 'unique_hasil_per_periode');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hasil_saws');
    }
};
