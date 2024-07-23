<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Payment;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $validate = $request->validate([
            'invoice_id' => 'required',
            'file' => 'required|mimes:png,jpg,jpeg,pdf|max:4096',
        ]);

        if($validate) {
            $file = $request->file('file');
            $invoiceId = $request->input('invoice_id');
            $customerId = Auth::user()->id;
            $fileName = $file->getClientOriginalName();
            $fileNameRandom = date('YmdHis') . '_' . $file->hashName();
            $description = $request->input('description');

            $result = [
                'invoice_id' => $invoiceId,
                'user_id' => $customerId,
                'filename' => $fileName,
                'filename_random' => $fileNameRandom,
                'description' => $description,
            ];
            try {
                Payment::create($result);
                Storage::disk('public')->put($fileNameRandom, file_get_contents($file));
                return back()->with('success', 'File has been successfully uploaded');
            } catch (Exception $ex) {
                echo $ex->getMessage();
            }
        }
    }

    public function index()
    {
        $invoices = Invoice::paginate(10);
        return Inertia::render('Admin/Payment/Payment', [
            'invoices' => $invoices,
        ]);
    }

    public function previewFile($id)
    {
        $paymentId = $id;
        $payment = Payment::find($paymentId);
        if(!$payment) {
            abort(403);
        }

        $filePath = storage_path('app/public/' . $payment->filename_random);
        $filename = $payment->filename;

        if($filePath) {
            // return response()->file($filePath);
            return response()->download($filePath, $filename);
        }
        return redirect()->back();
    }

    public function confirmPayment(Request $request)
    {
        $request->validate([
            'invoice_id' => 'required',
            'paid_amount' => 'required|gt:0',
        ]);

        $invoiceId = $request->input('invoice_id');
        $clearedNumber = (int)$request->input('paid_amount');
        $invoice = Invoice::find($invoiceId);

        if($invoice) {
            $alreadyPaid = (int)$invoice->paid_amount;
            $billed = (int)$invoice->amount;
            $newPayment = $clearedNumber;
            $totalPaidAmount = $alreadyPaid + $newPayment;

            $invoice->paid_amount = $totalPaidAmount;
            if($totalPaidAmount >= $billed) {
                $invoice->status = "P";
                $invoice->paid_date = date('Y-m-d H:i:s');
            }
            $invoice->save();
        }
        return redirect()->back();
    }

    public function delete(Request $request)
    {
        $paymentId = $request->input('payment_id');
        $payment = Payment::find($paymentId);
        $disk = 'public';

        if($payment) {
            $filePath = $payment->filename_random;
            try {
                if(Storage::disk($disk)->exists($filePath)) {
                    Storage::disk($disk)->delete($filePath);
                    $payment->delete();
                }
                return redirect()->back();
            } catch (Exception $ex) {
                echo $ex->getMessage();
            }
        }
        return redirect()->back();
    }

    public function reset(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $invoiceId = $request->input('invoice_id');
        $invoice = Invoice::find($invoiceId);

        if($invoice) {
            $invoice->paid_amount = 0;
            $invoice->paid_date = null;
            $invoice->status = "B";
            $invoice->save();
        }
        return redirect()->back();
    }
}