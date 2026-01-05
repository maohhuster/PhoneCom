import React from 'react';
import { Smartphone, ShoppingCart, LayoutDashboard, LogOut } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Role } from '../../types';

export const Header: React.FC = () => {
    const { currentUser, cart, logout, setView, view } = useAppContext();
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center cursor-pointer group" onClick={() => setView('home')}>
                        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
                            <Smartphone className="h-6 w-6 text-white" />
                        </div>
                        <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">PhoneCom</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        {currentUser ? (
                            <>
                                <div className="hidden md:flex flex-col items-end mr-2">
                                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{currentUser.role.name}</span>
                                    <span className="text-sm font-medium text-gray-700">{currentUser.fullName}</span>
                                </div>

                                {currentUser.role.name === Role.CUSTOMER && (
                                    <>
                                        <button
                                            onClick={() => setView('orders')}
                                            className={`text-sm font-medium transition-colors ${view === 'orders' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
                                        >
                                            My Orders
                                        </button>
                                        <button
                                            onClick={() => setView('addresses')}
                                            className={`text-sm font-medium transition-colors ${view === 'addresses' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
                                        >
                                            My Addresses
                                        </button>
                                        <button
                                            onClick={() => setView('cart')}
                                            className="relative p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                                        >
                                            <ShoppingCart className="h-6 w-6" />
                                            {cartItemCount > 0 && (
                                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 text-xs font-bold leading-none text-white transform bg-red-500 rounded-full border-2 border-white">
                                                    {cartItemCount}
                                                </span>
                                            )}
                                        </button>
                                    </>
                                )}

                                {(currentUser.role.name === Role.STAFF) && (
                                    <button
                                        onClick={() => setView('dashboard')}
                                        className={`flex items-center px-3 py-1.5 rounded-md transition-colors ${view === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                                    >
                                        <LayoutDashboard className="h-4 w-4 mr-2" />
                                        <span className="text-sm font-medium">Staff Dashboard</span>
                                    </button>
                                )}

                                {(currentUser.role.name === Role.ADMIN) && (
                                    <button
                                        onClick={() => setView('admin-dashboard')}
                                        className={`flex items-center px-3 py-1.5 rounded-md transition-colors ${view === 'admin-dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                                    >
                                        <LayoutDashboard className="h-4 w-4 mr-2" />
                                        <span className="text-sm font-medium">Admin Dashboard</span>
                                    </button>
                                )}

                                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                                <button
                                    onClick={logout}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setView('login')}
                                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
