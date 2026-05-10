<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBoardRequest;
use App\Http\Requests\UpdateBoardRequest;
use App\Http\Resources\BoardResource;
use App\Models\Board;
use App\Models\Character;
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
            ->with(['dm', 'characters'])
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
        $user = Auth::user();
        if ($board->dm_id !== $user->id && $user->role !== 'admin') {
            abort(403, 'Solo el Dungeon Master o un administrador puede borrar la partida.');
        }
        $board->delete();

        return response()->noContent();
    }

    public function join(Request $request)
    {
        $request->validate([
            'join_code' => 'required|string',
            'character_id' => 'required|integer|exists:characters,id',
        ]);

        $board = Board::where('join_code', $request->join_code)->firstOrFail();

        $character = Character::where('id', $request->character_id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if ($board->characters()->where('character_id', $character->id)->exists()) {
            return response()->json(['message' => 'El personaje ya está en esta partida.'], 409);
        }

        $board->characters()->attach($character->id);

        return (new BoardResource($board->load(['dm', 'characters'])))
            ->response()
            ->setStatusCode(200);
    }

    /* -------------------------------------------------------------------------- */
    /* TABLERO INTERACTIVO */
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

        if (! $character) {
            return response()->json(['message' => 'El personaje no está en esta partida'], 404);
        }

        if (! $isDm) {
            if ($character->user_id !== $user->id) {
                return response()->json(['message' => 'No puedes mover el personaje de otro jugador'], 403);
            }

            if (! is_null($board->initiative_order)) {
                $currentIndex = $board->current_turn_index;
                $currentTurnCharacterId = $board->initiative_order[$currentIndex]['character_id'] ?? null;

                if ($currentTurnCharacterId != $character->id) {
                    return response()->json(['message' => 'Espera tu turno para moverte'], 403);
                }
            }
        }

        $currentX = $character->pivot->position_x ?? 0;
        $currentY = $character->pivot->position_y ?? 0;
        $maxCells = intdiv($character->speed, 5);
        $distance = max(abs($request->position_x - $currentX), abs($request->position_y - $currentY));

        if ($distance > $maxCells) {
            return response()->json([
                'message' => "Movimiento fuera de rango. Máximo: {$maxCells} casillas, distancia: {$distance}.",
            ], 422);
        }

        $board->characters()->updateExistingPivot($character->id, [
            'position_x' => $request->position_x,
            'position_y' => $request->position_y,
        ]);

        return response()->json(['message' => 'Posición actualizada correctamente']);
    }

    public function nextTurn(Board $board)
    {
        $user = Auth::user();
        $isDm = $board->dm_id === $user->id;

        if (is_null($board->initiative_order) || count($board->initiative_order) === 0) {
            return response()->json(['message' => 'No hay orden de iniciativa configurado.'], 422);
        }

        if (! $isDm) {
            $currentIndex = $board->current_turn_index;
            $currentTurnCharacterId = $board->initiative_order[$currentIndex]['character_id'] ?? null;

            $character = $board->characters()->find($currentTurnCharacterId);
            if (! $character || $character->user_id !== $user->id) {
                return response()->json(['message' => 'Solo puedes pasar turno cuando es tu turno.'], 403);
            }
        }

        $nextIndex = ($board->current_turn_index + 1) % count($board->initiative_order);
        $board->update(['current_turn_index' => $nextIndex]);

        return new BoardResource($board->load(['dm', 'characters']));
    }

    public function removeCharacter(Board $board, Character $character)
    {
        $user = Auth::user();

        $isAdmin = $user->role === 'admin';
        $isDm = $board->dm_id === $user->id;
        $isOwner = $character->user_id === $user->id;

        if (! $isAdmin && ! $isDm && ! $isOwner) {
            abort(403, 'No tienes permiso para expulsar este personaje.');
        }

        if (! $board->characters()->where('character_id', $character->id)->exists()) {
            return response()->json(['message' => 'El personaje no está en esta partida.'], 404);
        }

        $board->characters()->detach($character->id);

        return response()->noContent();
    }
}
