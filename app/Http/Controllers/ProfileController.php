<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Customer;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        if ($request->user()->usertype == 'customer') {
            return Inertia::render('Profile/Edit', [
                'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
                'status' => session('status'),
                'customer' => Customer::where('user_id', $request->user()->id)->first(),
            ]);
        }
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    public function storeDeliveryInformation(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => 'required',
            'phone' => 'required|max:20',
            'city' => 'required|max:100',
            'address' => 'required|max:255',
            'zipcode' => 'required|max:20',
        ]);

        try {
            Customer::create($validated);
        } catch (\Throwable $th) {
            throw $th;
        }

        return Redirect::route('profile.edit');
    }

    public function updateDeliveryInformation(Request $request, $id): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => 'required',
            'phone' => 'required|max:20',
            'city' => 'required|max:100',
            'address' => 'required|max:255',
            'zipcode' => 'required|max:20',
        ]);

        try {
            $customer = Customer::find($id);
            $customer->update($validated);
            $customer->save();
        } catch (\Throwable $th) {
            throw $th;
        }

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
