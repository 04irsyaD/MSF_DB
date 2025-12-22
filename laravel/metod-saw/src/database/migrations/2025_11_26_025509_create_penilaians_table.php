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
        Schema::create('penilaians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('karyawan_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('periode_penilaian_id')->constrained('periode_penilaians')->onDelete('cascade');
            $table->foreignId('kriteria_id')->constrained('kriterias')->onDelete('cascade');
            $table->foreignId('sub_kriteria_id')->constrained('sub_kriterias')->onDelete('cascade');
            $table->decimal('nilai', 8, 2)->comment('Nilai yang diberikan untuk kriteria tertentu');
            $table->foreignId('penilai_id')->constrained('users')->onDelete('cascade');
            $table->text('catatan')->nullable();
            $table->timestamps();

            // Ensure satu karyawan hanya bisa dinilai sekali per kriteria per periode
            $table->unique(['karyawan_id', 'periode_penilaian_id', 'kriteria_id'], 'unique_penilaian_per_kriteria');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penilaians');
    }
};
