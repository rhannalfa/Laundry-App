<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::latest()->paginate(10);
        return Inertia::render('Services/Index', ['services' => $services]);
    }

    public function create()
    {
        return Inertia::render('Services/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'required|in:kg,pcs,meter',
            'price' => 'required|numeric|min:0',
            'estimate_hours' => 'required|numeric|min:1',
        ]);

        Service::create($request->all());

        return redirect()->route('services.index')->with('success', 'Layanan berhasil ditambahkan!');
    }

    public function edit(Service $service)
    {
        return Inertia::render('Services/Edit', ['service' => $service]);
    }

    public function update(Request $request, Service $service)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'required|in:kg,pcs,meter',
            'price' => 'required|numeric|min:0',
            'estimate_hours' => 'required|numeric|min:1',
            'is_active' => 'boolean'
        ]);

        $service->update($request->all());

        return redirect()->route('services.index')->with('success', 'Layanan berhasil diperbarui!');
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return redirect()->route('services.index')->with('success', 'Layanan berhasil dihapus!');
    }
}
