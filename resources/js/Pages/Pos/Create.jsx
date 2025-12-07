import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function PosCreate({ auth, services }) {
    const [cart, setCart] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_name: '',
        customer_phone: '',
        rack_location: '',
        items: [],
        payment_choice: 'cash'
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert("Keranjang masih kosong!");
            return;
        }

        data.items = cart.map(item => ({ id: item.id, qty: item.qty }));

        post(route('pos.store'), {
            onSuccess: (page) => {
                const flash = page.props.flash || {};
                const successData = flash.success || {};
                const paymentChoice = successData.payment_choice;
                const snapToken = successData.snap_token;

                // 1. KASUS CASHLESS (MIDTRANS)
                if (paymentChoice === 'cashless' && snapToken) {
                    window.snap.pay(snapToken, {
                        onSuccess: function(result){
                            alert("Pembayaran Berhasil!");
                            // Redirect ke Riwayat
                            router.visit(route('transactions.index'));
                        },
                        onPending: function(result){
                            alert("Menunggu pembayaran...");
                            // Redirect ke Riwayat (biar bisa bayar nanti)
                            router.visit(route('transactions.index'));
                        },
                        onError: function(result){
                            alert("Pembayaran gagal!");
                        },
                        onClose: function(){
                            // Jika ditutup, lempar ke riwayat juga
                            if(confirm("Anda menutup popup. Lanjutkan ke riwayat transaksi?")) {
                                router.visit(route('transactions.index'));
                            }
                        }
                    });
                }

                // 2. KASUS TUNAI (CASH)
                else if (paymentChoice === 'cash') {
                    alert('✅ Transaksi BERHASIL! \nPembayaran TUNAI diterima.');
                    // Redirect ke Riwayat
                    router.visit(route('transactions.index'));
                }

                // 3. KASUS BAYAR NANTI (LATER)
                else {
                    alert('📦 Transaksi Disimpan (Belum Bayar).');
                    // Redirect ke Riwayat
                    router.visit(route('transactions.index'));
                }
            },
            onError: (errors) => {
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

                {/* KIRI: DAFTAR MENU (GRID MODERN) */}
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
                                {/* Dekorasi Aksen Lingkaran di pojok */}
                                <div className="absolute -right-6 -top-6 w-16 h-16 bg-brand-50 rounded-full group-hover:bg-brand-100 transition-colors"></div>

                                <div className="relative z-10">
                                    <h3 className="font-bold text-gray-800 text-lg leading-snug mb-1 group-hover:text-brand-600 transition-colors">{service.name}</h3>
                                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                                        <span>🕒</span> {service.estimate_hours} Jam
                                    </div>

                                    <div className="flex items-end justify-between">
                                        <div className="font-extrabold text-xl text-brand-600">
                                            {parseInt(service.price).toLocaleString('id-ID')}
                                        </div>
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
                                            <div className="text-xs text-brand-600 font-medium">
                                                Rp {parseInt(item.price).toLocaleString()}
                                            </div>
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

                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border-gray-200 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500 transition-colors"
                                        value={data.customer_name}
                                        onChange={e => setData('customer_name', e.target.value)}
                                        placeholder="Nama Pelanggan (Wajib)"
                                        required
                                    />
                                    {errors.customer_name && <div className="text-red-500 text-xs mt-1">{errors.customer_name}</div>}
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

                                {/* --- PILIHAN PEMBAYARAN BARU --- */}
                                <div className="py-2">
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Metode Pembayaran</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {/* Pilihan 1: Tunai */}
                                        <div
                                            onClick={() => setData('payment_choice', 'cash')}
                                            className={`cursor-pointer border rounded-xl p-2 text-center text-xs font-bold transition flex flex-col items-center justify-center gap-1 h-16 ${
                                                data.payment_choice === 'cash'
                                                ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500'
                                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span>💵</span>
                                            Tunai
                                        </div>

                                        {/* Pilihan 2: Cashless */}
                                        <div
                                            onClick={() => setData('payment_choice', 'cashless')}
                                            className={`cursor-pointer border rounded-xl p-2 text-center text-xs font-bold transition flex flex-col items-center justify-center gap-1 h-16 ${
                                                data.payment_choice === 'cashless'
                                                ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span>💳</span>
                                            QRIS
                                        </div>

                                        {/* Pilihan 3: Nanti */}
                                        <div
                                            onClick={() => setData('payment_choice', 'later')}
                                            className={`cursor-pointer border rounded-xl p-2 text-center text-xs font-bold transition flex flex-col items-center justify-center gap-1 h-16 ${
                                                data.payment_choice === 'later'
                                                ? 'bg-yellow-50 border-yellow-500 text-yellow-700 ring-1 ring-yellow-500'
                                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span>⏳</span>
                                            Nanti
                                        </div>
                                    </div>
                                </div>

                                {/* Tombol Submit Dinamis */}
                                <button
                                    type="submit"
                                    disabled={cart.length === 0 || processing}
                                    className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all transform active:scale-[0.98] mt-2 text-white ${
                                        data.payment_choice === 'later'
                                        ? 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200'
                                        : data.payment_choice === 'cashless'
                                        ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                                        : 'bg-gradient-to-r from-brand-500 to-brand-600 shadow-brand-200'
                                    }`}
                                >
                                    {processing ? 'Memproses...' :
                                     data.payment_choice === 'cash' ? 'TERIMA TUNAI (LUNAS) ✨' :
                                     data.payment_choice === 'later' ? 'SIMPAN (BELUM BAYAR) 📦' :
                                     'BAYAR QRIS / E-WALLET 💳'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
