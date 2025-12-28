import React, { useState } from 'react';
import { ArrowRight, Star, CheckCircle, ShoppingCart } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Role } from '../../types';

export const ProductDetail: React.FC = () => {
    const { currentProduct, addToCart, setView, currentUser, showNotification } = useAppContext();
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
        currentProduct?.variants[0]?.id || null
    );

    if (!currentProduct) return null;

    const selectedVariant = currentProduct.variants.find(v => v.id === selectedVariantId);

    const handleAddToCart = () => {
        if (!selectedVariant) return;
        if (!currentUser) {
            showNotification("Please login to purchase", "error");
            setView('login');
            return;
        }
        if (currentUser.role.name !== Role.CUSTOMER) {
            showNotification("Only Customers can purchase. Please login as a Customer.", "error");
            return;
        }
        addToCart(selectedVariant, currentProduct);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button
                onClick={() => setView('home')}
                className="mb-8 text-sm font-medium text-gray-500 hover:text-indigo-600 flex items-center transition-colors"
            >
                <ArrowRight className="h-4 w-4 mr-1 transform rotate-180" /> Back to browsing
            </button>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-0">
                <div className="p-12 bg-gray-50 flex items-center justify-center border-r border-gray-100 relative">
                    <div className="absolute top-8 left-8">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-800 shadow-sm border border-gray-200">
                            {currentProduct.brand}
                        </span>
                    </div>
                    <img
                        src={selectedVariant?.imageUrl || currentProduct.imageUrl || currentProduct.variants[0]?.imageUrl}
                        alt={selectedVariant?.name}
                        className="max-h-[500px] w-auto object-contain drop-shadow-2xl transform transition-transform duration-500 hover:scale-105"
                    />
                </div>

                <div className="p-10 lg:p-14 flex flex-col justify-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{currentProduct.name}</h1>
                    <div className="mt-4 flex items-center space-x-2">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                        </div>
                        <span className="text-gray-400 text-sm">(Mock Reviews)</span>
                    </div>

                    <p className="mt-6 text-gray-600 text-lg leading-relaxed">{currentProduct.description}</p>

                    <div className="mt-10 pt-10 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Select Configuration</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {currentProduct.variants.map(variant => (
                                <div
                                    key={variant.id}
                                    onClick={() => setSelectedVariantId(variant.id)}
                                    className={`cursor-pointer group relative rounded-xl border-2 p-4 flex justify-between items-center transition-all ${selectedVariantId === variant.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900">{variant.capacity}</span>
                                        <span className="text-sm text-gray-500">{variant.color}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-bold text-indigo-700 text-lg">${variant.price}</span>
                                        <span className={`text-xs font-medium ${variant.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            {variant.stockQuantity > 0 ? 'In Stock' : 'Sold Out'}
                                        </span>
                                    </div>
                                    {selectedVariantId === variant.id && (
                                        <div className="absolute -top-2 -right-2 bg-indigo-600 text-white p-1 rounded-full shadow-sm">
                                            <CheckCircle className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col gap-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="text-gray-600 font-medium">Total Price:</span>
                            <span className="text-3xl font-bold text-gray-900">${selectedVariant?.price || 0}</span>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={!selectedVariant || selectedVariant.stockQuantity === 0}
                            className={`w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white shadow-lg transition-all transform hover:-translate-y-1
                ${(!selectedVariant || selectedVariant.stockQuantity === 0)
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30'}`}
                        >
                            {selectedVariant?.stockQuantity === 0 ? 'Out of Stock' : (
                                <><ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart</>
                            )}
                        </button>
                        {!currentUser && (
                            <p className="text-center text-sm text-gray-500 bg-yellow-50 p-2 rounded text-yellow-800">Please <button onClick={() => setView('login')} className="underline font-bold">sign in</button> to purchase this item.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
