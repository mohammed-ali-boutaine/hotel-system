<?php

use App\Models\Admin;
use App\Models\Owner;
use App\Models\Client;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {

    $clients = Client::all(); // Get all clients
    $owners = Owner::all(); // Get all owners
    $admins = Admin::all(); // Get all admins
    
    return $admins;
});
