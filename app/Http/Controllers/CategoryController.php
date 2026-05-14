<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    // Catgories များကို Backend မှရယူခြင်း
    public function categoryIndex()
    {
        $category = Category::latest()->get();
        return response()->json($category);
    }
    // Category ဖန်တီးခြင်း
    public function categoryStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:225',
            'icon' => 'required|string',
        ]);
        if ($validator->fails()) {
            return $this->validationMessage($validator);
        }
        $category = Category::create([
            'name' => $request->name,
            'icon' => $request->icon,
        ]);
        return response()->json([
            'status' => 'success',
            'message' => 'Category created successfully',
            'category' => $category
        ], 200);
    }
    // Category ပြင်ဆင်ခြင်း
    public function categoryUpdate(Request $request, $editId)
    {
        $category = Category::find($editId);
        if (!$category) {
            return response()->json([
                'status' => 'error',
                'message' => 'Category not found',
            ], 404);
        }
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:225',
            'icon' => 'required|string',
        ]);
        if ($validator->fails()) {
            return $this->validationMessage($validator);
        }
        $category->update([
            'name' => $request->name,
            'icon' => $request->icon
        ]);
        return response()->json([
            'status' => "success",
            'message' => "Category updated successfully",
            'category' => $category
        ]);
    }
    // Category ဖျက်သိမ်းခြင်း
    public function categoryDelete($id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json([
                'status' => 'error',
                'message' => 'Category not found',
            ], 404);
        }
        $category->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Category deleted successfully'
        ], 200);
    }
    // Private function for validation message
    private function validationMessage($validator)
    {
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
}
