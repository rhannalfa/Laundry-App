import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react'; // Pastikan import router ada
import { useState } from 'react';

export default function PosCreate({ auth, services }) {
    const [cart, setCart] = useState([]);

    // Kita tidak perlu menyimpan payment_choice di useForm state lagi
    // karena akan dikirim langsung sebagai argumen fungsi
    const { data, setData, post, processing, errors, reset } = useForm({
        customer_name: '',
        customer_phone: '',
        rack_location: '',
        items: [],
        // payment_choice dihapus dari sini, dikirim manual nanti
    });

    // --- Logic cart (Tetap sama) ---
    const addToCart = (service) => {
        const existingItem = cart.find(item => item.id === service.id);
        if (existingItem) {
            setCart(cart.map(item => item.id === service.id ? { ...item, qty: item.qty + 1 } : item));
        } else {
            setCart([...cart, { ...service, qty: 1 }]);
        }
    };

    const updateQty = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = item.qty + delta;
                return newQty > 0 ? { ...item, qty: newQty } : null;
            }
            return item;
        }).filter(Boolean));
    };

    const grandTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    // --- FUNGSI SUBMIT LANGSUNG ---
    // Fungsi ini dipanggil saat tombol pembayaran diklik
    const handlePayment = (choice) => {

        // 1. Validasi Frontend
        if (cart.length === 0) {
            alert("Keranjang masih kosong!");
            return;
        }
        if (!data.customer_name) {
            alert("Nama Pelanggan Wajib Diisi!");
            return;
        }

        // 2. Siapkan Data yang akan dikirim
        // Kita gabungkan data dari form (nama, hp) dan data dari cart
        const submitData = {
            ...data, // data form (nama, hp, rak)
            items: cart.map(item => ({ id: item.id, qty: item.qty })),
            payment_choice: choice // Pilihan pembayaran yang diklik
        };

        // 3. Kirim ke Backend menggunakan router.post (bukan post dari useForm)
        // router.post lebih fleksibel untuk mengirim data custom
        router.post(route('pos.store'), submitData, {
            onSuccess: (page) => {
                const flash = page.props.flash || {};
                const successData = flash.success || {};

                // Cek jika response sukses
                if (!successData || typeof successData === 'string') {
                     // Fallback jika backend kirim string biasa
                    if(successData) alert(successData);
                    setCart([]);
                    reset();
                    return;
                }

                const paymentChoice = successData.payment_choice;
                const snapToken = successData.snap_token;

                // --- LOGIKA SETELAH SUKSES ---

                // 1. Jika Cashless -> LANGSUNG MUNCULKAN POPUP MIDTRANS
                if (paymentChoice === 'cashless' && snapToken) {
                    window.snap.pay(snapToken, {
                        onSuccess: function(result){
                            alert("Pembayaran Berhasil!");
                            router.visit(route('transactions.index')); // Redirect ke Riwayat
                        },
                        onPending: function(result){
                            alert("Menunggu pembayaran...");
                            router.visit(route('transactions.index')); // Redirect ke Riwayat
                        },
                        onError: function(result){
                            alert("Pembayaran gagal!");
                        },
                        onClose: function(){
                            if(confirm("Anda menutup popup. Lanjutkan ke riwayat transaksi?")) {
                                router.visit(route('transactions.index'));
                            }
                        }
                    });
                }
                // 2. Jika Tunai
                else if (paymentChoice === 'cash') {
                    alert('✅ Transaksi BERHASIL! \nPembayaran TUNAI diterima.');
                    router.visit(route('transactions.index'));
                }
                // 3. Jika Nanti
                else {
                    alert('📦 Transaksi Disimpan (Belum Bayar).');
                    router.visit(route('transactions.index'));
                }
            },
            onError: (errors) => {
                // Tampilkan error validasi pertama jika ada
                const firstError = Object.values(errors)[0];
                alert("Gagal Menyimpan: " + firstError);
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<div className="flex items-center gap-2 text-brand-700"><span className="text-2xl">🛍️</span><h2 className="font-bold text-xl leading-tight">Kasir Baru</h2></div>}
        >
            <Head title="Kasir Baru" />

            <div className="py-8 px-4 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 min-h-screen bg-gray-50">

                {/* KIRI: DAFTAR MENU */}
                <div className="w-full lg:w-2/3">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-700">Pilih Layanan</h3>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Total: {services.length} Layanan</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                        {services.map((service) => (
                            <div key={service.id}
                                 onClick={() => addToCart(service)}
                                 className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:border-brand-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute -right-6 -top-6 w-16 h-16 bg-brand-50 rounded-full group-hover:bg-brand-100 transition-colors"></div>
                                <div className="relative z-10">
                                    <h3 className="font-bold text-gray-800 text-lg leading-snug mb-1 group-hover:text-brand-600 transition-colors">{service.name}</h3>
                                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-4"><span>🕒</span> {service.estimate_hours} Jam</div>
                                    <div className="flex items-end justify-between">
                                        <div className="font-extrabold text-xl text-brand-600">{parseInt(service.price).toLocaleString('id-ID')}</div>
                                        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">/{service.unit}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* KANAN: KERANJANG (STICKY) */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-6">
                        <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-4 mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Keranjang</h3>
                            <span className="text-xs font-medium bg-brand-100 text-brand-700 px-2 py-1 rounded-full">{cart.length} Item</span>
                        </div>

                        {/* List Item */}
                        {cart.length === 0 ? (
                            <div className="py-10 text-center flex flex-col items-center text-gray-400">
                                <span className="text-4xl mb-2">🛒</span>
                                <p className="text-sm">Belum ada layanan dipilih.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <div>
                                            <div className="font-bold text-gray-800 text-sm">{item.name}</div>
                                            <div className="text-xs text-brand-600 font-medium">Rp {parseInt(item.price).toLocaleString()}</div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border shadow-sm">
                                            <button onClick={() => updateQty(item.id, -1)} className="text-gray-400 hover:text-red-500 font-bold px-1 transition">-</button>
                                            <span className="font-bold text-sm min-w-[1.5rem] text-center">{item.qty}</span>
                                            <button onClick={() => updateQty(item.id, 1)} className="text-brand-600 hover:text-brand-800 font-bold px-1 transition">+</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Total & Form */}
                        <div className="border-t border-gray-100 pt-4 space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-gray-500 font-medium">Total Tagihan</span>
                                <span className="text-2xl font-extrabold text-gray-800">Rp {grandTotal.toLocaleString('id-ID')}</span>
                            </div>

                            {/* Form Input Pelanggan (Tanpa tag <form>) */}
                            <div className="space-y-3">
                                <div>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border-gray-200 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500 transition-colors"
                                        value={data.customer_name}
                                        onChange={e => setData('customer_name', e.target.value)}
                                        placeholder="Nama Pelanggan (Wajib)"
                                    />
                                    {/* Error handling */}
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border-gray-200 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500"
                                        value={data.customer_phone}
                                        onChange={e => setData('customer_phone', e.target.value)}
                                        placeholder="No. WA (Opsional)"
                                    />
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border-gray-200 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500"
                                        value={data.rack_location}
                                        onChange={e => setData('rack_location', e.target.value)}
                                        placeholder="Rak (Contoh: A1)"
                                    />
                                </div>

                                {/* --- TOMBOL PILIHAN PEMBAYARAN LANGSUNG --- */}
                                <div className="py-2">
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Pilih Bayar & Proses</label>
                                    <div className="grid grid-cols-3 gap-2">

                                        {/* Tombol 1: Tunai */}
                                        <button
                                            onClick={() => handlePayment('cash')}
                                            // Jangan disable saat processing agar user tau tombolnya diklik,
                                            // tapi logic handlePayment bisa ditambah pencegah double click jika mau.
                                            className="cursor-pointer bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-700 rounded-xl p-2 text-center text-xs font-bold transition flex flex-col items-center justify-center gap-1 h-20 active:scale-95 shadow-sm"
                                        >
                                            <span className="text-xl">💵</span>
                                            Tunai
                                        </button>

                                        {/* Tombol 2: Cashless (Midtrans) - KLIK LANGSUNG POPUP */}
                                        <button
                                            onClick={() => handlePayment('cashless')}
                                            className="cursor-pointer bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl p-2 text-center text-xs font-bold transition flex flex-col items-center justify-center gap-1 h-20 active:scale-95 shadow-sm"
                                        >
                                            <span className="text-xl">💳</span>
                                            QRIS / E-Wallet
                                        </button>

                                        {/* Tombol 3: Nanti */}
                                        <button
                                            onClick={() => handlePayment('later')}
                                            className="cursor-pointer bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-700 rounded-xl p-2 text-center text-xs font-bold transition flex flex-col items-center justify-center gap-1 h-20 active:scale-95 shadow-sm"
                                        >
                                            <span className="text-xl">⏳</span>
                                            Bayar Nanti
                                        </button>
                                    </div>
                                    {/* Indikator Loading */}
                                    {processing && <p className="text-center text-xs text-gray-400 mt-2 animate-pulse">Sedang memproses transaksi...</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
