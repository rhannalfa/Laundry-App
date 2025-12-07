<?php

namespace App\Exports;

use App\Models\Transaction;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class TransactionExport implements FromView, ShouldAutoSize, WithStyles
{
    public function view(): View
    {
        // Ambil semua transaksi (Urutkan dari yang terbaru)
        // Kita load juga detail items-nya biar lengkap
        $transactions = Transaction::with('details.service')->latest()->get();

        return view('exports.transactions', [
            'transactions' => $transactions,
            'total_income' => $transactions->where('payment_status', 'paid')->sum('total_amount')
        ]);
    }

    // FUNGSI STYLING BIAR KEREN (Mirip CSS tapi buat Excel)
    public function styles(Worksheet $sheet)
    {
        return [
            // Baris 1 (Judul): Font Besar, Bold
            1 => ['font' => ['bold' => true, 'size' => 16]],

            // Baris 3 (Header Tabel): Background Teal, Text Putih, Bold
            3 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '14b8a6'] // Warna Brand-500 kita
                ],
            ],
        ];
    }
}
