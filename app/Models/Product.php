<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory, HasUuids;

    protected $primaryKey = 'product_id';

    protected $fillable = [
        'product_name',
        'qty_per_box',
        'product_price',
    ];

    public function invoiceDetails(): HasMany
    {
        return $this->hasMany(InvoiceDetail::class, 'product_id');
    }
}
