<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Board extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'dm_id',
        'join_code',
        'background_image',
        'initiative_order',
        'current_turn_index'
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Board $board) {
            do {
                $code = strtoupper(Str::random(6));
            } while (self::where('join_code', $code)->exists());

            $board->join_code = $code;
        });
    }

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
