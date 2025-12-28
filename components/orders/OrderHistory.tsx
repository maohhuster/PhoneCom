import React from 'react';
import { ClipboardList } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { OrderStatus } from '../../types';

export const OrderHistory: React.FC = () => {
    const { orders, currentUser, updateOrderStatus } = useAppContext();
    const myOrders = orders.filter(o => o.userId === currentUser?.id);

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case OrderStatus.CONFIRMED: return 'bg-blue-100 text-blue-800 border-blue-200';
            case OrderStatus.COMPLETED: return 'bg-green-100 text-green-800 border-green-200';
            case OrderStatus.CANCELLED: return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatAddress = (addr: any) => {
        if (typeof addr === 'string') return addr;
        if (typeof addr === 'object' && addr !== null) {
            const { recipientName, phoneNumber, line1, ward, district, province } = addr;
            return [recipientName, phoneNumber, line1, ward, district, province].filter(Boolean).join(', ');
        }
        return 'Unknown Address';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Orders</h1>
            {myOrders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <ClipboardList className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-4 text-lg text-gray-500">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {myOrders.map(order => (
                        <div key={order.id} className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100 transition-shadow hover:shadow-lg">
                            <div className="px-6 py-5 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>

                                {order.status === OrderStatus.PENDING && (
                                    <button
                                        onClick={() => updateOrderStatus(order.id, OrderStatus.CANCELLED)}
                                        className="text-sm font-medium text-red-600 hover:text-red-800 bg-white border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                            <div className="px-6 py-6">
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Items</h4>
                                        <ul className="divide-y divide-gray-100">
                                            {order.items.map(item => (
                                                <li key={item.id} className="py-3 flex justify-between">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 bg-gray-100 rounded-md mr-3"></div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                                                            <p className="text-xs text-gray-500">{item.variantName} x {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-900">${item.price * item.quantity}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="md:w-1/3 bg-gray-50 rounded-xl p-5">
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Summary</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Subtotal</span>
                                                <span className="font-medium">${order.totalAmount}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Shipping</span>
                                                <span className="font-medium">$0</span>
                                            </div>
                                            <div className="flex justify-between text-base pt-3 border-t border-gray-200">
                                                <span className="font-bold text-gray-900">Total</span>
                                                <span className="font-bold text-indigo-600">${order.totalAmount}</span>
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-gray-200">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Shipping To</h4>
                                            <p className="text-sm text-gray-700">{formatAddress(order.shippingAddress)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
