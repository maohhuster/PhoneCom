import React, { useState, useEffect, useMemo } from 'react';
import {
    Package, Activity, DollarSign, Users, AlertCircle, Edit2, Trash2, Plus, X, Image, Minus
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart as ReBarChart, Bar,
    PieChart as RePieChart, Pie, Cell, Legend
} from 'recharts';
import { useAppContext } from '../../context/AppContext';
import { Role, OrderStatus, Product, Variant } from '../../types';

export const StaffDashboard: React.FC = () => {
    const { orders, products, currentUser, allUsers, updateOrderStatus, addStaffNote, editStaffNote, deleteStaffNote, updateInventory, updateUserRole, updateProduct, updateVariant, addProduct, deleteProduct } = useAppContext();
    const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'overview' | 'users' | 'stock'>('orders');
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [newProductData, setNewProductData] = useState({
        name: '',
        brand: '',
        description: '',
        imageUrl: '',
        variants: [{
            name: '',
            color: '',
            capacity: '',
            price: 0,
            stockQuantity: 0,
            imageUrl: '',
            status: 'IN_STOCK'
        }]
    });
    const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editNoteContent, setEditNoteContent] = useState<string>('');
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [editProductData, setEditProductData] = useState<{
        name: string;
        brand: string;
        description: string;
        imageUrl: string;
        status: string;
    }>({ name: '', brand: '', description: '', imageUrl: '', status: 'ACTIVE' });

    const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
    const [editVariantData, setEditVariantData] = useState<{
        name: string;
        color: string;
        capacity: string;
        price: number;
        stockQuantity: number;
        imageUrl: string;
        status: string;
    }>({ name: '', color: '', capacity: '', price: 0, stockQuantity: 0, imageUrl: '', status: 'IN_STOCK' });

    const isAdmin = currentUser?.role.name === Role.ADMIN;

    useEffect(() => {
        if (isAdmin && activeTab === 'orders') {
            // Keep default as orders or switch to overview if preferred
        }
    }, [isAdmin]);

    const handleNoteChange = (orderId: string, value: string) => {
        setNoteInputs(prev => ({ ...prev, [orderId]: value }));
    };

    const submitNote = (orderId: string) => {
        if (noteInputs[orderId]) {
            addStaffNote(orderId, noteInputs[orderId]);
            setNoteInputs(prev => ({ ...prev, [orderId]: '' }));
        }
    };

    const handleEditProduct = (product: Product) => {
        setEditingProductId(product.id);
        setEditProductData({
            name: product.name,
            brand: product.brand,
            description: product.description,
            imageUrl: product.imageUrl || '',
            status: (product as any).status || 'ACTIVE'
        });
    };

    const handleSaveProduct = async () => {
        if (editingProductId) {
            await updateProduct(editingProductId, editProductData);
            setEditingProductId(null);
        }
    };

    const handleEditVariant = (variant: Variant) => {
        setEditingVariantId(variant.id);
        setEditVariantData({
            name: variant.name,
            color: variant.color,
            capacity: variant.capacity,
            price: variant.price,
            stockQuantity: variant.stockQuantity,
            imageUrl: variant.imageUrl || '',
            status: (variant as any).status || 'IN_STOCK'
        });
    };

    const handleSaveVariant = async () => {
        if (editingVariantId) {
            await updateVariant(editingVariantId, editVariantData);
            setEditingVariantId(null);
        }
    };

    const handleAddVariantToForm = () => {
        setNewProductData(prev => ({
            ...prev,
            variants: [...prev.variants, {
                name: '',
                color: '',
                capacity: '',
                price: 0,
                stockQuantity: 0,
                imageUrl: '',
                status: 'IN_STOCK'
            }]
        }));
    };

    const handleRemoveVariantFromForm = (index: number) => {
        setNewProductData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const handleAddProductSubmit = async () => {
        if (!newProductData.name || !newProductData.brand) {
            alert("Name and Brand are required");
            return;
        }
        await addProduct(newProductData);
        setIsAddingProduct(false);
        setNewProductData({
            name: '',
            brand: '',
            description: '',
            imageUrl: '',
            variants: [{
                name: '',
                color: '',
                capacity: '',
                price: 0,
                stockQuantity: 0,
                imageUrl: '',
                status: 'IN_STOCK'
            }]
        });
    };

    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm("Are you sure you want to delete this product and all its variants?")) {
            await deleteProduct(productId);
        }
    };

    const handleStockChange = async (variant: any, newStock: number) => {
        const productName = variant.productName || products.find(p => p.id === variant.productId)?.name || 'Product';
        const isSmallChange = Math.abs(newStock - variant.stockQuantity) === 1;

        if (isSmallChange || window.confirm(`Confirm updating stock for "${productName} - ${variant.name}" from ${variant.stockQuantity} to ${newStock}?`)) {
            await updateInventory(variant.id, newStock);
        }
    };

    const stats = useMemo(() => {
        const totalRevenue = orders
            .filter(o => o.status === OrderStatus.COMPLETED || o.status === OrderStatus.CONFIRMED)
            .reduce((sum, o) => sum + o.totalAmount, 0);

        const activeOrders = orders.filter(o => o.status === OrderStatus.PENDING || o.status === OrderStatus.CONFIRMED).length;
        const totalCustomers = allUsers.filter(u => u.role.name === Role.CUSTOMER).length;

        let lowStockCount = 0;
        products.forEach(p => {
            p.variants.forEach(v => {
                if (v.stockQuantity < 5) lowStockCount++;
            });
        });

        return { totalRevenue, activeOrders, totalCustomers, lowStockCount };
    }, [orders, allUsers, products]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isAdmin ? 'Admin Dashboard' : 'Staff Dashboard'}
                    </h1>
                    <p className="text-sm text-gray-500">Manage orders, inventory, and view analytics.</p>
                </div>

                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg self-start overflow-x-auto">
                    {isAdmin && (
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Overview
                        </button>
                    )}
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'orders' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Order Management
                    </button>
                    {isAdmin && (
                        <button
                            onClick={() => setActiveTab('inventory')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'inventory' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Inventory
                        </button>
                    )}
                    {isAdmin && (
                        <button
                            onClick={() => setActiveTab('stock')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'stock' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Stock Management
                        </button>
                    )}
                    {isAdmin && (
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            User Management
                        </button>
                    )}
                </div>
            </div>

            {isAdmin && activeTab === 'overview' && (
                <div className="space-y-6 animate-slide-in-right">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
                            <div className="p-3 bg-green-100 rounded-full mr-4">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full mr-4">
                                <Activity className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Active Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.activeOrders}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
                            <div className="p-3 bg-purple-100 rounded-full mr-4">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Customers</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
                            <div className="p-3 bg-orange-100 rounded-full mr-4">
                                <AlertCircle className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Low Stock Alerts</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.lowStockCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Trend (Daily)</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={
                                        Object.entries(orders.reduce((acc, order) => {
                                            const date = new Date(order.createdAt).toLocaleDateString();
                                            acc[date] = (acc[date] || 0) + Number(order.totalAmount);
                                            return acc;
                                        }, {} as Record<string, number>))
                                            .map(([date, revenue]) => ({ date, revenue }))
                                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                    }>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(val) => `$${val}`} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                            formatter={(val: number) => [`$${val.toFixed(2)}`, 'Revenue']}
                                        />
                                        <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Order Status Distribution</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={
                                                Object.entries(orders.reduce((acc, order) => {
                                                    acc[order.status] = (acc[order.status] || 0) + 1;
                                                    return acc;
                                                }, {} as Record<string, number>))
                                                    .map(([name, value]) => ({ name, value }))
                                            }
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {Object.keys(OrderStatus).map((key, index) => (
                                                <Cell key={`cell-${index}`} fill={[
                                                    '#f59e0b', // PENDING
                                                    '#3b82f6', // CONFIRMED
                                                    '#10b981', // COMPLETED
                                                    '#ef4444'  // CANCELLED
                                                ][index] || '#6366f1'} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', shadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 lg:col-span-2">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Top Selling Products (by Quantity)</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ReBarChart data={
                                        Object.entries(orders.flatMap(o => o.items).reduce((acc, item) => {
                                            const productName = item.productName || 'Unknown Product';
                                            acc[productName] = (acc[productName] || 0) + (item.quantity || 1);
                                            return acc;
                                        }, {} as Record<string, number>))
                                            .map(([name, quantity]) => ({ name, quantity: quantity as number }))
                                            .sort((a, b) => b.quantity - a.quantity)
                                            .slice(0, 5)
                                    } layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563', fontWeight: 'bold' }} width={120} />
                                        <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', shadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                        <Bar dataKey="quantity" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={20} />
                                    </ReBarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 animate-slide-in-right">
                    <ul className="divide-y divide-gray-200">
                        {orders.length === 0 && <li className="p-8 text-center text-gray-500">No active orders found.</li>}
                        {orders.map(order => (
                            <li key={order.id} className="p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-lg font-bold text-indigo-600">Order #{order.id}</span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide
                           ${order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === OrderStatus.CONFIRMED ? 'bg-blue-100 text-blue-800' :
                                                        order.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                                        <div className="mt-2 text-sm text-gray-600">
                                            {order.items.length} items | Total: <span className="font-bold">${order.totalAmount}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                        {order.status === OrderStatus.PENDING && (
                                            <>
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, OrderStatus.CONFIRMED)}
                                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors"
                                                >
                                                    Confirm Order
                                                </button>
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, OrderStatus.CANCELLED)}
                                                    className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {order.status === OrderStatus.CONFIRMED && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, OrderStatus.COMPLETED)}
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm transition-colors"
                                            >
                                                Mark Delivered
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Staff Notes</h4>
                                    <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                                        {order.notes.length === 0 && <p className="text-xs text-gray-400 italic">No notes yet.</p>}
                                        {order.notes.map(note => (
                                            <div key={note.id} className="text-xs bg-white p-2 rounded border border-gray-100 group relative">
                                                {editingNoteId === note.id ? (
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            className="flex-1 border border-gray-300 rounded text-xs p-1"
                                                            value={editNoteContent}
                                                            onChange={(e) => setEditNoteContent(e.target.value)}
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                editStaffNote(note.id, editNoteContent);
                                                                setEditingNoteId(null);
                                                            }}
                                                            className="text-indigo-600 font-bold"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingNoteId(null)}
                                                            className="text-gray-400"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="pr-12">
                                                            <span className="font-bold text-gray-700">{note.authorName}:</span> {note.content}
                                                        </div>
                                                        <div className="absolute right-1 top-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingNoteId(note.id);
                                                                    setEditNoteContent(note.content);
                                                                }}
                                                                className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                                            >
                                                                <Edit2 className="h-3 w-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    if (confirm('Delete this note?')) {
                                                                        deleteStaffNote(note.id);
                                                                    }
                                                                }}
                                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="flex-1 border border-gray-300 rounded-md text-xs p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Add internal note..."
                                            value={noteInputs[order.id] || ''}
                                            onChange={(e) => handleNoteChange(order.id, e.target.value)}
                                        />
                                        <button onClick={() => submitNote(order.id)} className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-xs font-bold text-gray-700 transition-colors">Add</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'inventory' && isAdmin && (
                <div className="space-y-4 animate-slide-in-right">
                    <div className="flex justify-end">
                        <button
                            onClick={() => setIsAddingProduct(true)}
                            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg text-sm font-bold transform hover:-translate-y-0.5"
                        >
                            <Plus className="h-4 w-4 mr-2" /> Add New Product
                        </button>
                    </div>
                    <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Image</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Variant</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock Level</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.flatMap(p => p.variants.map(v => ({ ...v, productName: p.name }))).map((variant) => (
                                        <tr key={variant.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium text-gray-900">{variant.productName}</span>
                                                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => {
                                                                const p = products.find(prod => prod.id === variant.productId);
                                                                if (p) handleEditProduct(p);
                                                            }}
                                                            className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                                                            title="Edit Product Details"
                                                        >
                                                            <Edit2 className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduct(variant.productId)}
                                                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                            title="Delete Entire Product"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="h-10 w-10 rounded border border-gray-100 overflow-hidden bg-gray-50">
                                                    <img
                                                        src={variant.imageUrl || products.find(p => p.id === variant.productId)?.imageUrl}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40?text=No+Img')}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <span className="truncate max-w-[150px]">{variant.name}</span>
                                                    <button
                                                        onClick={() => handleEditVariant(variant as any)}
                                                        className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                                                        title="Edit Variant Details"
                                                    >
                                                        <Edit2 className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${variant.stockQuantity < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                    {variant.stockQuantity} Units
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {isAddingProduct && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-modal-pop">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
                            <button onClick={() => setIsAddingProduct(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        value={newProductData.name}
                                        onChange={e => setNewProductData({ ...newProductData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Brand</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        value={newProductData.brand}
                                        onChange={e => setNewProductData({ ...newProductData, brand: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none h-24 transition-all"
                                    value={newProductData.description}
                                    onChange={e => setNewProductData({ ...newProductData, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Product Image URL</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={newProductData.imageUrl}
                                    onChange={e => setNewProductData({ ...newProductData, imageUrl: e.target.value })}
                                />
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-gray-900 text-lg">Product Variants</h4>
                                    <button
                                        onClick={handleAddVariantToForm}
                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <Plus className="h-4 w-4 mr-1" /> Add Variant
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {newProductData.variants.map((variant, index) => (
                                        <div key={index} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 relative group">
                                            {newProductData.variants.length > 1 && (
                                                <button
                                                    onClick={() => handleRemoveVariantFromForm(index)}
                                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            )}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Variant Name</label>
                                                    <input
                                                        type="text"
                                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                        placeholder="e.g. iPhone 15 Pro Max"
                                                        value={variant.name}
                                                        onChange={e => {
                                                            const v = [...newProductData.variants];
                                                            v[index].name = e.target.value;
                                                            setNewProductData({ ...newProductData, variants: v });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Color</label>
                                                    <input
                                                        type="text"
                                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                        value={variant.color}
                                                        onChange={e => {
                                                            const v = [...newProductData.variants];
                                                            v[index].color = e.target.value;
                                                            setNewProductData({ ...newProductData, variants: v });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Capacity</label>
                                                    <input
                                                        type="text"
                                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                        value={variant.capacity}
                                                        onChange={e => {
                                                            const v = [...newProductData.variants];
                                                            v[index].capacity = e.target.value;
                                                            setNewProductData({ ...newProductData, variants: v });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price</label>
                                                    <input
                                                        type="number"
                                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                        value={variant.price}
                                                        onChange={e => {
                                                            const v = [...newProductData.variants];
                                                            v[index].price = Number(e.target.value);
                                                            setNewProductData({ ...newProductData, variants: v });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock Quantity</label>
                                                    <input
                                                        type="number"
                                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                        value={variant.stockQuantity}
                                                        onChange={e => {
                                                            const v = [...newProductData.variants];
                                                            v[index].stockQuantity = Number(e.target.value);
                                                            setNewProductData({ ...newProductData, variants: v });
                                                        }}
                                                    />
                                                </div>
                                                <div className="sm:col-span-2 lg:col-span-1">
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Variant Image URL</label>
                                                    <input
                                                        type="text"
                                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                        value={variant.imageUrl}
                                                        onChange={e => {
                                                            const v = [...newProductData.variants];
                                                            v[index].imageUrl = e.target.value;
                                                            setNewProductData({ ...newProductData, variants: v });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                            <button
                                onClick={() => setIsAddingProduct(false)}
                                className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddProductSubmit}
                                className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-0.5"
                            >
                                Save Product
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'users' && isAdmin && (
                <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 animate-slide-in-right">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Current Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {allUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs mr-3">
                                                    {user.fullName.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{user.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide
                        ${user.role.name === Role.ADMIN ? 'bg-purple-100 text-purple-800' :
                                                    user.role.name === Role.STAFF ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {user.role.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.id !== currentUser?.id ? (
                                                <div className="flex items-center space-x-2">
                                                    <select
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
                                                        value={user.role.name}
                                                        onChange={async (e) => {
                                                            const newRole = e.target.value as Role;
                                                            await updateUserRole(user.id, newRole);
                                                        }}
                                                    >
                                                        <option value={Role.CUSTOMER}>Customer</option>
                                                        <option value={Role.STAFF}>Staff</option>
                                                        <option value={Role.ADMIN}>Admin</option>
                                                    </select>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">(Self)</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {activeTab === 'stock' && isAdmin && (
                <div className="space-y-6 animate-slide-in-right">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.flatMap(p => p.variants.map(v => ({ ...v, productName: p.name, productBrand: p.brand }))).map((variant) => (
                            <div key={variant.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{variant.productName}</h4>
                                        <p className="text-xs text-gray-500">{variant.name} ({variant.color}, {variant.capacity})</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                    ${variant.stockQuantity === 0 ? 'bg-red-100 text-red-700' :
                                            variant.stockQuantity < 5 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                        {variant.stockQuantity === 0 ? 'Out of Stock' :
                                            variant.stockQuantity < 5 ? 'Low Stock' : 'In Stock'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center space-x-3">
                                        <button
                                            disabled={variant.stockQuantity === 0}
                                            onClick={() => handleStockChange(variant, Math.max(0, variant.stockQuantity - 1))}
                                            className={`h-10 w-10 flex items-center justify-center rounded-lg transition-all shadow-sm ${variant.stockQuantity === 0 ? 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed' : 'bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100'}`}
                                        >
                                            <Minus className="h-5 w-5" />
                                        </button>
                                        <div className="flex flex-col items-center min-w-[60px]">
                                            <span className="text-lg font-black text-gray-900">{variant.stockQuantity}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Units</span>
                                        </div>
                                        <button
                                            onClick={() => handleStockChange(variant, variant.stockQuantity + 1)}
                                            className="h-10 w-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-600 hover:border-green-100 transition-all shadow-sm"
                                        >
                                            <Plus className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="h-10 w-px bg-gray-200"></div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleStockChange(variant, variant.stockQuantity + 10)}
                                            className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                                        >
                                            +10
                                        </button>
                                        <button
                                            onClick={() => {
                                                const newStockInput = window.prompt(`Update stock for ${variant.productName} - ${variant.name}:`, variant.stockQuantity.toString());
                                                if (newStockInput !== null) {
                                                    const val = parseInt(newStockInput);
                                                    if (!isNaN(val) && val >= 0) {
                                                        handleStockChange(variant, val);
                                                    }
                                                }
                                            }}
                                            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                                            title="Set custom stock"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {editingProductId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 animate-scale-up">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-900">Edit Product Information</h3>
                            <button
                                onClick={() => setEditingProductId(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="flex justify-center mb-6">
                                <div className="relative group">
                                    <div className="h-40 w-40 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center transition-all group-hover:border-indigo-300">
                                        {editProductData.imageUrl ? (
                                            <img src={editProductData.imageUrl} alt="Preview" className="h-full w-full object-contain" />
                                        ) : (
                                            <div className="text-center p-4">
                                                <Package className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                                                <span className="text-xs text-gray-400 font-medium">No Image URL</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        value={editProductData.name}
                                        onChange={(e) => setEditProductData(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Brand</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        value={editProductData.brand}
                                        onChange={(e) => setEditProductData(prev => ({ ...prev, brand: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
                                <input
                                    type="text"
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                                    value={editProductData.imageUrl}
                                    onChange={(e) => setEditProductData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                />
                                <p className="mt-1 text-[10px] text-gray-400 italic">This will set the primary image for all variants of this product.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-32 resize-none"
                                    value={editProductData.description}
                                    onChange={(e) => setEditProductData(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    value={editProductData.status}
                                    onChange={(e) => setEditProductData(prev => ({ ...prev, status: e.target.value }))}
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="ARCHIVED">Archived</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex gap-3 justify-end bg-gray-50/50">
                            <button
                                onClick={() => setEditingProductId(null)}
                                className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveProduct}
                                className="px-8 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editingVariantId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 animate-scale-up">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-900">Edit Variant Details</h3>
                            <button
                                onClick={() => setEditingVariantId(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="flex justify-center mb-6">
                                <div className="relative group">
                                    <div className="h-40 w-40 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center transition-all group-hover:border-indigo-300">
                                        {editVariantData.imageUrl ? (
                                            <img src={editVariantData.imageUrl} alt="Preview" className="h-full w-full object-contain" />
                                        ) : (
                                            <div className="text-center p-4">
                                                <Image className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                                                <span className="text-xs text-gray-400 font-medium">No Variant Image</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Variant Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        value={editVariantData.name}
                                        onChange={(e) => setEditVariantData(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Price ($)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        value={editVariantData.price}
                                        onChange={(e) => setEditVariantData(prev => ({ ...prev, price: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Color</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        value={editVariantData.color}
                                        onChange={(e) => setEditVariantData(prev => ({ ...prev, color: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Capacity</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        value={editVariantData.capacity}
                                        onChange={(e) => setEditVariantData(prev => ({ ...prev, capacity: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Variant Image URL</label>
                                <input
                                    type="text"
                                    placeholder="https://example.com/variant-image.jpg"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                                    value={editVariantData.imageUrl}
                                    onChange={(e) => setEditVariantData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Stock Quantity</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        value={editVariantData.stockQuantity}
                                        onChange={(e) => setEditVariantData(prev => ({ ...prev, stockQuantity: Number(e.target.value) }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        value={editVariantData.status}
                                        onChange={(e) => setEditVariantData(prev => ({ ...prev, status: e.target.value }))}
                                    >
                                        <option value="IN_STOCK">In Stock</option>
                                        <option value="OUT_OF_STOCK">Out of Stock</option>
                                        <option value="DISCONTINUED">Discontinued</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex gap-3 justify-end bg-gray-50/50">
                            <button
                                onClick={() => setEditingVariantId(null)}
                                className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveVariant}
                                className="px-8 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
