<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCharacterRequest;
use App\Http\Requests\UpdateCharacterRequest;
use App\Http\Resources\CharacterResource;
use App\Models\Character;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CharacterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $characters = Auth::user()->characters;
        return CharacterResource::collection($characters);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCharacterRequest $request)
    {
        $character = Auth::user()->characters()->create($request->validated());
        return (new CharacterResource($character))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Character $character)
    {
        $this->authorizeOwner($character);
        return new CharacterResource($character);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCharacterRequest $request, Character $character)
    {
        $character->update($request->validated());
        return new CharacterResource($character);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Character $character)
    {
        $this->authorizeOwner($character);
        $character->delete();

        return response()->noContent();
    }

    private function authorizeOwner(Character $character)
    {
        if ($character->user_id !== Auth::id()) {
            abort(403, 'No tienes permiso para acceder a este personaje.');
        }
    }
}
