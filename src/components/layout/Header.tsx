"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <nav className="bg-white shadow-md fixed w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center group">
                            <span className="text-3xl font-bold tracking-tighter text-black flex flex-col items-center">
                                <span className="mb-[-8px]">Éades</span>
                                <svg width="80" height="8" viewBox="0 0 80 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:scale-x-110 transition-transform">
                                    <path d="M2 4C20 4 40 2 78 2" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M5 6C25 6 45 4 70 4" stroke="black" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                                </svg>
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/" className="text-black hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Accueil
                        </Link>
                        <Link href="/properties" className="text-black hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Nos Appartements
                        </Link>
                        {user && (user.role === 'VENDEUR' || user.role === 'ADMIN') && (
                            <Link href="/dashboard/vendor" className="text-black hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Espace Vendeur
                            </Link>
                        )}
                        {user && user.role === 'CLIENT' && (
                            <Link href="/dashboard/client" className="text-black hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Mon Compte
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center space-x-2 text-gray-900">
                                <FaUserCircle size={24} className="text-black" />
                                <span className="font-semibold">{user.name}</span>
                                <button
                                    onClick={() => signOut()}
                                    className="text-red-500 hover:text-red-700 text-sm ml-4 font-medium"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <Link href="/auth/signin" className="text-black hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium border border-black transition-colors">
                                    Se connecter
                                </Link>
                                <Link href="/auth/signup" className="bg-black text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Créer un compte
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-white">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/" className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">
                            Accueil
                        </Link>
                        <Link href="/properties" className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">
                            Nos Appartements
                        </Link>
                        {user ? (
                            <>
                                <div className="px-3 py-2 text-gray-700 font-semibold flex items-center">
                                    <FaUserCircle className="mr-2" /> {user.name}
                                </div>
                                <button className="block w-full text-left text-red-500 hover:bg-red-50 px-3 py-2 rounded-md text-base font-medium">
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/signin" className="block text-center text-black hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium border border-black mt-2">
                                    Se connecter
                                </Link>
                                <Link href="/auth/signup" className="block text-center bg-black text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium mt-2">
                                    Créer un compte
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
