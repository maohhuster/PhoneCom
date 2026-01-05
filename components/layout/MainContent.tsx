import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Header } from './Header';
import { ProductList } from '../home/ProductList';
import { ProductDetail } from '../product/ProductDetail';
import { CartView } from '../cart/CartView';
import { CheckoutView } from '../cart/CheckoutView';
import { OrderHistory } from '../orders/OrderHistory';
import { StaffDashboard } from '../admin/StaffDashboard';
import { LoginView } from '../auth/LoginView';
import { RegisterView } from '../auth/RegisterView';
import AddressManagement from '../address/AddressManagement';

export const MainContent: React.FC = () => {
    const { view } = useAppContext();

    return (
        <>
            <Header />
            <main className="pb-16">
                {view === 'home' && <ProductList />}
                {view === 'product-detail' && <ProductDetail />}
                {view === 'cart' && <CartView />}
                {view === 'checkout' && <CheckoutView />}
                {view === 'orders' && <OrderHistory />}
                {view === 'addresses' && <AddressManagement />}
                {view === 'dashboard' && <StaffDashboard />}
                {view === 'admin-dashboard' && <StaffDashboard />}
                {view === 'login' && <LoginView />}
                {view === 'register' && <RegisterView />}
            </main>
        </>
    );
};
