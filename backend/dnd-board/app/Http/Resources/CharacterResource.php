<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CharacterResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'userId' => $this->user_id,
            'name' => $this->name,
            'hp' => $this->hp,
            'speed' => $this->speed,
            'stats' => [
                'strength' => $this->strength,
                'dexterity' => $this->dexterity,
                'constitution' => $this->constitution,
                'intelligence' => $this->intelligence,
                'wisdom' => $this->wisdom,
                'charisma' => $this->charisma,
            ],
            'position' => $this->whenPivotLoaded('board_character', function () {
                return [
                    'x' => $this->pivot->position_x,
                    'y' => $this->pivot->position_y,
                ];
            }),
        ];
    }
}
