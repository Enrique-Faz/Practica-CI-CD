<?php

namespace Database\Seeders;

use App\Models\Board;
use App\Models\Character;
use App\Models\User;
use Illuminate\Database\Seeder;

class BoardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $testUser = User::where('email', 'test@dnd.com')->first();

        $boardAsDM = Board::factory()->create([
            'name' => 'Mi propia Mazmorra (DM)',
            'dm_id' => $testUser->id,
        ]);

        $randomCharacters = Character::where('user_id', '!=', $testUser->id)->limit(3)->get();
        foreach ($randomCharacters as $char) {
            $boardAsDM->characters()->attach($char->id, [
                'position_x' => rand(1, 10),
                'position_y' => rand(1, 10),
            ]);
        }

        $otherBoard = Board::factory()->create(['name' => 'Aventura en el Bosque']);
        $myChar = $testUser->characters()->first();

        if ($myChar) {
            $otherBoard->characters()->attach($myChar->id, [
                'position_x' => 5,
                'position_y' => 5,
            ]);
        }
    }
}
