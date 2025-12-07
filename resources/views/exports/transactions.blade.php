<table>
    <thead>
    <tr>
        <th colspan="6" style="text-align: center; font-size: 16px; font-weight: bold; height: 30px; vertical-align: middle;">
            LAPORAN KEUANGAN - LAUNDRY HAN
        </th>
    </tr>
    <tr>
        <td colspan="6" style="text-align: center; color: #666666;">
            Generated Date: {{ date('d M Y H:i') }}
        </td>
    </tr>

    <tr>
        <th style="text-align: center; font-weight: bold; border: 1px solid #000000; background-color: #14b8a6; color: #ffffff;">INVOICE</th>
        <th style="text-align: center; font-weight: bold; border: 1px solid #000000; background-color: #14b8a6; color: #ffffff;">TANGGAL</th>
        <th style="text-align: center; font-weight: bold; border: 1px solid #000000; background-color: #14b8a6; color: #ffffff;">PELANGGAN</th>
        <th style="text-align: center; font-weight: bold; border: 1px solid #000000; background-color: #14b8a6; color: #ffffff;">STATUS</th>
        <th style="text-align: center; font-weight: bold; border: 1px solid #000000; background-color: #14b8a6; color: #ffffff;">PEMBAYARAN</th>
        <th style="text-align: center; font-weight: bold; border: 1px solid #000000; background-color: #14b8a6; color: #ffffff;">TOTAL (RP)</th>
    </tr>
    </thead>

    <tbody>
    @foreach($transactions as $trx)
        <tr>
            <td style="text-align: center; border: 1px solid #e5e7eb;">{{ $trx->invoice_code }}</td>
            <td style="text-align: center; border: 1px solid #e5e7eb;">{{ $trx->created_at->format('d M Y') }}</td>
            <td style="border: 1px solid #e5e7eb;">{{ $trx->customer_name }}</td>
            <td style="text-align: center; border: 1px solid #e5e7eb;">{{ strtoupper($trx->status) }}</td>
            <td style="text-align: center; border: 1px solid #e5e7eb; color: {{ $trx->payment_status == 'paid' ? '#16a34a' : '#dc2626' }};">
                <b>{{ strtoupper($trx->payment_status) }}</b>
            </td>
            <td style="text-align: right; border: 1px solid #e5e7eb;">{{ $trx->total_amount }}</td>
        </tr>
    @endforeach

    <tr>
        <td colspan="5" style="text-align: right; font-weight: bold; border-top: 2px solid #000000;">TOTAL PEMASUKAN (PAID ONLY):</td>
        <td style="text-align: right; font-weight: bold; background-color: #f0fdfa; border-top: 2px solid #000000;">{{ $total_income }}</td>
    </tr>
    </tbody>
</table>
