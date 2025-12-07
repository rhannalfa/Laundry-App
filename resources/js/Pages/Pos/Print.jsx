import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Print({ transaction, user }) {

    // Otomatis munculkan dialog print saat halaman dibuka
    useEffect(() => {
        window.print();
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen flex justify-center items-start pt-10 text-xs font-mono">
            <Head title={`Struk #${transaction.invoice_code}`} />

            {/* Kertas Struk */}
            <div className="bg-white p-4 w-[300px] shadow-lg mb-10">

                {/* Header Toko */}
                <div className="text-center mb-4 border-b border-dashed pb-2">
                    <h1 className="text-xl font-bold uppercase">LAUNDRY APP</h1>
                    <p>Jl. Cileunyi Raya No. 123</p>
                    <p>WA: 0812-3456-7890</p>
                </div>

                {/* Info Transaksi */}
                <div className="mb-4 space-y-1">
                    <div className="flex justify-between">
                        <span>No. Nota:</span>
                        <span className="font-bold">{transaction.invoice_code}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tanggal:</span>
                        <span>{new Date(transaction.created_at).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Kasir:</span>
                        <span>{user.name.substring(0, 15)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Pelanggan:</span>
                        <span className="font-bold">{transaction.customer_name}</span>
                    </div>
                </div>

                {/* Tabel Item */}
                <div className="border-t border-b border-dashed py-2 mb-4">
                    {transaction.details.map((item, index) => (
                        <div key={index} className="mb-2">
                            <div className="font-bold">{item.service.name}</div>
                            <div className="flex justify-between">
                                <span>{item.qty} {item.service.unit} x {parseInt(item.price_per_unit).toLocaleString()}</span>
                                <span>{parseInt(item.subtotal).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-lg font-bold">
                        <span>TOTAL:</span>
                        <span>Rp {parseInt(transaction.total_amount).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Status Bayar:</span>
                        <span className={transaction.payment_status === 'paid' ? 'font-bold' : ''}>
                            {transaction.payment_status.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center border-t border-dashed pt-4 space-y-2">
                    <p>Terima Kasih!</p>
                    <p className="text-[10px]">Barang yang tidak diambil &gt;30 hari bukan tanggung jawab kami.</p>

                    {/* QR Code (Opsional: Nanti bisa pakai library QR) */}
                    <div className="mt-4 flex justify-center">
                        <div className="border p-2">
                            <p className="text-[10px] text-center">SCAN STATUS</p>
                            {/* Tempat QR Code */}
                        </div>
                    </div>
                </div>

                {/* Tombol Print (Hanya muncul di layar, hilang saat diprint) */}
                <button
                    onClick={() => window.print()}
                    className="w-full mt-6 bg-gray-800 text-white py-2 rounded print:hidden hover:bg-black"
                >
                    Print Struk
                </button>

                <button
                    onClick={() => window.history.back()}
                    className="w-full mt-2 text-gray-500 py-2 text-[10px] print:hidden hover:underline"
                >
                    &larr; Kembali
                </button>
            </div>

            {/* CSS Khusus Print agar background hilang & margin pas */}
            <style>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    body { background: white; }
                    .print\\:hidden { display: none; }
                    .shadow-lg { box-shadow: none; }
                }
            `}</style>
        </div>
    );
}
