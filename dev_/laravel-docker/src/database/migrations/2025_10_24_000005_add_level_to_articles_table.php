<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLevelToArticlesTable extends Migration
{
    public function up()
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->enum('level', ['pemula', 'menengah', 'lanjutan'])->default('pemula')->after('category_id');
        });
    }

    public function down()
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn('level');
        });
    }
}