import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                // Menggunakan font bawaan yang bersih
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            // MENAMBAHKAN WARNA BRANDING KHUSUS
            colors: {
                brand: {
                    50: '#f0fdfa', // Latar belakang sangat terang
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6', // Warna Utama (Primary)
                    600: '#0d9488', // Warna Hover
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                },
                // Warna Status yang lebih soft
                success: '#22c55e', // Hijau Paid
                pending: '#f59e0b', // Kuning Process
                danger: '#ef4444',  // Merah Unpaid
            }
        },
    },
    plugins: [forms],
};
