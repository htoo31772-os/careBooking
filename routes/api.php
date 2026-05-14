<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CareBookingController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SchedulesController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/category/list', [CareBookingController::class, 'categoryList']);
Route::get('/doctor/list', [CareBookingController::class, 'doctorList']);
Route::get('/doctor/detail/{id}', [CareBookingController::class, 'doctorDetail']);
Route::get('/doctor/comment/show/{id}', [ReviewController::class, 'commentShow']);
Route::middleware('auth:sanctum')->group(function () {
    // Logout & Edit Profile
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/updateProfile', [AuthController::class, 'updateProfile']);
    // Booking
    Route::get('/booking/list', [BookingController::class, 'bookingList']);
    Route::post('/booking/store', [BookingController::class, 'bookingStore']);
    Route::post('/booking/cancel/{id}', [BookingController::class, 'bookingCancel']);
    // Review & Like
    Route::post('/doctor/like/{id}', [CareBookingController::class, 'toggleLike']);
    Route::post('/doctor/comment/writeComment/{id}', [ReviewController::class, 'writeComment']);
    // Admin
    Route::middleware('admin')->group(function () {
        Route::prefix('admin')->group(function () {
            // Dashboard
            Route::get('/dashboard', [AdminController::class, 'dashboard']);
            // Category Management
            Route::post('/category/store', [CategoryController::class, 'categoryStore']);
            Route::get('/category/index', [CategoryController::class, 'categoryIndex']);
            Route::post('/category/update/{editId}', [CategoryController::class, 'categoryUpdate']);
            Route::post('/category/delete/{id}', [CategoryController::class, 'categoryDelete']);
            // Doctor Management
            Route::get('/doctor/index', [DoctorController::class, 'doctorIndex']);
            Route::post('/doctor/store', [DoctorController::class, 'doctorStore']);
            Route::post('/doctor/update/{id}', [DoctorController::class, 'doctorUpdate']);
            Route::post('/doctor/delete/{id}', [DoctorController::class, 'doctorDelete']);
            // User Management
            Route::get('/user/index', [UserController::class, 'userIndex']);
            Route::get('/user/show/{id}', [UserController::class, 'userDetail']);
            Route::post('/user/delete/{id}', [UserController::class, 'userDelete']);
            // Schedule Management
            Route::get('/schedule/index', [SchedulesController::class, 'scheduleIndex']);
            Route::post('/schedule/store', [SchedulesController::class, 'scheduleStore']);
            Route::post('/schedule/edit/{id}', [SchedulesController::class, 'scheduleUpdate']);
            Route::post('/schedule/delete/{id}', [SchedulesController::class, 'scheduleDelete']);
            // Booking Management
            Route::get('/booking/index', [BookingController::class, 'bookingIndex']);
            Route::post('/booking/confirm/{id}', [BookingController::class, 'bookingConfirm']);
            Route::post('/booking/delete/{id}', [BookingController::class, 'bookingDelete']);
        });
    });
});
