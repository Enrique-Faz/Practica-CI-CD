<?php

namespace App\Http\Requests;

use App\Enums\BoardMap;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Enum;

class UpdateBoardRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $board = $this->route('board');
        return $board && $board->dm_id === Auth::id();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'background_image' => ['sometimes', 'required', 'string', new Enum(BoardMap::class)],
            'grid_cols' => 'sometimes|required|integer|min:5|max:100',
            'grid_rows' => 'sometimes|required|integer|min:5|max:100',
            'initiative_order' => 'nullable|array',
            'current_turn_index' => 'sometimes|integer|min:0',
        ];
    }
}
