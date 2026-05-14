<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    // Booking List
    public function bookingList()
    {
        $user = Auth::user();
        $booking = Booking::where('user_id', $user->id)->with('doctor')->get();
        return response()->json($booking);
    }
    // Create Booking
    public function bookingStore(Request $request)
    {
        $user = Auth::user();
        $validator = Validator::make($request->all(), [
            'doctor_id'    => 'required|exists:doctors,id',
            'booking_date' => 'required|date|after_or_equal:today',
            'booking_time' => 'required',
            'message'      => 'required|string|min:5',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'ဖြည့်စွက်ချက်များ မှားယွင်းနေပါသည်။',
                'errors'  => $validator->errors()
            ], 422);
        }
        $bookingTime = Carbon::createFromFormat('h:i A', $request->booking_time)->format('H:i:s');
        $isExists = Booking::where('doctor_id', $request->doctor_id)
            ->where('booking_date', $request->booking_date)
            ->where('booking_time', $bookingTime)
            ->where('status', '!=', 'cancelled')
            ->exists();

        if ($isExists) {
            return response()->json([
                'atatus' => "error",
                'message' => 'တောင်းပန်ပါသည်။ ဤအချိန်မှာ ဘိုကင်ယူပြီးသား ဖြစ်နေပါသည်။ ကျေးဇူးပြု၍ အခြားအချိန်တစ်ခု ရွေးချယ်ပေးပါ။'
            ], 400);
        }
        $booking = Booking::create([
            'user_id' => $user->id,
            'doctor_id' => $request->doctor_id,
            'booking_date' => $request->booking_date,
            'booking_time' => $bookingTime,
            'message' => $request->message
        ]);
        return response()->json([
            'status' => 'success',
            'message' => 'Booking တင်ခြင်း အောင်မြင်ပါသည်။',
            'data'    => $booking
        ], 201);
    }
    // Cancle Booking
    public function bookingCancel($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->update(['status' => 'cancelled']);
        $booking->load(['user', 'doctor']);
        return response()->json($booking, 200);
    }
    // For Admin Management
    // Booking List & Filter
    public function bookingIndex(Request $request)
    {
        $query = Booking::with(['user', 'doctor']);
        // Filter Date
        if ($request->has('date') && $request->date != '') {
            $query->whereDate('booking_date', $request->date);
        }
        // Filter Status
        if ($request->has('status') && $request->status != 'All Status' && $request->status != '') {
            $query->where('status', $request->status);
        }
        $booking = $query->latest()->paginate(10);
        return response()->json($booking);
    }
    // Booking Confirm
    public function bookingConfirm($id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking list not found',
            ], 404);
        }
        $booking->update(['status' => 'confirmed']);
        $booking->load(['user', 'doctor']);
        return response()->json($booking, 200);
    }
    // Delete Booking
    public function bookingDelete($id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking list not found',
            ], 404);
        }
        $booking->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'booking list deleted successfully'
        ], 200);
    }
}
