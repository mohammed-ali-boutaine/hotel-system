<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Client extends User
{
    protected $fillable = ['address']; 
    protected $attributes = ['role' => 'client'];



    protected  static function boot()
    {
        parent::boot();

        static::addGlobalScope('client', function (Builder $builder) {
            $builder->where('role', 'client');
        });
    }

    public function booking(){
        return $this->hasMany(Booking::class);
    }


}
