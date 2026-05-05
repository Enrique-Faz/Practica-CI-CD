<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBoardRequest;
use App\Http\Requests\UpdateBoardRequest;
use App\Http\Resources\BoardResource;
use App\Models\Board;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BoardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        $boards = Board::where('dm_id', $user->id)
            ->orWhereHas('characters', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with(['dm'])
            ->get();

        return BoardResource::collection($boards);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBoardRequest $request)
    {
        $data = $request->validated();
        $data['dm_id'] = Auth::id();
        $board = Board::create($data);
        return (new BoardResource($board->load('dm')))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Board $board)
    {
        $board->load(['dm', 'characters']);
        return new BoardResource($board);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBoardRequest $request, Board $board)
    {
        $board->update($request->validated());
        return new BoardResource($board->load(['dm', 'characters']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Board $board)
    {
        if ($board->dm_id !== Auth::id()) {
            abort(403, 'Solo el Dungeon Master puede borrar la partida.');
        }
        $board->delete();
        return response()->noContent();
    }

    /* -------------------------------------------------------------------------- */
    /* TABLERO INTERACTIVO                                                        */
    /* -------------------------------------------------------------------------- */

    /**
     * Actualiza la posición (X, Y) de un personaje en la tabla pivote.
     */
    public function updateCharacterPosition(Request $request, Board $board)
    {
        $request->validate([
            'character_id' => 'required|exists:characters,id',
            'position_x' => 'required|integer',
            'position_y' => 'required|integer',
        ]);

        $user = Auth::user();
        $isDm = $board->dm_id === $user->id;

        $character = $board->characters()->find($request->character_id);

        if (!$character) {
            return response()->json(['message' => 'El personaje no está en esta partida'], 404);
        }

        if (!$isDm) {
            if ($character->user_id !== $user->id) {
                return response()->json(['message' => 'No puedes mover el personaje de otro jugador'], 403);
            }

            if (!is_null($board->initiative_order)) {
                $currentIndex = $board->current_turn_index;
                $currentTurnCharacterId = $board->initiative_order[$currentIndex]['character_id'] ?? null;

                if ($currentTurnCharacterId != $character->id) {
                    return response()->json(['message' => 'Espera tu turno para moverte'], 403);
                }
            }
        }

        $board->characters()->updateExistingPivot($character->id, [
            'position_x' => $request->position_x,
            'position_y' => $request->position_y,
        ]);

        return response()->json(['message' => 'Posición actualizada correctamente']);
    }
}
