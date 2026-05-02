<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Board;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function stats(): JsonResponse
    {
        $boardsLast7Days = Board::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as total'))
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get();

        return response()->json([
            'total_users' => User::count(),
            'total_boards' => Board::count(),
            'chart_data' => $boardsLast7Days
        ]);
    }

    public function indexUsers(): JsonResponse
    {
        return response()->json(User::paginate(20));
    }

    public function destroyUser(User $user): JsonResponse
    {
        if ($user->role === 'admin') {
            return response()->json(['message' => 'No puedes eliminar a otro administrador'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado con éxito']);
    }

    public function indexBoards(): JsonResponse
    {
        $boards = Board::with('dm:id,name,email')->paginate(20);

        return response()->json($boards);
    }

    public function destroyBoard(Board $board): JsonResponse
    {
        $board->delete();

        return response()->json(['message' => 'Partida eliminada por el administrador']);
    }
}
