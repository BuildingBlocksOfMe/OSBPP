import Link from "next/link";
import { Search, Menu, Bell, Plus, User } from "lucide-react";
// Button import removed as it is not used yet

export default function Navbar() {
    return (
        <header className="bg-[#24292f] text-white py-3 px-4 md:px-6 flex items-center justify-between">
            {/* Left Section: Logo & Mobile Menu */}
            <div className="flex items-center gap-4">
                <button className="md:hidden text-gray-300 hover:text-white">
                    <Menu size={24} />
                </button>
                <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#24292f]">
                        {/* Simple Logo Placeholder */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
                        </svg>
                    </div>
                    <span>OSBPP</span>
                </Link>
            </div>

            {/* Center Section: Search & Nav Links (Desktop) */}
            <div className="hidden md:flex items-center gap-4 flex-1 max-w-2xl mx-4">
                <div className="relative w-full max-w-sm">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-gray-400">
                        <Search size={16} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search or jump to..."
                        className="w-full bg-[#24292f] border border-gray-600 rounded-md py-1 pl-8 pr-2 text-sm text-white placeholder-gray-400 focus:bg-white focus:text-black focus:border-white transition-colors outline-none h-8"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <kbd className="border border-gray-600 rounded px-1 text-[10px] text-gray-400">/</kbd>
                    </div>
                </div>

                <nav className="flex items-center gap-1 text-sm font-semibold text-white">
                    <Link href="#" className="hover:text-gray-300 px-2 py-1">Pull requests</Link>
                    <Link href="#" className="hover:text-gray-300 px-2 py-1">Issues</Link>
                    <Link href="#" className="hover:text-gray-300 px-2 py-1">Marketplace</Link>
                    <Link href="#" className="hover:text-gray-300 px-2 py-1">Explore</Link>
                </nav>
            </div>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-3">
                <button className="text-white hover:text-gray-300 relative border border-gray-600 rounded-md p-1 h-8 w-8 flex items-center justify-center">
                    <Plus size={16} />
                    <span className="sr-only">New...</span>
                </button>

                <button className="text-white hover:text-gray-300 relative border border-gray-600 rounded-md p-1 h-8 w-8 flex items-center justify-center">
                    <Bell size={16} />
                    <span className="sr-only">Notifications</span>
                </button>

                <button className="text-white hover:text-gray-300 relative border border-gray-600 rounded-full h-8 w-8 flex items-center justify-center overflow-hidden bg-gray-700">
                    <User size={18} />
                    <span className="sr-only">Profile</span>
                </button>
            </div>
        </header>
    );
}
