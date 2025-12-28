import React, { useState } from 'react';
import { Search, Filter, Smartphone, Tag, ShoppingCart, Package } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Product, Role } from '../../types';
import { HeroSection } from './HeroSection';

export const ProductList: React.FC = () => {
    const { products, setView, setCurrentProduct, addToCart, currentUser, showNotification } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [brandFilter, setBrandFilter] = useState<string>('All');

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = brandFilter === 'All' || p.brand === brandFilter;
        return matchesSearch && matchesBrand;
    });

    const uniqueBrands = ['All', ...Array.from(new Set(products.map(p => p.brand)))];

    const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation();

        if (!currentUser) {
            showNotification("Please login to purchase", "error");
            setView('login');
            return;
        }

        if (currentUser.role.name !== Role.CUSTOMER) {
            showNotification("Only Customers can purchase", "error");
            return;
        }

        const availableVariant = product.variants.find(v => v.stockQuantity > 0);

        if (availableVariant) {
            addToCart(availableVariant, product);
        } else {
            showNotification("Product is out of stock", "error");
        }
    };

    return (
        <>
            <HeroSection />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-16 relative z-20">
                <div className="bg-white rounded-xl shadow-xl p-6 mb-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="relative w-full md:w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors sm:text-sm"
                                placeholder="Search phones..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            <span className="text-sm font-medium text-gray-500 mr-2 flex items-center"><Filter className="h-4 w-4 mr-1" /> Brands:</span>
                            {uniqueBrands.map(brand => (
                                <button
                                    key={brand}
                                    onClick={() => setBrandFilter(brand)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${brandFilter === brand ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {brand}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map(product => {
                        const minPrice = Math.min(...product.variants.map(v => v.price));
                        const totalStock = product.variants.reduce((acc, v) => acc + v.stockQuantity, 0);

                        return (
                            <div
                                key={product.id}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100 flex flex-col h-full transform hover:-translate-y-1"
                                onClick={() => { setCurrentProduct(product); setView('product-detail'); }}
                            >
                                <div className="aspect-w-4 aspect-h-3 bg-gray-100 relative overflow-hidden">
                                    <img
                                        src={product.imageUrl || product.variants[0]?.imageUrl}
                                        alt={product.name}
                                        className="w-full h-64 object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {totalStock === 0 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg transform -rotate-12">OUT OF STOCK</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">{product.brand}</p>
                                            <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-indigo-700 transition-colors">{product.name}</h3>
                                        </div>
                                        <div className="flex items-center bg-green-50 px-2 py-1 rounded text-green-700">
                                            <Tag className="h-3 w-3 mr-1" />
                                            <span className="text-sm font-bold">${minPrice}</span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500 line-clamp-2 flex-1">{product.description}</p>

                                    <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center gap-2">
                                        <span className={`text-xs font-semibold flex items-center ${totalStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            <div className={`w-2 h-2 rounded-full mr-2 ${totalStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            {totalStock > 0 ? `${totalStock} Available` : 'Unavailable'}
                                        </span>

                                        <div className="flex gap-2">
                                            {totalStock > 0 && (
                                                <button
                                                    onClick={(e) => handleQuickAdd(e, product)}
                                                    className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-indigo-600 hover:text-white hover:border-transparent transition-all shadow-sm"
                                                    title="Quick Add to Cart"
                                                >
                                                    <ShoppingCart className="h-5 w-5" />
                                                </button>
                                            )}

                                            <button
                                                onClick={(e) => { e.stopPropagation(); setCurrentProduct(product); setView('product-detail'); }}
                                                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors shadow-sm"
                                            >
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
                        <p className="mt-1 text-gray-500">We couldn't find anything matching your search.</p>
                        <button onClick={() => { setSearchTerm(''); setBrandFilter('All'); }} className="mt-4 text-indigo-600 font-medium hover:text-indigo-800">Clear filters</button>
                    </div>
                )}
            </div>
        </>
    );
};
