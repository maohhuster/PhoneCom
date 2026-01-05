import React, { useState, useEffect } from 'react';
import { ArrowRight, Plus, CheckCircle, Truck, CreditCard, Package, Edit2, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Address } from '../../types';

export const CheckoutView: React.FC = () => {
    const { currentUser, placeOrder, setView, showNotification, addAddress, updateAddress, deleteAddress } = useAppContext();
    const [selectedAddress, setSelectedAddress] = useState<string>('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        recipientName: '',
        phoneNumber: '',
        line1: '',
        ward: '',
        district: '',
        province: ''
    });

    useEffect(() => {
        if (currentUser && currentUser.addresses && currentUser.addresses.length > 0 && !selectedAddress) {
            const defaultAddr = currentUser.addresses.find(a => a.isDefault);
            setSelectedAddress(defaultAddr ? defaultAddr.id : currentUser.addresses[0].id);
        }
    }, [currentUser, selectedAddress]);

    const resetForm = () => {
        setFormData({ recipientName: '', phoneNumber: '', line1: '', ward: '', district: '', province: '' });
        setIsAdding(false);
        setEditingId(null);
    };

    const handleEdit = (address: Address) => {
        setFormData({
            recipientName: address.recipientName,
            phoneNumber: address.phoneNumber,
            line1: address.line1,
            ward: address.ward,
            district: address.district,
            province: address.province
        });
        setEditingId(address.id);
        setIsAdding(true);
    };

    const handleDelete = async (addressId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent address selection when clicking delete
        
        const address = currentUser?.addresses?.find(a => a.id === addressId);
        const addressCount = currentUser?.addresses?.length || 0;
        
        if (addressCount === 1) {
            showNotification("Cannot delete the only address. Please add another address first.", "error");
            return;
        }

        if (!window.confirm('Are you sure you want to delete this address?')) {
            return;
        }

        try {
            await deleteAddress(addressId);
            // If deleted address was selected, select another one
            if (selectedAddress === addressId) {
                const remainingAddresses = currentUser?.addresses?.filter(a => a.id !== addressId) || [];
                if (remainingAddresses.length > 0) {
                    setSelectedAddress(remainingAddresses[0].id);
                }
            }
        } catch (error) {
            // Error handled in context
        }
    };

    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.recipientName || !formData.phoneNumber || !formData.line1 || !formData.ward || !formData.district || !formData.province) {
            showNotification("Please fill in all fields", "error");
            return;
        }
        
        try {
            if (editingId) {
                await updateAddress(editingId, formData);
            } else {
                await addAddress(formData);
            }
            resetForm();
        } catch (error) {
            // Error handled in context
        }
    };

    const handlePlaceOrder = () => {
        const address = currentUser?.addresses?.find(a => a.id === selectedAddress);
        if (!address) {
            showNotification("Please select a valid address", "error");
            return;
        }
        placeOrder(address);
    };

    if (!currentUser) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button onClick={() => setView('cart')} className="mb-8 text-sm text-gray-500 hover:text-gray-900 flex items-center">
                <ArrowRight className="h-4 w-4 mr-1 transform rotate-180" /> Back to Cart
            </button>

            <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                <div>
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
                        <p className="mt-1 text-sm text-gray-500">Where should we send your order?</p>
                    </div>

                    <div className="space-y-4">
                        {isAdding ? (
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-inner">
                                <h4 className="text-lg font-bold text-gray-900 mb-4">
                                    {editingId ? 'Edit Address' : 'Add New Address'}
                                </h4>
                                <form onSubmit={handleSaveAddress} className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                                        <input
                                            type="text"
                                            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5"
                                            value={formData.recipientName}
                                            onChange={e => setFormData({ ...formData, recipientName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="text"
                                            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5"
                                            value={formData.phoneNumber}
                                            onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address (Line 1)</label>
                                        <input
                                            type="text"
                                            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5"
                                            value={formData.line1}
                                            onChange={e => setFormData({ ...formData, line1: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
                                            <input
                                                type="text"
                                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5"
                                                value={formData.ward}
                                                onChange={e => setFormData({ ...formData, ward: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                            <input
                                                type="text"
                                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5"
                                                value={formData.district}
                                                onChange={e => setFormData({ ...formData, district: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Province/City</label>
                                            <input
                                                type="text"
                                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5"
                                                value={formData.province}
                                                onChange={e => setFormData({ ...formData, province: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                                        >
                                            {editingId ? 'Update Address' : 'Save Address'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-4">
                                    {(currentUser.addresses || []).map(addr => (
                                        <div
                                            key={addr.id}
                                            className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}`}
                                            onClick={() => setSelectedAddress(addr.id)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="block text-sm font-bold text-gray-900">{addr.recipientName}</span>
                                                        {addr.isDefault && (
                                                            <span className="px-2 py-0.5 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded">
                                                                DEFAULT
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="block text-sm text-gray-600 mt-1">{addr.line1}, {addr.ward}, {addr.district}, {addr.province}</span>
                                                    <span className="block text-sm text-gray-500 mt-1">{addr.phoneNumber}</span>
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    {selectedAddress === addr.id && (
                                                        <CheckCircle className="h-5 w-5 text-indigo-600" />
                                                    )}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEdit(addr);
                                                        }}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit address"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete(addr.id, e)}
                                                        disabled={(currentUser.addresses?.length || 0) === 1}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title={(currentUser.addresses?.length || 0) === 1 ? 'Cannot delete the only address' : 'Delete address'}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => {
                                            resetForm();
                                            setIsAdding(true);
                                        }}
                                        className="flex items-center justify-center p-5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                                    >
                                        <Plus className="h-5 w-5 mr-2" />
                                        Add New Address
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="mt-10 pt-10 border-t border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
                        <div className="bg-white border-2 border-indigo-100 rounded-xl p-6 flex items-center shadow-sm">
                            <div className="bg-green-100 p-3 rounded-full mr-4">
                                <Truck className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Cash on Delivery (COD)</p>
                                <p className="text-sm text-gray-500">Pay securely when you receive your order.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 lg:mt-0">
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                            By confirming, your order will be placed immediately. Stock is reserved but only deducted upon staff confirmation.
                        </p>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={!selectedAddress}
                            className={`w-full py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                  ${!selectedAddress ? 'bg-gray-300 cursor-not-allowed shadow-none hover:translate-y-0' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
                        >
                            Confirm Order
                        </button>

                        <div className="mt-6 flex justify-center space-x-4 text-gray-400">
                            <CreditCard className="h-6 w-6" />
                            <Truck className="h-6 w-6" />
                            <Package className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
