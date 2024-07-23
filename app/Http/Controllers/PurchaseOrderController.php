<?php

namespace App\Http\Controllers;

use App\Http\Middleware\AdminAuth;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\InvoiceDetail;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    public function index(Request $request)
    {
        $invoices = Invoice::where('user_id', Auth::user()->id)->paginate(10);
        $customer = Customer::where('user_id', $request->user()->id)->first();
        $isFilled = false;

        if ($customer) {
            $isFilled = true;
        }

        return Inertia::render('Customer/PurchaseOrder/Index', [
            'invoices' => $invoices,
            'customer' => $isFilled,
        ]);
    }

    public function create()
    {
        $products = Product::all();
        return Inertia::render('Customer/PurchaseOrder/Create', [
            'products' => $products
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        if (!$data) {
            return redirect()->back();
        } else {
            $customerId = Auth::user()->id;
            $totalAmount = 0;
            $paidAmount = 0;
            $status = 'B';
            $currentDate = Carbon::now();
            $dateThreeWeeksFromNow = $currentDate->addWeek(3);
            $billedDate = $dateThreeWeeksFromNow->format('Y-m-d');
            $invoiceNumber = Carbon::now()->format('YmdHis');

            foreach ($data as $row) {
                $amount = (DB::table('products')->where('product_id', $row['product_id'])->value('product_price')) * $row['quantity'];
                $totalAmount += $amount;
            }

            $invoice = [
                'invoice_number' => $invoiceNumber,
                'user_id' => $customerId,
                'amount' => $totalAmount,
                'status' => $status,
                'paid_amount' => $paidAmount,
                'billed_date' => $billedDate,
            ];

            if ($invoice) {
                Invoice::create($invoice);
                $currInvoice = Invoice::where('invoice_number', $invoiceNumber)->first();
                foreach ($data as $row) {
                    $product = Product::where('product_id', $row['product_id'])->first();
                    $invoiceDetail = [
                        'invoice_id' => $currInvoice->invoice_id,
                        'product_id' => $row['product_id'],
                        'total_qty'  => (int)($product->qty_per_box * $row['quantity']),
                        'total_box' => $row['quantity'],
                        'total_price' => (int)($product->product_price * $row['quantity']),
                    ];
                    InvoiceDetail::create($invoiceDetail);
                }
            }

            return to_route('purchase-order');
        }
    }

    public function show(Request $request)
    {
        $invoiceId = $request->input('id');
        $invoice = Invoice::with(['invoiceDetails.products', 'users', 'users.customer', 'payments'])->find($invoiceId);

        if (!$invoice) {
            return redirect()->back();
        }

        if (Auth::user()->usertype == 'admin') {
            return Inertia::render('Admin/Payment/Details', [
                'invoice' => $invoice,
            ]);
        } else {
            if (Auth::user()->id !== $invoice->user_id) {
                return redirect()->back();
            } elseif (Auth::user()->id === $invoice->user_id) {
                return Inertia::render('Customer/PurchaseOrder/Details', [
                    'invoice' => $invoice,
                ]);
            } else {
                return redirect()->back();
            }
        }
    }
}