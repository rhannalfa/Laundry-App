import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';

export default function Authenticated({ user, header, children }) {
    const { url } = usePage();

    const isActive = (routeCheck) => route().current(routeCheck);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20 sm:pb-0">

            {/* =========================================
               NAVBAR ATAS (DESKTOP & HEADER MOBILE)
               ========================================= */}
            <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Logo Area */}
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-brand-600" />
                                </Link>
                            </div>

                            {/* Menu Navigasi Desktop (Hanya muncul di Laptop) */}
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>Dashboard</NavLink>
                                <NavLink href={route('pos.create')} active={route().current('pos.create')}>🛒 Kasir</NavLink>
                                <NavLink href={route('transactions.index')} active={route().current('transactions.index')}>📄 Riwayat</NavLink>
                                <NavLink href={route('services.index')} active={route().current('services.*')}>⚙️ Layanan</NavLink>
                            </div>
                        </div>

                        {/* Dropdown User (Desktop Only) */}
                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button type="button" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-brand-600 focus:outline-none transition ease-in-out duration-150">
                                                {user.name}
                                                <svg className="ms-2 -me-0.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Tampilan Header Mobile Sederhana (User Info) */}
                        <div className="flex items-center sm:hidden gap-3">
                            <div className="text-right">
                                <div className="text-xs text-gray-400 font-medium">Halo, Admin</div>
                                <div className="text-sm font-bold text-gray-800 leading-none">{user.name.split(' ')[0]}</div>
                            </div>
                            <Link href={route('profile.edit')} className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold text-xs border border-brand-200">
                                {user.name.charAt(0)}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header Halaman (Breadcrumb) */}
            {header && (
                <header className="bg-white shadow relative z-10 hidden sm:block">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>


            {/* =========================================
                BOTTOM NAVIGATION BAR (FLAT DESIGN)
                ========================================= */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg sm:hidden z-50 pb-safe">
                <div className="flex justify-around items-center h-16">

                    {/* 1. Dashboard */}
                    <Link href={route('dashboard')} className={`flex flex-col items-center justify-center w-full h-full ${isActive('dashboard') ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-0.5" fill={isActive('dashboard') ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-[10px] font-medium">Home</span>
                    </Link>

                    {/* 2. Kasir (Tengah - Sekarang Sejajar) */}
                    <Link href={route('pos.create')} className={`flex flex-col items-center justify-center w-full h-full ${isActive('pos.create') ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'}`}>
                        {/* Ikon Keranjang Belanja */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-0.5" fill={isActive('pos.create') ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-[10px] font-medium">Kasir</span>
                    </Link>

                    {/* 3. Riwayat */}
                    <Link href={route('transactions.index')} className={`flex flex-col items-center justify-center w-full h-full ${isActive('transactions.index') ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-0.5" fill={isActive('transactions.index') ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <span className="text-[10px] font-medium">Riwayat</span>
                    </Link>

                    {/* 4. Layanan (Menu) */}
                    <Link href={route('services.index')} className={`flex flex-col items-center justify-center w-full h-full ${isActive('services.*') ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-0.5" fill={isActive('services.*') ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-[10px] font-medium">Menu</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
