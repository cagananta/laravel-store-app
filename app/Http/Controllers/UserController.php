<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('customer')->paginate(10);
        return Inertia::render('Admin/User/User', [
            'users' => $users,
        ]);
    }
}
