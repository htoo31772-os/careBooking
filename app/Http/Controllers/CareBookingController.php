<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class CareBookingController extends Controller
{
    // Category List
    public function categoryList()
    {
        $category = Category::get();
        return response()->json($category);
    }
    // Doctor List
    public function doctorList()
    {
        $doctor = Doctor::with('category')
            ->withCount(['reviews', 'likes'])
            ->withExists(['likes as is_liked' => function ($query) {
                $query->where('user_id', auth('sanctum')->id());
            }])
            ->get();
        return response()->json($doctor);
    }
    public function toggleLike($id)
    {
        $doctor = Doctor::findOrFail($id);
        $user = Auth::user();

        $status = $doctor->likes()->toggle($user->id);
        $isLiked = count($status['attached']) > 0;

        return response()->json(['is_liked' => $isLiked]);
    }
    // Doctor Detail
    public function doctorDetail($id)
    {
        Doctor::where('id', $id)->increment('view_count');
        $doctor = Doctor::with(['schedule', 'category'])->find($id);
        if (!$doctor) {
            return response()->json(['message' => "ဆရာဝန် မတွေ့ပါ။"], 404);
        }
        return response()->json($doctor);
    }
}
