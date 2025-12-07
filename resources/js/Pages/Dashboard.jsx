import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, stats, recent }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Owner</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-6 md:py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-4">

                    {/* BAGIAN 1: KARTU STATISTIK (Sudah Responsif) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">

                        {/* Card 1: Pemasukan */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">Pemasukan Hari Ini</p>
                                <p className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2">
                                    Rp {parseInt(stats.income).toLocaleString('id-ID')}
                                </p>
                                <p className="text-[10px] text-brand-600 font-medium mt-1 bg-brand-50 inline-block px-2 py-1 rounded-full">
                                    Paid Only
                                </p>
                            </div>
                            <div className="p-3 md:p-4 bg-brand-50 text-brand-600 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Card 2: Proses */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">Sedang Dicuci</p>
                                <p className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2">
                                    {stats.active} <span className="text-lg font-medium text-gray-400">Nota</span>
                                </p>
                                <p className="text-[10px] text-yellow-600 font-medium mt-1 bg-yellow-50 inline-block px-2 py-1 rounded-full">
                                    Perlu Perhatian
                                </p>
                            </div>
                            <div className="p-3 md:p-4 bg-yellow-50 text-yellow-600 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                        </div>

                        {/* Card 3: Bulanan */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">Transaksi Bulan Ini</p>
                                <p className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2">
                                    {stats.count} <span className="text-lg font-medium text-gray-400">Trx</span>
                                </p>
                                <p className="text-[10px] text-blue-600 font-medium mt-1 bg-blue-50 inline-block px-2 py-1 rounded-full">
                                    Terus Tingkatkan
                                </p>
                            </div>
                            <div className="p-3 md:p-4 bg-blue-50 text-blue-600 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* BAGIAN 2: DAFTAR TRANSAKSI TERBARU */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                        <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-base md:text-lg font-bold text-gray-800">Transaksi Terbaru</h3>
                                <p className="text-xs md:text-sm text-gray-500">5 transaksi terakhir yang masuk.</p>
                            </div>
                            <Link href={route('transactions.index')} className="text-xs md:text-sm font-semibold text-brand-600 hover:text-brand-800 hover:underline">
                                Lihat Semua &rarr;
                            </Link>
                        </div>

                        {/* --- TAMPILAN MOBILE (LIST CARD) --- */}
                        <div className="block md:hidden p-4 space-y-3">
                            {recent.length === 0 ? (
                                <p className="text-center text-gray-400 text-sm py-4">Belum ada data.</p>
                            ) : (
                                recent.map((trx) => (
                                    <div key={trx.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-brand-600 font-mono font-bold text-sm">{trx.invoice_code}</div>
                                                <div className="font-bold text-gray-800 text-base">{trx.customer_name}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-extrabold text-gray-800">Rp {parseInt(trx.total_amount).toLocaleString()}</div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-1 pt-2 border-t border-gray-50">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                trx.status === 'ready' ? 'bg-green-50 text-green-700' :
                                                trx.status === 'taken' ? 'bg-blue-50 text-blue-700' :
                                                'bg-yellow-50 text-yellow-700'
                                            }`}>
                                                {trx.status}
                                            </span>
                                            <span className="text-[10px] text-gray-400">
                                                {new Date(trx.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* --- TAMPILAN DESKTOP (TABEL) --- */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Invoice</th>
                                        <th className="px-6 py-4">Pelanggan</th>
                                        <th className="px-6 py-4">Status Cucian</th>
                                        <th className="px-6 py-4 text-right">Total Tagihan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recent.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-400 italic">Belum ada data transaksi.</td>
                                        </tr>
                                    ) : (
                                        recent.map((trx) => (
                                            <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-mono font-medium text-brand-700">{trx.invoice_code}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-gray-800">{trx.customer_name}</div>
                                                    <div className="text-xs text-gray-400">{new Date(trx.created_at).toLocaleDateString()}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                                                        trx.status === 'ready' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                        trx.status === 'taken' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                        'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                                    }`}>
                                                        {trx.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-gray-700">
                                                    Rp {parseInt(trx.total_amount).toLocaleString('id-ID')}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
