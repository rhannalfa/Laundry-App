<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat Akun Admin Default
        User::create([
            'name' => 'Admin Laundry',
            'email' => 'admin@laundry.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // 2. Panggil Seeder Layanan
        $this->call([
            ServiceSeeder::class,
        ]);

        // (Optional) Kalau mau buat data dummy User lain, bisa pakai factory
        // User::factory(5)->create();
    }
}
