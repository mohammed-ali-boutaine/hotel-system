<?php

namespace App\Models;

use Illuminate\Contracts\Database\Eloquent\Builder;


class Admin extends User
{
    //
    protected $attributes = ['role' => 'admin'];
    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope('admin', function (Builder $builder) {
            $builder->where('role', 'admin');
        });
    }
}
