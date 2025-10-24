<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriesTable extends Migration
{
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Insert default categories
        DB::table('categories')->insert([
            ['name' => 'Teknologi', 'slug' => 'teknologi', 'description' => 'Artikel tentang teknologi dan inovasi'],
            ['name' => 'Pendidikan', 'slug' => 'pendidikan', 'description' => 'Artikel tentang dunia pendidikan'],
            ['name' => 'Kesehatan', 'slug' => 'kesehatan', 'description' => 'Artikel tentang kesehatan dan medis'],
            ['name' => 'Ekonomi', 'slug' => 'ekonomi', 'description' => 'Artikel tentang ekonomi dan bisnis'],
            ['name' => 'Pemerintahan', 'slug' => 'pemerintahan', 'description' => 'Artikel tentang pemerintahan dan politik'],
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('categories');
    }
}