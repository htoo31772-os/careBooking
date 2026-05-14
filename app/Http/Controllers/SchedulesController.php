<?php

namespace App\Http\Controllers;

use App\Models\Schedules;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SchedulesController extends Controller
{
    // Get Shcedule List
    public function scheduleIndex()
    {
        $schedule = Schedules::with('doctor')->paginate(10);
        return response()->json($schedule);
    }
    // Create Schedule
    public function scheduleStore(Request $request)
    {
        $this->validationError($request);
        $IsOverLapping = Schedules::where('doctor_id', $request->doctor_id)
            ->where('day_of_week', $request->day_of_week)
            ->where(function ($query) use ($request) {
                $query->where('start_time', '<', $request->end_time)
                    ->where('end_time', '>', $request->start_time);
            })->exists();
        if ($IsOverLapping) {
            return response()->json([
                'message' => "ဤဆရာဝန်သည် ဤအချိန်အတွင်းတွင် အခြား schedule ရှိနေပြီးသားဖြစ်ပါသည်။"
            ], 409);
        }
        $schedule = Schedules::create([
            'doctor_id' => $request->doctor_id,
            'day_of_week' => $request->day_of_week,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'slot_duration' => $request->slot_duration
        ]);
        $schedule->load('doctor');
        return response()->json([
            'message' => "Schedule အသစ်ဖန်တီးပြီးပါပြီ။",
            'schedule' => $schedule
        ], 201);
    }
    // Edit Schedule
    public function scheduleUpdate(Request $request, $id)
    {
        $schedule = Schedules::find($id);
        if (!$schedule) {
            return response()->json(['message' => "Schedult do not found"], 404);
        }
        $this->validationError($request);
        $IsOverLapping = Schedules::where('doctor_id', $request->doctor_id)
            ->where('doctor_id', $request->doctor_id)
            ->where('day_of_week', $request->day_of_week)
            ->where(function ($query) use ($request) {
                $query->where('start_time', '<', $request->end_time)
                    ->where('end_time', '>', $request->start_time);
            })->exists();
        if ($IsOverLapping) {
            return response()->json([
                'message' => "ဤဆရာဝန်သည် ဤအချိန်အတွင်းတွင် အခြား schedule ရှိနေပြီးသားဖြစ်ပါသည်။"
            ], 409);
        }
        $schedule->update([
            'doctor_id' => $request->doctor_id,
            'day_of_week' => $request->day_of_week,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'slot_duration' => $request->slot_duration
        ]);
        $schedule->load('doctor');
        return response()->json([
            'message' => "Schedule အသစ်ဖန်တီးပြီးပါပြီ။",
            'schedule' => $schedule
        ], 201);
    }
    // Delete Schedule
    public function scheduleDelete($id)
    {
        $schedule = Schedules::find($id);
        if (!$schedule) {
            return response()->json([
                'status' => 'error',
                'message' => 'Schedule not found',
            ], 404);
        }
        $schedule->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Schedule deleted successfully'
        ], 200);
    }
    // Private function form validator
    private function validationError($request)
    {
        $validator = Validator::make($request->all(), [
            'doctor_id'     => 'required|exists:doctors,id',
            'day_of_week'   => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time'    => 'required|date_format:H:i',
            'end_time'      => 'required|date_format:H:i|after:start_time',
            'slot_duration' => 'required|integer|min:10|max:120',
        ]);
        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            $errorMessage = [];
            foreach ($errors as $error => $message) {
                $errorMessage[$error] = $message[0];
            }
            return response()->json([
                'status' => 'error',
                'message' => "Validation fail",
                'errors' => $errorMessage
            ], 422);
        }
        return null;
    }
}
