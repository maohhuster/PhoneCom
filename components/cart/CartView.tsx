import React from 'react';
import { ShoppingCart, Minus, Plus, X, Lock } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const CartView: React.FC = () => {
    const { cart, removeFromCart, updateCartQty, setView } = useAppContext();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-32 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
                    <ShoppingCart className="h-10 w-10 text-gray-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Your cart is empty</h2>
                <p className="mt-2 text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <button
                    onClick={() => setView('home')}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-10">Shopping Cart</h1>
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                <div className="lg:col-span-8">
                    <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-200">
                        <ul className="divide-y divide-gray-200">
                            {cart.map((item) => (
                                <li key={item.id} className="p-6 sm:flex items-center hover:bg-gray-50 transition-colors">
                                    <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-lg overflow-hidden">
                                        <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-center object-cover" />
                                    </div>
                                    <div className="ml-4 flex-1 flex flex-col sm:ml-6 justify-between h-24">
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {item.productName}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">{item.variantName}</p>
                                            </div>
                                            <p className="text-lg font-bold text-gray-900">${item.price}</p>
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                                                <button onClick={() => updateCartQty(item.id, -1)} className="p-2 hover:bg-gray-100 rounded-l-lg text-gray-600"><Minus className="h-4 w-4" /></button>
                                                <span className="px-4 py-1 text-gray-900 font-medium border-l border-r border-gray-300 min-w-[3rem] text-center">{item.quantity}</span>
                                                <button onClick={() => updateCartQty(item.id, 1)} className="p-2 hover:bg-gray-100 rounded-r-lg text-gray-600"><Plus className="h-4 w-4" /></button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-sm font-medium text-red-600 hover:text-red-500 flex items-center p-2 rounded hover:bg-red-50 transition-colors"
                                            >
                                                <X className="h-4 w-4 mr-1" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="lg:col-span-4 mt-16 lg:mt-0">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                        <dl className="space-y-4">
                            <div className="flex items-center justify-between">
                                <dt className="text-gray-600">Subtotal</dt>
                                <dd className="font-medium text-gray-900">${total.toLocaleString()}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-gray-600">Shipping Estimate</dt>
                                <dd className="font-medium text-gray-900">$10.00</dd>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                <dt className="text-xl font-bold text-gray-900">Total</dt>
                                <dd className="text-xl font-bold text-indigo-600">${(total + 10).toLocaleString()}</dd>
                            </div>
                        </dl>

                        <button
                            onClick={() => setView('checkout')}
                            className="mt-8 w-full bg-indigo-600 border border-transparent rounded-xl shadow-lg shadow-indigo-200 py-4 px-4 text-lg font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-1"
                        >
                            Proceed to Checkout
                        </button>
                        <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                            <Lock className="h-4 w-4 mr-1" /> Secure Checkout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
