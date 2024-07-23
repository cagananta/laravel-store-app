<?php

use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AdminAuth;
use App\Http\Middleware\CustomerAuth;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', AdminAuth::class])->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/storeDeliveryInformation', [ProfileController::class, 'storeDeliveryInformation'])->name('profile.store.delivery');
    Route::put('/updateDeliveryInformation/{id}', [ProfileController::class, 'updateDeliveryInformation'])->name('profile.update.delivery');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', AdminAuth::class])->group(function () {
    Route::get('/products', [ProductController::class, 'index'])->name('products');
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/products/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::post('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    Route::get('/payments', [PaymentController::class, 'index'])->name('payments');
    Route::post('/payment/confirm-payment', [PaymentController::class, 'confirmPayment'])->name('payment.confirm-payment');
    Route::post('/payment/reset', [PaymentController::class, 'reset'])->name('payment.reset');
});

Route::middleware(['auth', CustomerAuth::class])->group(function () {
    Route::get('/purchase-order', [PurchaseOrderController::class, 'index'])->name('purchase-order');
    Route::get('/purchase-order/create', [PurchaseOrderController::class, 'create'])->name('purchase-order.create');
    Route::post('/purchase-order', [PurchaseOrderController::class, 'store'])->name('purchase-order.store');
    Route::post('/payment/store', [PaymentController::class, 'store'])->name('payment.store');
    Route::post('/payment/delete', [PaymentController::class, 'delete'])->name('payment.delete');
});

Route::middleware('auth')->group(function () {
    Route::get('/purchase-order/show', [PurchaseOrderController::class, 'show'])->name('purchase-order.show');
    Route::get('/payment/preview-file/{param}', [PaymentController::class, 'previewFile'])->name('payment.preview-file');
});

require __DIR__ . '/auth.php';