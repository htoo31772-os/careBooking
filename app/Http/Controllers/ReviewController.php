<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    // Doctor's reviews
    public function commentShow(Request $request, $id)
    {
        $reviews = Review::where('doctor_id', $id)->with('user')->get();
        return response()->json($reviews);
    }
    // Doctor အား မှတ်ချက်ရေးသားခြင်း
    public function writeComment(Request $request, $id)
    {
        $user = Auth::user();
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer',
            'comment' => 'required|string'
        ]);
        $this->validationMessage($validator);
        $review = Review::create([
            'user_id' => $user->id,
            'doctor_id' => $id,
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);
        $review->load('user');
        return response()->json($review, 201);
    }
    // Private Message function
    private function validationMessage($validator)
    {
        $errors = $validator->errors()->getMessages();
        $errorMessage = [];
        foreach ($errors as $error => $message) {
            $errorMessage[$error] = $message[0];
        }
        return response()->json([
            'status' => 'error',
            'message' => 'Validation failed',
            'errors' => $errorMessage,
        ], 422);
    }
}
