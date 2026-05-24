<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('careBooking');
});


Route::get('/{any}', function () {
    return view('careBooking');
})->where('any', '.*');

Route::get('/debug-db', function () {
    return config('database.connections.mysql');
});
