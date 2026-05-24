<?php

namespace Tests\Unit;

use App\Models\Board;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BoardModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_board_generates_unique_join_code_on_creation(): void
    {
        $user = User::factory()->create();

        $board = Board::factory()->create([
            'dm_id' => $user->id,
        ]);

        $this->assertNotNull($board->join_code);
        $this->assertMatchesRegularExpression('/^[A-Z0-9]{6}$/', $board->join_code);
    }

    public function test_board_dm_relationship_returns_user(): void
    {
        $user = User::factory()->create([
            'first_name' => 'Carlos',
            'email' => 'dm@test.com',
        ]);

        $board = Board::factory()->create([
            'dm_id' => $user->id,
        ]);

        $this->assertInstanceOf(User::class, $board->dm);
        $this->assertEquals('Carlos', $board->dm->first_name);
        $this->assertEquals('dm@test.com', $board->dm->email);
    }
}
