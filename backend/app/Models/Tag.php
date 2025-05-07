<?php

namespace App\Models;

use App\Models\Hotel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tag extends Model
{
    //
    use HasFactory;
    protected $fillable = ['name', 'icon_path'];


    public function hotels(): BelongsToMany
    {
        return $this->belongsToMany(Hotel::class);
    }
}
