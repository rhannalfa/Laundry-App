import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

// --- KOMPONEN PAGINATION CUSTOM (Max 8 + Next/Prev) ---
const Pagination = ({ links = [] }) => {
    // Kalau link kurang dari 3 (cuma Prev, 1, Next), gak usah tampil
    if (links.length <= 3) return null;

    // 1. Ambil tombol Prev & Next (Bawaan Laravel ada di index pertama & terakhir)
    const prev = links[0];
    const next = links[links.length - 1];

    // 2. Ambil hanya link angka (tengah)
    // Buang label 'Previous' dan 'Next' bawaan biar kita bikin tombol sendiri
    const cleanLinks = links.filter(l => !l.label.includes('Previous') && !l.label.includes('Next'));

    // 3. LOGIC BATAS MAKSIMAL 8 ANGKA
    // Kita potong array-nya supaya yang tampil cuma di sekitar halaman aktif
    const activeIndex = cleanLinks.findIndex(l => l.active);

    // Hitung range potong (Start - End)
    // Tampilkan 4 di kiri dan 3 di kanan dari posisi aktif
    let start = Math.max(0, activeIndex - 4);
    let end = Math.min(cleanLinks.length, start + 8);

    // Geser start kalau end sudah mentok
    if (end === cleanLinks.length) {
        start = Math.max(0, end - 8);
    }

    const visibleLinks = cleanLinks.slice(start, end);

    return (
        <div className="flex justify-center flex-wrap gap-1 mt-6">
            {/* Tombol Prev Custom */}
            {prev.url ? (
                <Link href={prev.url} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 text-gray-600 font-medium transition">
                    &laquo; Prev
                </Link>
            ) : (
                <span className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-400 cursor-not-allowed">
                    &laquo; Prev
                </span>
            )}

            {/* Angka Halaman (Dibatasi 8) */}
            {visibleLinks.map((link, i) => (
                <Link
                    key={i}
                    href={link.url || '#'}
                    className={`px-3.5 py-1.5 border rounded-lg text-sm font-bold transition ${
                        link.active
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}

            {/* Tombol Next Custom */}
            {next.url ? (
                <Link href={next.url} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 text-gray-600 font-medium transition">
                    Next &raquo;
                </Link>
            ) : (
                <span className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-400 cursor-not-allowed">
                    Next &raquo;
                </span>
            )}
        </div>
    );
};

export default function TransactionIndex({ auth, transactions }) {

    const handleStatusChange = (id, newStatus) => {
        router.patch(route('transactions.updateStatus', id), {
            status: newStatus
        }, {
            preserveScroll: true,
            onSuccess: () => {}
        });
    };

    const getWhatsAppLink = (trx) => {
        let phone = trx.customer_phone;
        if (!phone) return null;
        if (phone.startsWith('0')) phone = '62' + phone.substring(1);
        const trackingLink = `${window.location.origin}/?invoice=${trx.invoice_code}`;
        const message = `Halo Kak ${trx.customer_name}, cucian kamu dengan status *${trx.status.toUpperCase()}*.%0A%0ACek detailnya disini: ${trackingLink}%0A%0ATerima Kasih!`;
        return `https://wa.me/${phone}?text=${message}`;
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'new': return 'bg-gray-100 text-gray-700';
            case 'process': return 'bg-yellow-100 text-yellow-700';
            case 'ready': return 'bg-brand-100 text-brand-700';
            case 'taken': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Riwayat Transaksi</h2>}
        >
            <Head title="Riwayat Transaksi" />

            <div className="py-6 md:py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-4">

                    {/* Header & Tombol Action */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h3 className="text-lg font-bold text-gray-700">Daftar Pesanan</h3>

                        <div className="flex gap-2 w-full md:w-auto">
                            <a
                                href={route('transactions.export')}
                                target="_blank"
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm text-sm transition"
                            >
                                📊 Excel
                            </a>

                            <Link
                                href={route('pos.create')}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm text-sm transition"
                            >
                                + Baru
                            </Link>
                        </div>
                    </div>

                    {/* --- MOBILE (CARD VIEW) --- */}
                    <div className="md:hidden space-y-4">
                        {transactions.data.map((trx) => (
                            <div key={trx.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                                    trx.payment_status === 'paid' ? 'bg-green-500' : 'bg-red-500'
                                }`}></div>

                                <div className="pl-2">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="text-brand-600 font-mono font-bold text-sm">{trx.invoice_code}</div>
                                            <div className="text-xs text-gray-400">{new Date(trx.created_at).toLocaleDateString()}</div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${
                                            trx.payment_status === 'paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                                        }`}>
                                            {trx.payment_status === 'paid' ? 'LUNAS' : 'BELUM BAYAR'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <div className="font-bold text-gray-800 text-lg">{trx.customer_name}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                📱 {trx.customer_phone || '-'}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-400">Total</div>
                                            <div className="font-extrabold text-gray-800 text-base">Rp {parseInt(trx.total_amount).toLocaleString()}</div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
                                        <div className="flex-1">
                                            <select
                                                value={trx.status}
                                                onChange={(e) => handleStatusChange(trx.id, e.target.value)}
                                                className={`w-full text-xs font-bold rounded-lg border-gray-200 py-2 pl-2 pr-6 focus:ring-brand-500 focus:border-brand-500 transition ${getStatusColor(trx.status)}`}
                                            >
                                                <option value="new">🆕 Baru</option>
                                                <option value="process">🫧 Cuci</option>
                                                <option value="ready">✅ Siap</option>
                                                <option value="taken">👋 Ambil</option>
                                            </select>
                                        </div>

                                        <div className="flex gap-2">
                                            {trx.customer_phone && (
                                                <a href={getWhatsAppLink(trx)} target="_blank" className="bg-white text-green-500 p-2 rounded-lg border border-gray-200 shadow-sm">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                                </a>
                                            )}
                                            <a href={route('transactions.print', trx.id)} target="_blank" className="bg-white text-gray-600 p-2 rounded-lg border border-gray-200 shadow-sm">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                            </a>
                                            {trx.payment_status === 'unpaid' && trx.snap_token && (
                                                <button onClick={() => window.snap.pay(trx.snap_token)} className="bg-brand-600 text-white p-2 rounded-lg shadow-sm">💰</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- DESKTOP (TABLE VIEW) --- */}
                    <div className="hidden md:block bg-white shadow-sm sm:rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Invoice</th>
                                        <th className="px-6 py-4">Pelanggan</th>
                                        <th className="px-6 py-4">Status Cucian</th>
                                        <th className="px-6 py-4">Pembayaran</th>
                                        <th className="px-6 py-4">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {transactions.data.map((trx) => (
                                        <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-mono font-medium text-brand-700">
                                                {trx.invoice_code}
                                                <div className="text-xs text-gray-400 font-sans mt-1">{new Date(trx.created_at).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-800">{trx.customer_name}</div>
                                                <div className="text-xs text-gray-500">{trx.customer_phone || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={trx.status}
                                                    onChange={(e) => handleStatusChange(trx.id, e.target.value)}
                                                    className={`text-xs font-bold rounded-full py-1 pl-3 pr-8 border-0 cursor-pointer focus:ring-2 focus:ring-brand-500 ${getStatusColor(trx.status)}`}
                                                >
                                                    <option value="new">🆕 Baru Masuk</option>
                                                    <option value="process">🫧 Sedang Dicuci</option>
                                                    <option value="ready">✅ Siap Diambil</option>
                                                    <option value="taken">👋 Sudah Diambil</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                    trx.payment_status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                    {trx.payment_status === 'paid' ? 'LUNAS' : 'BELUM BAYAR'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex items-center gap-2">
                                                {trx.customer_phone && (
                                                    <a href={getWhatsAppLink(trx)} target="_blank" className="text-green-500 hover:text-green-700 p-2 rounded-full hover:bg-green-50 transition">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                                    </a>
                                                )}
                                                <a href={route('transactions.print', trx.id)} target="_blank" className="text-gray-500 hover:text-brand-600 p-2 rounded-full hover:bg-brand-50 transition">
                                                    🖨
                                                </a>
                                                {trx.payment_status === 'unpaid' && trx.snap_token && (
                                                    <button onClick={() => window.snap.pay(trx.snap_token)} className="text-xs bg-brand-600 text-white px-3 py-1.5 rounded-lg hover:bg-brand-700 shadow-sm">Bayar</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* --- PAGINATION (DIGUNAKAN BERSAMA) --- */}
                    <Pagination links={transactions.links} />

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
