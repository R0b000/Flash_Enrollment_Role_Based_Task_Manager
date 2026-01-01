<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class,'register']);
Route::post('/login', [AuthController::class,'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class,'logout']);
    Route::get('/tasks', [TaskController::class,'list']);
    Route::post('/tasks', [TaskController::class,'create']);
    Route::get('/tasks/{id}',    [TaskController::class,'show']);
    Route::put('/tasks/{id}', [TaskController::class,'update']);
    Route::delete('/tasks/{id}', [TaskController::class, 'delete']);
});