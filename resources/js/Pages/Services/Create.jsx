import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function ServiceCreate({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        unit: 'kg',
        price: '',
        estimate_hours: 24,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('services.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Layanan</h2>}
        >
            <Head title="Tambah Layanan" />

            <div className="py-6 md:py-12 bg-gray-50 min-h-screen">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header Text (Mobile Friendly) */}
                    <div className="mb-6">
                        <Link href={route('services.index')} className="text-gray-400 text-xs font-bold uppercase tracking-wide hover:text-brand-600 mb-2 inline-block">
                            &larr; Kembali ke Daftar
                        </Link>
                        <h3 className="text-xl md:text-2xl font-extrabold text-gray-800">Buat Layanan Baru</h3>
                        <p className="text-sm text-gray-500">Tentukan nama, harga, dan satuan hitung.</p>
                    </div>

                    <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        {/* Hiasan Dekoratif di Pojok */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-brand-50 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>

                        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6 relative z-10">

                            {/* Nama Layanan (Full Width) */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Layanan</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border-gray-300 focus:border-brand-500 focus:ring-brand-500 text-sm py-3"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    required
                                    placeholder="Contoh: Cuci Setrika Kiloan"
                                />
                                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                            </div>

                            {/* Group: Harga & Satuan (Stack di HP, Side-by-side di Laptop) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Harga (Rp)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">Rp</span>
                                        <input
                                            type="number"
                                            className="w-full rounded-xl border-gray-300 focus:border-brand-500 focus:ring-brand-500 pl-10 text-sm py-3 font-bold text-gray-800"
                                            value={data.price}
                                            onChange={e => setData('price', e.target.value)}
                                            required
                                            placeholder="0"
                                        />
                                    </div>
                                    {errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Satuan Hitung</label>
                                    <select
                                        className="w-full rounded-xl border-gray-300 focus:border-brand-500 focus:ring-brand-500 text-sm py-3 bg-gray-50"
                                        value={data.unit}
                                        onChange={e => setData('unit', e.target.value)}
                                    >
                                        <option value="kg">Per Kilo (Kg)</option>
                                        <option value="pcs">Per Potong (Pcs)</option>
                                        <option value="meter">Per Meter (m)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Estimasi (Full Width) */}
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <label className="block text-sm font-bold text-blue-800 mb-1">Estimasi Pengerjaan (Jam)</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        className="w-24 rounded-lg border-blue-200 focus:border-brand-500 focus:ring-brand-500 text-center font-bold text-blue-900"
                                        value={data.estimate_hours}
                                        onChange={e => setData('estimate_hours', e.target.value)}
                                        required
                                    />
                                    <span className="text-sm text-blue-600">Jam ( {data.estimate_hours >= 24 ? Math.floor(data.estimate_hours/24) + ' Hari' : ''} )</span>
                                </div>
                                <p className="text-xs text-blue-400 mt-2 italic">Contoh: 24 = 1 Hari, 48 = 2 Hari.</p>
                            </div>

                            {/* Tombol Aksi (Stack di HP, Row di Laptop) */}
                            <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-4">
                                <Link
                                    href={route('services.index')}
                                    className="w-full md:w-auto text-center px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl text-white font-bold hover:shadow-lg shadow-brand-200 transition transform active:scale-95"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Layanan'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
