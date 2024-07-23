<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::paginate(10);
        return Inertia::render('Admin/Product/Product', [
            'products' => $products,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Product/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_name' => 'required',
            'product_price' => 'required|numeric',
            'qty_per_box' => 'required|numeric',
        ]);

        try {
            Product::create($validated);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function edit(Request $request)
    {
        $id = $request->input('id');
        $product = Product::where('product_id', $id)->first();
        return Inertia::render('Admin/Product/Update', [
            'product' => $product,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'product_name' => 'required',
            'product_price' => 'required|numeric',
            'qty_per_box' => 'required|numeric',
        ]);

        try {
            $product->update($request->except('_token', '_method'));
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function destroy(string $id)
    {
        $product = Product::find($id);

        if($product) {
            try {
                $product->delete();
            } catch (\Throwable $th) {
                throw $th;
            }
        }
    }
}