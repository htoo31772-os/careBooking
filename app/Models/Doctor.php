<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'experience',
        'expertise',
        'bio',
        'fee',
        'image',
        'view_count',
    ];
    public function category(){
        return $this->belongsTo(Category::class);
    }
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
    public function schedule()
    {
        return $this->hasMany(Schedules::class);
    }
    public function reviews(){
        return $this->hasMany(Review::class);
    }
    public function likes()
    {
        return $this->belongsToMany(User::class, 'doctor_user_likes');
    }
}
