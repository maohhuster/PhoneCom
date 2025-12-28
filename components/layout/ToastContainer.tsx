import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
    const { notifications } = useAppContext();

    if (notifications.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col space-y-3 pointer-events-none">
            {notifications.map(n => (
                <div
                    key={n.id}
                    className={`pointer-events-auto px-6 py-4 rounded-xl shadow-2xl text-white flex items-center space-x-3 transform transition-all duration-300 animate-slide-in-right border border-white/10 backdrop-blur-md
            ${n.type === 'error' ? 'bg-red-500/90' : 'bg-green-500/90'}`}
                >
                    {n.type === 'error' ? <AlertCircle size={20} className="text-white" /> : <CheckCircle size={20} className="text-white" />}
                    <span className="font-medium text-sm">{n.message}</span>
                </div>
            ))}
        </div>
    );
};
