<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Category;
use App\Models\Doctor;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        $user = User::where('role', 'patient')->count();
        $activeDoctor = Doctor::count();
        $category = Category::count();
        $todayBooking = Booking::where('booking_date', Carbon::today())->where('status', '!=', 'cancelled')->count();

        $recentAppointments = Booking::with(['user', 'doctor'])->orderBy('created_at', 'desc')->take(5)->get();
        return response()->json([
            'status' => [
                'users' => $user,
                'doctors' => $activeDoctor,
                'categories' => $category,
                'bookings' => $todayBooking
            ],
            'recentAppointments' => $recentAppointments
        ]);
    }
}
