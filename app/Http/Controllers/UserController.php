<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;


class UserController extends Controller
{
    //    Admin User List အတွက် Data များရယူခြင်း
    public function userIndex()
    {
        $user = User::latest()->paginate(10);
        return response()->json($user);
    }
    // User Detail
    public function userDetail(Request $request, $id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }
    // User ဖျက်သိမ်းခြင်း
    public function userDelete($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found',
            ], 404);
        }
        $user->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'User deleted successfully'
        ], 200);
    }
}
