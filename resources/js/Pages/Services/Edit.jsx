import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function ServiceEdit({ auth, service }) {
    const { data, setData, put, processing, errors } = useForm({
        name: service.name,
        unit: service.unit,
        price: service.price,
        estimate_hours: service.estimate_hours,
        is_active: service.is_active == 1 // Konversi ke boolean
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('services.update', service.id));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Edit Layanan</h2>}>
            <Head title="Edit Layanan" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nama */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nama Layanan</label>
                            <input type="text" className="mt-1 block w-full rounded-lg border-gray-300 focus:border-brand-500 focus:ring-brand-500"
                                value={data.name} onChange={e => setData('name', e.target.value)} required />
                        </div>

                        {/* Harga & Satuan */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Harga (Rp)</label>
                                <input type="number" className="mt-1 block w-full rounded-lg border-gray-300 focus:border-brand-500 focus:ring-brand-500"
                                    value={data.price} onChange={e => setData('price', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Satuan</label>
                                <select className="mt-1 block w-full rounded-lg border-gray-300 focus:border-brand-500 focus:ring-brand-500"
                                    value={data.unit} onChange={e => setData('unit', e.target.value)}>
                                    <option value="kg">Kiloan (Kg)</option>
                                    <option value="pcs">Satuan (Pcs)</option>
                                    <option value="meter">Meteran (m)</option>
                                </select>
                            </div>
                        </div>

                        {/* Estimasi & Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Estimasi (Jam)</label>
                                <input type="number" className="mt-1 block w-full rounded-lg border-gray-300 focus:border-brand-500 focus:ring-brand-500"
                                    value={data.estimate_hours} onChange={e => setData('estimate_hours', e.target.value)} required />
                            </div>

                            <div className="flex items-center pt-6">
                                <label className="flex items-center cursor-pointer">
                                    <input type="checkbox" className="rounded border-gray-300 text-brand-600 shadow-sm focus:ring-brand-500"
                                        checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} />
                                    <span className="ms-2 text-sm text-gray-700">Layanan Aktif</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Link href={route('services.index')} className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 font-bold hover:bg-gray-300">Batal</Link>
                            <button type="submit" disabled={processing} className="px-4 py-2 bg-brand-600 rounded-lg text-white font-bold hover:bg-brand-700 shadow-lg shadow-brand-200">
                                Update Layanan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
