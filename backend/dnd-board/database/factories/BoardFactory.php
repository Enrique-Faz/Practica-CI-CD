<?php

namespace Database\Factories;

use App\Models\Board;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Board>
 */
class BoardFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => "Campaña: " . fake()->sentence(3),
            'dm_id' => User::where('role', 'normal')->inRandomOrder()->first()->id ?? User::factory(),
            'background_image' => fake()->randomElement([
                'forest.jpg',
                'dungeon.jpg',
                'tavern.jpg',
                'cave.jpg'
            ]),
            'initiative_order' => null,
            'current_turn_index' => 0,
        ];
    }
}
