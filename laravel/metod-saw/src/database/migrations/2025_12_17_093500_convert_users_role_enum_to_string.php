<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // If the role column doesn't exist, simply create a string role column
        if (!Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('role')->default('karyawan');
            });
            return;
        }

        // Add a temporary column to copy existing values
        if (!Schema::hasColumn('users', 'role_backup')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('role_backup')->nullable();
            });
        }

        // Copy current enum values into backup column
        DB::table('users')->update(['role_backup' => DB::raw('role')]);

        // Drop the old enum column and create a new string based 'role' column
        Schema::table('users', function (Blueprint $table) {
            // dropColumn should work across drivers; Laravel will recreate the table for sqlite if needed
            $table->dropColumn('role');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('karyawan');
        });

        // Restore values from backup
        DB::table('users')->update(['role' => DB::raw('role_backup')]);

        // Remove backup column
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role_backup');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // We intentionally do not try to recreate the original enum type here because
        // recreating an enum varies per database engine. This down() is a noop to avoid
        // accidental data loss. If you need to revert to an enum, create a targeted
        // migration for your DB platform.
    }
};
