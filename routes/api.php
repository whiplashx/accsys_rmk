<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AccreditationController;

Route::get('/areas', [AccreditationController::class, 'index']);
Route::post('/areas', [AccreditationController::class, 'addArea']);
Route::post('/parameters', [AccreditationController::class, 'addParameter']);
Route::post('/indicators', [AccreditationController::class, 'addIndicator']);
Route::delete('/areas/{id}', [AccreditationController::class, 'deleteArea']);
Route::delete('/parameters/{id}', [AccreditationController::class, 'deleteParameter']);
Route::delete('/indicators/{id}', [AccreditationController::class, 'deleteIndicator']);

