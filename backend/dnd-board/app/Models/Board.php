<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Board extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'dm_id',
        'background_image',
        'initiative_order',
        'current_turn_index'
    ];

    protected $casts = [
        'initiative_order' => 'array',
    ];

    public function dm(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dm_id');
    }

    public function characters(): BelongsToMany
    {
        return $this->belongsToMany(Character::class, 'board_character')
            ->withPivot('position_x', 'position_y')
            ->withTimestamps();
    }
}
