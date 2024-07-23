<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory, HasUuids;

    protected $primaryKey = 'payment_id';

    protected $fillable = [
        'invoice_id',
        'user_id',
        'filename',
        'filename_random',
        'description',
    ];

    public function users(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function invoices(): BelongsTo
    {
        return $this->belongsTo(Invoice::class, 'invoice_id');
    }
}
