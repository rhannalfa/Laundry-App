<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;
use App\Exports\TransactionExport;
use Maatwebsite\Excel\Facades\Excel;

class TransactionController extends Controller
{
    public function create()
    {
        $services = Service::where('is_active', true)->get();

        return Inertia::render('Pos/Create', [
            'services' => $services
        ]);
    }

public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'rack_location' => 'nullable|string|max:10',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:services,id',
            'items.*.qty' => 'required|numeric|min:1',
            'payment_choice' => 'required|in:cash,cashless,later'
        ]);

        try {
            DB::beginTransaction();

            $totalAmount = 0;
            $transactionDetails = [];
            $itemDetailsMidtrans = [];

            foreach ($request->items as $item) {
                $service = Service::find($item['id']);
                $subtotal = $service->price * $item['qty'];
                $totalAmount += $subtotal;

                $transactionDetails[] = [
                    'service_id' => $service->id,
                    'qty' => $item['qty'],
                    'price_per_unit' => $service->price,
                    'subtotal' => $subtotal,
                ];

                $itemDetailsMidtrans[] = [
                    'id' => $service->id,
                    'price' => (int) $service->price,
                    'quantity' => $item['qty'],
                    'name' => substr($service->name, 0, 50),
                ];
            }

            $invoiceCode = 'INV-' . date('Ymd') . '-' . strtoupper(Str::random(4));

            $initialPaymentStatus = 'unpaid';
            $initialPaymentMethod = null;
            $snapToken = null;

            if ($request->payment_choice === 'cash') {
                $initialPaymentStatus = 'paid';
                $initialPaymentMethod = 'cash';
            } elseif ($request->payment_choice === 'cashless') {
                $initialPaymentMethod = 'midtrans';
            }

            $transaction = Transaction::create([
                'invoice_code' => $invoiceCode,
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'rack_location' => $request->rack_location,
                'total_amount' => $totalAmount,
                'status' => 'new',
                'payment_status' => $initialPaymentStatus,
                'payment_method' => $initialPaymentMethod
            ]);

            foreach ($transactionDetails as $detail) {
                $transaction->details()->create($detail);
            }

            if ($request->payment_choice === 'cashless') {
                Config::$serverKey = config('services.midtrans.server_key');
                Config::$isProduction = config('services.midtrans.is_production');
                Config::$isSanitized = true;
                Config::$is3ds = true;

                $midtransParams = [
                    'transaction_details' => [
                        'order_id' => $invoiceCode,
                        'gross_amount' => (int) $totalAmount,
                    ],
                    'customer_details' => [
                        'first_name' => $request->customer_name,
                        'phone' => $request->customer_phone,
                    ],
                    'item_details' => $itemDetailsMidtrans,
                ];

                $snapToken = Snap::getSnapToken($midtransParams);
                $transaction->update(['snap_token' => $snapToken]);
            }

            DB::commit();

            return redirect()->back()->with('success', [
                'message' => 'Transaksi berhasil dibuat!',
                'transaction' => $transaction,
                'snap_token' => $snapToken,
                'payment_choice' => $request->payment_choice
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal memproses: ' . $e->getMessage()]);
        }
    }
    public function index()
    {
        $transactions = Transaction::latest()->paginate(10);

        return Inertia::render('Pos/Index', [
            'transactions' => $transactions
        ]);
    }

    public function callback(Request $request)
    {
        $serverKey = config('services.midtrans.server_key');

        $hashed = hash("sha512", $request->order_id . $request->status_code . $request->gross_amount . $serverKey);

        if ($hashed !== $request->signature_key) {
            return response()->json(['message' => 'Invalid Signature'], 403);
        }

        $transaction = Transaction::where('invoice_code', $request->order_id)->first();

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        $status = $request->transaction_status;
        $type = $request->payment_type;
        $fraud = $request->fraud_status;

        if ($status == 'capture') {
            if ($type == 'credit_card') {
                $transaction->update(['payment_status' => $fraud == 'challenge' ? 'unpaid' : 'paid']);
            }
        } elseif ($status == 'settlement') {
            $transaction->update(['payment_status' => 'paid']);
        } elseif ($status == 'pending') {
            $transaction->update(['payment_status' => 'unpaid']);
        } elseif ($status == 'deny' || $status == 'expire' || $status == 'cancel') {
            $transaction->update(['payment_status' => 'failed']);
        }

        return response()->json(['message' => 'Callback received']);
    }

    public function print(Transaction $transaction)
    {
        $transaction->load('details.service');

        return Inertia::render('Pos/Print', [
            'transaction' => $transaction,
            'user' => auth()->user() // Biar bisa tampilkan nama kasir
        ]);
    }

    public function track(Request $request)
    {
        $transaction = null;

        if ($request->has('invoice')) {
            $transaction = Transaction::with('details.service')
                ->where('invoice_code', $request->invoice)
                ->first();
        }

        return Inertia::render('Front/Track', [
            'transaction' => $transaction,
            'searchQuery' => $request->invoice
        ]);
    }

    public function updateStatus(Request $request, Transaction $transaction)
    {
        $request->validate([
            'status' => 'required|in:new,process,ready,taken'
        ]);

        $transaction->update(['status' => $request->status]);

        return back()->with('success', 'Status cucian berhasil diperbarui!');
    }

    public function export()
    {
        return Excel::download(new TransactionExport, 'laporan_laundry_'.date('Y-m-d').'.xlsx');
    }
}
