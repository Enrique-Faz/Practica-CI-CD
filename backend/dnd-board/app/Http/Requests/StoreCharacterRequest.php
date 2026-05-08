<?php

namespace App\Http\Requests;

use App\Enums\CharacterClass;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreCharacterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'class' => ['required', 'string', new Enum(CharacterClass::class)],
            'hp' => 'required|integer|min:1',
            'speed' => 'required|integer|min:1',
            'strength' => 'required|integer|between:1,30',
            'dexterity' => 'required|integer|between:1,30',
            'constitution' => 'required|integer|between:1,30',
            'intelligence' => 'required|integer|between:1,30',
            'wisdom' => 'required|integer|between:1,30',
            'charisma' => 'required|integer|between:1,30',
        ];
    }
}
