<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\CharacterController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']); // Para obtener los datos de mi perfil

    Route::apiResource('characters', CharacterController::class);

    Route::apiResource('boards', BoardController::class);

    Route::post('/boards/{board}/move', [BoardController::class, 'updateCharacterPosition']);

    Route::middleware(['is_admin'])->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);

        Route::get('/users', [AdminController::class, 'indexUsers']);
        Route::delete('/users/{user}', [AdminController::class, 'destroyUser']);

        Route::get('/boards', [AdminController::class, 'indexBoards']);
        Route::delete('/boards/{board}', [AdminController::class, 'destroyBoard']);
    });
});
