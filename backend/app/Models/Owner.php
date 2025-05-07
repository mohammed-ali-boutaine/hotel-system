<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Contracts\Database\Eloquent\Builder;

class Owner extends User
{
    protected $attributes = ['role' => 'owner'];

    public static function boot()
    {
        parent::boot();

        static::addGlobalScope('owner', function (Builder $builder) {
            $builder->where('role', 'owner');
        });
    }

    public function hotels(){
        return $this->hasMany(Hotel::class);
    }

}

