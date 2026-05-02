<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->admin()->create();

        User::factory()->count(10)->withCharacters(2)->create();

        // 3. Tu usuario de pruebas
        User::factory()
            ->withCharacters()
            ->create([
            'first_name' => 'Test',
            'last_name' => 'Player',
            'email' => 'test@dnd.com',
            'role' => 'normal',
        ]);
    }
}
