import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Address } from '../../types';

const AddressManagement: React.FC = () => {
    const { currentUser, addAddress, updateAddress, deleteAddress, setDefaultAddress, showNotification } = useAppContext();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        recipientName: '',
        phoneNumber: '',
        line1: '',
        ward: '',
        district: '',
        province: '',
        isDefault: false,
    });

    const addresses = currentUser?.addresses || [];

    const resetForm = () => {
        setFormData({
            recipientName: '',
            phoneNumber: '',
            line1: '',
            ward: '',
            district: '',
            province: '',
            isDefault: false,
        });
        setIsAdding(false);
        setEditingId(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!currentUser) {
            showNotification('Please login first', 'error');
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

    const handleEdit = (address: Address) => {
        setFormData({
            recipientName: address.recipientName,
            phoneNumber: address.phoneNumber,
            line1: address.line1,
            ward: address.ward,
            district: address.district,
            province: address.province,
            isDefault: address.isDefault,
        });
        setEditingId(address.id);
        setIsAdding(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this address?')) {
            return;
        }
        await deleteAddress(id);
    };

    const handleSetDefault = async (id: string) => {
        await setDefaultAddress(id);
    };

    if (!currentUser) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <p className="text-gray-600">Please login to manage your addresses</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
                    <button
                        onClick={() => {
                            resetForm();
                            setIsAdding(true);
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        {isAdding ? 'Cancel' : '+ Add New Address'}
                    </button>
                </div>

                {/* Add/Edit Form */}
                {isAdding && (
                    <div className="mb-6 p-6 bg-gray-50 rounded-lg border-2 border-indigo-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {editingId ? 'Edit Address' : 'Add New Address'}
                        </h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Recipient Name *
                                </label>
                                <input
                                    type="text"
                                    name="recipientName"
                                    value={formData.recipientName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    required
                                    pattern="0\d{9}"
                                    placeholder="0123456789"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Street Address (Line 1) *
                                </label>
                                <input
                                    type="text"
                                    name="line1"
                                    value={formData.line1}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ward *
                                </label>
                                <input
                                    type="text"
                                    name="ward"
                                    value={formData.ward}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    District *
                                </label>
                                <input
                                    type="text"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Province *
                                </label>
                                <input
                                    type="text"
                                    name="province"
                                    value={formData.province}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div className="md:col-span-2 flex items-center">
                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    id="isDefault"
                                    checked={formData.isDefault}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                                    Set as default address
                                </label>
                            </div>

                            <div className="md:col-span-2 flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    {editingId ? 'Update Address' : 'Save Address'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Address List */}
                {addresses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No addresses found. Add your first address above.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {addresses.map((address) => (
                            <div
                                key={address.id}
                                className={`p-5 rounded-lg border-2 ${
                                    address.isDefault
                                        ? 'border-indigo-600 bg-indigo-50'
                                        : 'border-gray-200 bg-white'
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        {address.isDefault && (
                                            <span className="inline-block px-2 py-1 mb-2 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded">
                                                DEFAULT
                                            </span>
                                        )}
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            {address.recipientName}
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-1">
                                            {address.phoneNumber}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {address.line1}, {address.ward}, {address.district}, {address.province}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        {!address.isDefault && (
                                            <button
                                                onClick={() => handleSetDefault(address.id)}
                                                className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
                                                title="Set as default"
                                            >
                                                Set Default
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleEdit(address)}
                                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(address.id)}
                                            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                            disabled={addresses.length === 1 && address.isDefault}
                                            title={
                                                addresses.length === 1 && address.isDefault
                                                    ? 'Cannot delete the only address'
                                                    : 'Delete address'
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddressManagement;

