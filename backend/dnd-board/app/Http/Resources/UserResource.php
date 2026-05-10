<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'firstName' => $this->first_name ?? 'Usuario',
            'lastName' => $this->last_name ?? '',
            'email' => $this->email,
            'role' => $this->role ?? 'normal',
            'google2fa_enabled' => ! empty($this->google2fa_secret),
        ];
    }
}
