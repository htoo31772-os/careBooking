<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DoctorController extends Controller
{
    // Doctor data ရယူခြင်း
    public function doctorIndex()
    {
        $doctor = Doctor::with('category')->latest()->get();
        return response()->json($doctor);
    }
    // Doctor ဖန်တီးခြင်း
    public function doctorStore(Request $request)
    {
        $this->privateValidation($request);
        $data = $this->dataArrange($request);
        if ($request->hasFile('image')) {
            $imageName = uniqid() . $request->file('image')->getClientOriginalName();
            $request->file('image')->storeAs('doctor', $imageName, 'public');
            $data['image'] = $imageName;
        }
        $doctor = Doctor::create($data);
        return response()->json([
            'status' => "success",
            'message' => "ဖန်တီးမှု အောင်မြင်ပါသည်။",
            'doctor' => $doctor
        ], 200);
    }
    // Doctor ပြင်ဆင်ခြင်း
    public function doctorUpdate(Request $request, $id)
    {
        $doctor = Doctor::findOrFail($id);
        $this->privateValidation($request);
        $data = $this->dataArrange($request);
        if ($request->hasFile('image')) {
            if ($doctor->image) {
                Storage::disk('public')->delete('doctor/' . $doctor->image);
            }
            $imageName = uniqid() . $request->file('image')->getClientOriginalName();
            $request->file('image')->storeAs('doctor', $imageName, 'public');
            $data['image'] = $imageName;
        }
        $doctor->update($data);
        return response()->json([
            'status' => 'success',
            'message' => 'ဆရာဝန် ပြင်ဆင်ပြီးပါပြီ။'
        ], 200);
    }
    // Doctor delete လုပ်ခြင်း
    public function doctorDelete($id)
    {
        $doctor = Doctor::find($id);
        if (!$doctor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Doctor not found',
            ], 404);
        }
        if ($doctor->image !== null) {
            Storage::disk('public')->delete('doctor/' . $doctor->image);
        }
        $doctor->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Category deleted successfully'
        ], 200);
    }
    // Private function for DataArrange
    private function dataArrange($request)
    {
        return [
            'name' => $request->name,
            'category_id' => $request->category_id,
            'experience' => $request->experience,
            'expertise' => $request->expertise,
            'fee' => $request->fee,
            'bio' => $request->bio
        ];
    }
    // Private function for validation message
    private function privateValidation($request)
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'required|string|max:255',
            'category_id'   => 'required|exists:categories,id',
            'experience'  => 'required|string',
            'expertise'   => 'required|string',
            'fee'         => 'required|numeric',
            'bio'         => 'required|string',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
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
