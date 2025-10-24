<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRolesTable extends Migration
{
    public function up()
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('description')->nullable();
            $table->timestamps();
        });

        // Insert default roles
        DB::table('roles')->insert([
            ['name' => 'admin', 'description' => 'Administrator - Full access'],
            ['name' => 'penulis', 'description' => 'Writer - Can CRUD own articles'],
            ['name' => 'user', 'description' => 'User - View articles only'],
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('roles');
    }
}