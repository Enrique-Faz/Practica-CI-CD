<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateCharacterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $character = $this->route('character');
        return $character && $character->user_id === Auth::id();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'hp' => 'sometimes|integer|min:1',
            'speed' => 'sometimes|integer|min:1',
            'strength' => 'sometimes|integer|between:1,30',
            'dexterity' => 'sometimes|integer|between:1,30',
            'constitution' => 'sometimes|integer|between:1,30',
            'intelligence' => 'sometimes|integer|between:1,30',
            'wisdom' => 'sometimes|integer|between:1,30',
            'charisma' => 'sometimes|integer|between:1,30',
        ];
    }
}
