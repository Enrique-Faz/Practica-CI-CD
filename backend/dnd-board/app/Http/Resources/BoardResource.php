<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class BoardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'joinCode' => $this->when($this->dm_id === Auth::id(), $this->join_code),
            'backgroundImage' => $this->background_image,
            'gridCols' => $this->grid_cols,
            'gridRows' => $this->grid_rows,
            'dm' => new UserResource($this->whenLoaded('dm')),
            'characters' => CharacterResource::collection($this->whenLoaded('characters')),
            'initiativeOrder' => $this->initiative_order
                ? collect($this->initiative_order)->map(fn ($entry) => [
                    'characterId' => $entry['character_id'] ?? null,
                ])->values()->all()
                : null,
            'currentTurnIndex' => $this->current_turn_index,
            'createdAt' => $this->created_at->toIso8601String(),
        ];
    }
}
