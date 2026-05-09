<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('boards', function (Blueprint $table) {
            $table->unsignedInteger('grid_cols')->nullable()->after('background_image');
            $table->unsignedInteger('grid_rows')->nullable()->after('grid_cols');
        });
    }

    public function down(): void
    {
        Schema::table('boards', function (Blueprint $table) {
            $table->dropColumn(['grid_cols', 'grid_rows']);
        });
    }
};
