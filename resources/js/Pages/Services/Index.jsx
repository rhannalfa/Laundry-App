import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination'; // <--- Import Komponen Baru
import { Head, Link, router } from '@inertiajs/react';

export default function ServiceIndex({ auth, services }) {

    const handleDelete = (id) => {
        if(confirm('Yakin ingin menghapus layanan ini?')) {
            router.delete(route('services.destroy', id));
        }
    }

    // Karena pakai paginate, data aslinya ada di dalam 'services.data'
    const dataLayanan = services.data;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pengaturan Layanan</h2>}
        >
            <Head title="Daftar Layanan" />

            <div className="py-6 md:py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-4">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-700">Daftar Harga & Menu</h3>
                            <p className="text-sm text-gray-500">Kelola jenis cucian yang tersedia di kasir.</p>
                        </div>

                        <Link href={route('services.create')} className="w-full md:w-auto text-center bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-xl shadow-sm transition transform active:scale-95">
                            + Tambah Layanan
                        </Link>
                    </div>

                    {/* --- MOBILE (CARD VIEW) --- */}
                    <div className="md:hidden space-y-4">
                        {dataLayanan.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                                <p className="text-gray-400 text-sm">Belum ada layanan.</p>
                            </div>
                        ) : (
                            dataLayanan.map((service) => (
                                <div key={service.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${service.is_active ? 'bg-brand-500' : 'bg-gray-300'}`}></div>
                                    <div className="pl-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-800 text-lg">{service.name}</h3>
                                            {service.is_active ? (
                                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-green-200">Aktif</span>
                                            ) : (
                                                <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-gray-200">Non-Aktif</span>
                                            )}
                                        </div>
                                        <div className="flex items-baseline gap-1 mb-4">
                                            <span className="text-2xl font-extrabold text-brand-600">Rp {parseInt(service.price).toLocaleString()}</span>
                                            <span className="text-xs text-gray-500 font-medium">/ {service.unit}</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                            <div className="text-xs text-gray-500 flex items-center gap-1"><span>⏱</span> Estimasi: {service.estimate_hours} Jam</div>
                                            <div className="flex gap-3">
                                                <Link href={route('services.edit', service.id)} className="text-sm font-bold text-yellow-600 hover:text-yellow-700">Edit</Link>
                                                <button onClick={() => handleDelete(service.id)} className="text-sm font-bold text-red-500 hover:text-red-700">Hapus</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* --- DESKTOP (TABLE VIEW) --- */}
                    <div className="hidden md:block bg-white shadow-sm sm:rounded-2xl border border-gray-100 overflow-hidden">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Nama Layanan</th>
                                    <th className="px-6 py-4">Harga</th>
                                    <th className="px-6 py-4">Estimasi</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {dataLayanan.length === 0 ? (
                                    <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400 italic">Belum ada data layanan.</td></tr>
                                ) : (
                                    dataLayanan.map((service) => (
                                        <tr key={service.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 font-bold text-gray-700">{service.name}</td>
                                            <td className="px-6 py-4 text-brand-600 font-bold">
                                                Rp {parseInt(service.price).toLocaleString()} <span className="text-gray-400 font-normal">/ {service.unit}</span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{service.estimate_hours} Jam</td>
                                            <td className="px-6 py-4">
                                                {service.is_active ? (
                                                    <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-green-200">Aktif</span>
                                                ) : (
                                                    <span className="bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full text-xs font-bold border border-gray-200">Non-Aktif</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                <Link href={route('services.edit', service.id)} className="text-yellow-600 hover:text-yellow-800 font-bold transition">Edit</Link>
                                                <button onClick={() => handleDelete(service.id)} className="text-red-500 hover:text-red-700 font-bold transition">Hapus</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* --- PAGINATION --- */}
                    <Pagination links={services.links} />

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
