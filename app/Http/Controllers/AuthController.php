<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    //Register
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed'
        ]);
        if ($validator->fails()) {
            return $this->validationMessage($validator);
        }
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);
        Auth::login($user);
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'status' => 'success',
            'message' => 'Registration successfully',
            'user' => $user,
            'access_token' => $token
        ], 200);
    }
    // Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Logout အောင်မြင်ပါသည်။'
        ], 200);
    }
    // Login
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:8'
        ]);
        if ($validator->fails()) {
            return $this->validationMessage($validator);
        }
        if (Auth::attempt($request->only('email', 'password'))) {
            $user = User::where('email', $request->email)->first();
            $token = $user->createToken('auth_token')->plainTextToken;
            return response()->json([
                'status' => 'success',
                'message' => "Login အောင်မြင်ပါသည်။",
                'access_token' => $token,
                'user' => $user
            ], 200);
        }
        return response()->json([
            'status' => 'error',
            'message' => 'Login မအောင်မြင်ပါ။'
        ], 401);
    }
    // Update Profile
    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'phone' => 'nullable|string',
            'birthDay' => 'nullable|date',
            'address' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);
        if ($validator->fails()) {
            return $this->validationMessage($validator);
        }
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $data = [
            'name' => $request->name,
            'phone' => $request->phone,
            'address' => $request->address
        ];
        if ($request->birthDay) {
            $data['date_of_birth'] = \Carbon\Carbon::parse($request->birthDay)->format('Y-m-d');
        }
        if ($request->hasFile('image')) {
            if ($user->profile_photo) {
                Storage::disk('public')->delete('user/' . $user->profile_photo);
            }
            $imageName = uniqid() . $request->file('image')->getClientOriginalName();
            $request->file('image')->storeAs('user', $imageName, 'public');
            $data['profile_photo'] = $imageName;
        }
        $user->update($data);
        $user->refresh();
        return response()->json([
            'status' => 'success',
            'message' => 'Profile ပြင်ဆင်ခြင်းအောင်မြင်ပါသည်။',
            'user' => $user
        ], 200);
    }
    // Private Error Message function
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
