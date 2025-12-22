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
        Schema::create('periode_penilaians', function (Blueprint $table) {
            $table->id();
            $table->string('nama_periode');
            $table->year('tahun');
            $table->tinyInteger('bulan')->comment('1-12 untuk bulan');
            $table->enum('status', ['draft', 'active', 'completed', 'closed'])->default('draft');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->text('deskripsi')->nullable();
            $table->timestamps();

            $table->unique(['tahun', 'bulan'], 'unique_periode_per_bulan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('periode_penilaians');
    }
};
