<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\ServiceController; // <--- PENTING: Jangan lupa ini!
use App\Models\Transaction;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Halaman Depan (Publik)
|--------------------------------------------------------------------------
*/

// Halaman Tracking sebagai halaman utama (Tanpa Login)
Route::get('/', [TransactionController::class, 'track'])->name('front.track');

// Callback Midtrans (Wajib di luar Auth)
Route::post('/midtrans-callback', [TransactionController::class, 'callback']);


/*
|--------------------------------------------------------------------------
| Halaman Dashboard (Perlu Login)
|--------------------------------------------------------------------------
*/
Route::get('/dashboard', function () {
    // 1. Hitung Pendapatan Hari Ini (Paid only)
    $todayIncome = Transaction::whereDate('created_at', today())
        ->where('payment_status', 'paid')
        ->sum('total_amount');

    // 2. Hitung Cucian Sedang Proses
    $activeProcess = Transaction::whereIn('status', ['new', 'process'])->count();

    // 3. Total Transaksi Bulan Ini
    $monthCount = Transaction::whereMonth('created_at', now()->month)
        ->whereYear('created_at', now()->year)
        ->count();

    // 4. 5 Transaksi Terakhir
    $recent = Transaction::latest()->limit(5)->get();

    return Inertia::render('Dashboard', [
        'stats' => [
            'income' => $todayIncome,
            'active' => $activeProcess,
            'count' => $monthCount
        ],
        'recent' => $recent
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');


/*
|--------------------------------------------------------------------------
| Group Route Terproteksi (Admin/Kasir)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    // Feature: Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Feature: POS & Transaksi
    Route::get('/pos', [TransactionController::class, 'create'])->name('pos.create');
    Route::post('/pos', [TransactionController::class, 'store'])->name('pos.store');
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('/transactions/{transaction}/print', [TransactionController::class, 'print'])->name('transactions.print');
    Route::patch('/transactions/{transaction}/status', [TransactionController::class, 'updateStatus'])->name('transactions.updateStatus');
    Route::get('/transactions/export', [TransactionController::class, 'export'])->name('transactions.export');

    // Feature: Master Data Layanan (CRUD)
    // PENTING: Ini harus di dalam auth supaya aman!
    Route::resource('services', ServiceController::class);
});

require __DIR__.'/auth.php';
