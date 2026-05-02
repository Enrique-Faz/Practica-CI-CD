<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'backgroundImage' => $this->background_image,
            'dm' => new UserResource($this->whenLoaded('dm')),
            'characters' => CharacterResource::collection($this->whenLoaded('characters')),
            'initiativeOrder' => $this->initiative_order,
            'currentTurnIndex' => $this->current_turn_index,
            'createdAt' => $this->created_at->toIso8601String(),
        ];
    }
}
