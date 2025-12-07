<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        // Daftar Layanan Default
        $services = [
            [
                'name' => 'Cuci Komplit (Cuci+Setrika)',
                'unit' => 'kg',
                'price' => 7000,
                'estimate_hours' => 48,
            ],
            [
                'name' => 'Cuci Kering (Tanpa Setrika)',
                'unit' => 'kg',
                'price' => 5000,
                'estimate_hours' => 24,
            ],
            [
                'name' => 'Setrika Saja',
                'unit' => 'kg',
                'price' => 4000,
                'estimate_hours' => 24,
            ],
            [
                'name' => 'Cuci Kilat (Express 6 Jam)',
                'unit' => 'kg',
                'price' => 12000,
                'estimate_hours' => 6,
            ],
            [
                'name' => 'Cuci Bedcover (Besar)',
                'unit' => 'pcs',
                'price' => 35000,
                'estimate_hours' => 72,
            ],
            [
                'name' => 'Cuci Sepatu (Deep Clean)',
                'unit' => 'pcs',
                'price' => 25000,
                'estimate_hours' => 48,
            ],
            [
                'name' => 'Cuci Karpet',
                'unit' => 'meter',
                'price' => 15000,
                'estimate_hours' => 72,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
