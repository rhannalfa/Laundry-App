import { Head, useForm, Link } from '@inertiajs/react';

export default function Track({ transaction, searchQuery }) {
    const { data, setData, get, processing } = useForm({
        invoice: searchQuery || '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('front.track'));
    };

    const getStatusStep = (currentStatus) => {
        const steps = ['new', 'process', 'ready', 'taken'];
        return steps.indexOf(currentStatus);
    };

    const currentStep = transaction ? getStatusStep(transaction.status) : -1;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-10 px-4 font-sans">
            <Head title="Cek Status Laundry" />

            {/* Logo / Brand di Atas */}
            <div className="mb-6 text-center animate-fade-in-down">
                <div className="bg-brand-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-brand-200 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">LAUNDRY HAN</h1>
                <p className="text-gray-500 text-sm">Cek status cucianmu secara real-time</p>
            </div>

            {/* KARTU UTAMA */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">

                {/* Dekorasi Background Atas */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-brand-600"></div>

                <div className="p-8">
                    {/* Form Pencarian */}
                    <form onSubmit={handleSearch} className="relative mb-8">
                        <input
                            type="text"
                            placeholder="(Contoh: INV-2025...)"
                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl pl-4 pr-12 py-3.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all shadow-sm placeholder-gray-400 uppercase font-medium tracking-wide"
                            value={data.invoice}
                            onChange={e => setData('invoice', e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={processing}
                            className="absolute right-2 top-2 bottom-2 bg-brand-600 text-white px-4 rounded-lg hover:bg-brand-700 transition shadow-md flex items-center justify-center"
                        >
                            {processing ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span> : '🔍'}
                        </button>
                    </form>

                    {/* HASIL PENCARIAN */}
                    {transaction ? (
                        <div className="animate-fade-in-up">
                            {/* Header Status */}
                            <div className="text-center mb-8 pb-6 border-b border-dashed border-gray-200">
                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status Pesanan</h2>
                                <div className={`text-2xl font-extrabold uppercase tracking-tight ${
                                    transaction.status === 'taken' ? 'text-green-600' :
                                    transaction.status === 'ready' ? 'text-brand-600' : 'text-brand-600'
                                }`}>
                                    {transaction.status === 'new' && 'Menunggu Dicuci'}
                                    {transaction.status === 'process' && 'Sedang Dicuci'}
                                    {transaction.status === 'ready' && 'Siap Diambil'}
                                    {transaction.status === 'taken' && 'Sudah Diambil'}
                                </div>
                                <p className="text-sm font-medium text-gray-500 mt-2">
                                    Halo, <span className="text-gray-800">{transaction.customer_name}</span> 👋
                                </p>
                            </div>

                            {/* TIMELINE VISUAL */}
                            <div className="relative pl-4 space-y-8 ml-2">
                                {/* Garis Vertikal */}
                                <div className="absolute left-[11px] top-2 bottom-4 w-0.5 bg-gray-100"></div>

                                {/* Step 1: Diterima */}
                                <TimelineItem
                                    active={currentStep >= 0}
                                    completed={currentStep > 0}
                                    title="Pesanan Diterima"
                                    desc="Cucian telah masuk antrian."
                                />

                                {/* Step 2: Dicuci */}
                                <TimelineItem
                                    active={currentStep >= 1}
                                    completed={currentStep > 1}
                                    title="Sedang Dicuci"
                                    desc="Pakaian sedang diproses mesin."
                                />

                                {/* Step 3: Selesai */}
                                <TimelineItem
                                    active={currentStep >= 2}
                                    completed={currentStep > 2}
                                    title="Siap Diambil"
                                    desc="Sudah wangi & rapi. Silakan ambil."
                                />

                                {/* Step 4: Diambil */}
                                <TimelineItem
                                    active={currentStep >= 3}
                                    completed={currentStep >= 3}
                                    title="Sudah Diambil"
                                    desc="Terima kasih telah menggunakan jasa kami."
                                    isLast={true}
                                />
                            </div>

                            {/* Detail Item (Accordion Simple) */}
                            <div className="mt-8 bg-brand-50/50 p-5 rounded-xl border border-brand-100/50">
                                <h3 className="font-bold text-gray-700 text-sm mb-3 flex items-center gap-2">
                                    <span>🧾</span> Rincian Pesanan
                                </h3>
                                <div className="space-y-2">
                                    {transaction.details.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm text-gray-600">
                                            <span>{item.qty} {item.service.unit} x {item.service.name}</span>
                                            <span className="font-medium">Rp {parseInt(item.subtotal).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between font-bold text-gray-800 mt-3 pt-3 border-t border-brand-200/50 text-base">
                                    <span>Total Tagihan</span>
                                    <span>Rp {parseInt(transaction.total_amount).toLocaleString()}</span>
                                </div>
                                <div className="text-center mt-3">
                                    <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide ${
                                        transaction.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        Status Bayar: {transaction.payment_status === 'paid' ? 'LUNAS' : 'BELUM BAYAR'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : searchQuery ? (
                        <div className="py-10 text-center animate-fade-in">
                            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 text-2xl">
                                ❌
                            </div>
                            <h3 className="text-gray-800 font-bold mb-1">Data Tidak Ditemukan</h3>
                            <p className="text-sm text-gray-500 px-6">Kode Invoice <b>"{searchQuery}"</b> tidak terdaftar di sistem kami.</p>
                            <button onClick={() => window.location.href='/'} className="mt-4 text-brand-600 text-sm font-bold hover:underline">Coba Lagi</button>
                        </div>
                    ) : (
                        <div className="py-8 text-center text-gray-400">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl grayscale opacity-50">
                                👋
                            </div>
                            <p className="text-sm font-medium">Selamat Datang!</p>
                            <p className="text-xs mt-1">Masukkan kode invoice yang tertera di struk.</p>
                        </div>
                    )}
                </div>

                {/* Footer Login Link */}
                <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                    <Link href="/login" className="text-xs font-bold text-gray-400 hover:text-brand-600 transition flex items-center justify-center gap-1">
                        🔒 Login Karyawan
                    </Link>
                </div>
            </div>

            <p className="mt-8 text-gray-400 text-xs">
                &copy; {new Date().getFullYear()} Laundry Han System
            </p>
        </div>
    );
}

// Komponen Timeline Item
function TimelineItem({ active, completed, title, desc, isLast }) {
    return (
        <div className="relative flex gap-4 pb-8 last:pb-0">
            {/* Dot Lingkaran */}
            <div className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white transition-all duration-500 ${
                active
                ? (completed ? 'border-brand-500 bg-brand-500 text-white' : 'border-brand-500 bg-white')
                : 'border-gray-300'
            }`}>
                {/* Kalau completed (sudah lewat), tampilkan Checkmark */}
                {completed && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                )}

                {/* Kalau active tapi belum lewat (step saat ini), tampilkan Dot ditengah */}
                {!completed && active && (
                    <div className="w-2.5 h-2.5 bg-brand-500 rounded-full animate-pulse"></div>
                )}
            </div>

            <div className={`transition-all duration-500 ${active ? 'opacity-100 translate-x-0' : 'opacity-50 translate-x-1'}`}>
                <h4 className={`text-sm font-bold ${active ? 'text-gray-800' : 'text-gray-400'}`}>{title}</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
