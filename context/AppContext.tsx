import React, { useState, useEffect, useContext, createContext, useMemo } from 'react';
import {
    Role, OrderStatus, Product, User, CartItem, Order,
    Address, Variant
} from '../types';
import { api } from '../api';

export interface Notification {
    message: string;
    type: 'success' | 'error';
    id: number;
}

export interface AppState {
    currentUser: User | null;
    allUsers: User[];
    products: Product[];
    cart: CartItem[];
    orders: Order[];
    view: string;
    currentProduct: Product | null;
    notifications: Notification[];
}

export interface AppContextType extends AppState {
    login: (email: string, role?: Role) => void;
    register: (fullName: string, email: string, password: string) => void;
    logout: () => void;
    addToCart: (variant: Variant, product: Product) => void;
    removeFromCart: (itemId: string) => void;
    updateCartQty: (itemId: string, delta: number) => void;
    placeOrder: (shippingAddress: Address) => void;
    updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
    setView: (view: string) => void;
    setCurrentProduct: (product: Product | null) => void;
    addStaffNote: (orderId: string, noteContent: string) => void;
    editStaffNote: (noteId: string, content: string) => void;
    deleteStaffNote: (noteId: string) => void;
    updateInventory: (variantId: string, newStock: number) => void;
    updateUserRole: (userId: string, newRole: Role) => Promise<void>;
    updateProduct: (productId: string, data: any) => Promise<void>;
    updateVariant: (variantId: string, data: any) => Promise<void>;
    addProduct: (productData: any) => Promise<void>;
    deleteProduct: (productId: string) => Promise<void>;
    showNotification: (message: string, type?: 'success' | 'error') => void;
    addAddress: (addressData: Omit<Address, 'id' | 'isDefault' | 'userId'>) => Promise<void>;
    updateAddress: (id: string, addressData: Partial<Address>) => Promise<void>;
    deleteAddress: (id: string) => Promise<void>;
    setDefaultAddress: (id: string) => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [view, setView] = useState('home');
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Initial Data Fetching
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [productsData, usersData] = await Promise.all([
                api.products.getAll(),
                api.users.getAll().catch(() => []) // Catch if auth fails/admin only
            ]);
            setProducts(productsData);
            setAllUsers(usersData);
        } catch (error) {
            console.error("Failed to load data:", error);
        }
    };

    // Reload user data when current user changes (e.g., after login)
    useEffect(() => {
        if (currentUser) {
            loadUserData(currentUser.id);
        } else {
            setCart([]);
            setOrders([]);
        }
    }, [currentUser?.id]);

    const loadUserData = async (userId: string) => {
        try {
            const [cartData, ordersData, userData] = await Promise.all([
                api.users.getCart(userId),
                api.users.getOrders(userId),
                api.users.getById(userId)
            ]);
            setCart(cartData);
            setOrders(ordersData);
            // Update current user details (e.g. addresses)
            setCurrentUser(userData);
        } catch (error) {
            console.error("Failed to load user data", error);
        }
    };

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { message, type, id }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    const login = async (email: string, role?: Role) => {
        try {
            const users = await api.users.getAll();
            setAllUsers(users); // Refresh users list

            const user = users.find(u => u.email === email && (!role || u.role.name === role));

            if (user) {
                setCurrentUser(user);
                if (user.role.name === Role.CUSTOMER) {
                    setView('home');
                } else if (user.role.name === Role.ADMIN) {
                    setView('admin-dashboard');
                } else {
                    setView('dashboard');
                }
                showNotification(`Welcome back, ${user.fullName}`);
                loadUserData(user.id);
            } else {
                showNotification("Invalid credentials or user not found", "error");
            }
        } catch (error) {
            showNotification("Login failed", "error");
        }
    };

    const register = async (fullName: string, email: string, password: string) => {
        try {
            const newUser = await api.users.create({ fullName, email, role: Role.CUSTOMER });
            setAllUsers(prev => [...prev, newUser]);
            setCurrentUser(newUser);

            setView('home');

            showNotification(`Welcome, ${fullName}! Account created successfully.`);
        } catch (error: any) {
            showNotification(error.message || "Registration failed", "error");
        }
    };

    const logout = () => {
        setCurrentUser(null);
        setCart([]);
        setOrders([]);
        setView('home');
        showNotification("Logged out successfully");
    };

    const addToCart = async (variant: Variant, product: Product) => {
        if (!currentUser) return;
        try {
            await api.cart.add(currentUser.id, variant.id, 1);
            await loadUserData(currentUser.id); // Refresh cart
            showNotification(`Added ${product.name} to cart`);
        } catch (error: any) {
            showNotification(error.message || "Failed to add to cart", "error");
        }
    };

    const removeFromCart = async (itemId: string) => {
        if (!currentUser) return;
        try {
            await api.cart.remove(itemId);
            await loadUserData(currentUser.id); // Refresh
            showNotification("Item removed from cart");
        } catch (error) {
            showNotification("Failed to remove item", "error");
        }
    };

    const updateCartQty = async (itemId: string, delta: number) => {
        if (!currentUser) return;
        const item = cart.find(c => c.id === itemId);
        if (!item) return;

        const newQty = item.quantity + delta;
        if (newQty < 1) return; // Or trigger remove?

        try {
            await api.cart.updateQty(itemId, newQty);
            await loadUserData(currentUser.id); // Refresh
        } catch (error: any) {
            showNotification(error.message || "Failed to update quantity", "error");
        }
    };

    const placeOrder = async (shippingAddress: Address) => {
        if (!currentUser) return;
        try {
            const formattedAddress = `${shippingAddress.recipientName}, ${shippingAddress.phoneNumber}, ${shippingAddress.line1}, ${shippingAddress.ward}, ${shippingAddress.district}, ${shippingAddress.province}`;
            await api.orders.create(currentUser.id, formattedAddress);

            await loadUserData(currentUser.id); // Refresh cart and orders
            setView('orders');
            showNotification('Order placed successfully!');
        } catch (error: any) {
            showNotification(error.message || "Failed to place order", "error");
        }
    };

    const updateOrderStatus = async (orderId: string, status: OrderStatus, noteContent?: string) => {
        try {
            await api.orders.updateStatus(orderId, status);
            if (noteContent && currentUser) {
                await api.staffNotes.create(orderId, currentUser.id, noteContent);
            }

            if (currentUser?.role.name === Role.STAFF || currentUser?.role.name === Role.ADMIN) {
                const allOrders = await api.orders.getAll();
                setOrders(allOrders);
                const updatedProducts = await api.products.getAll();
                setProducts(updatedProducts);
            } else {
                if (currentUser) loadUserData(currentUser.id);
            }

            showNotification(`Order status updated to ${status}`);
        } catch (error: any) {
            showNotification(error.message || "Failed to update status", "error");
        }
    };

    const addStaffNote = async (orderId: string, noteContent: string) => {
        if (!currentUser) return;
        try {
            await api.staffNotes.create(orderId, currentUser.id, noteContent);
            if (currentUser.role.name === Role.STAFF || currentUser.role.name === Role.ADMIN) {
                const allOrders = await api.orders.getAll();
                setOrders(allOrders);
            } else {
                if (currentUser) loadUserData(currentUser.id);
            }
            showNotification('Note added');
        } catch (error) {
            showNotification("Failed to add note", "error");
        }
    };

    const editStaffNote = async (noteId: string, content: string) => {
        try {
            await api.staffNotes.update(noteId, content);
            if (currentUser?.role.name === Role.STAFF || currentUser?.role.name === Role.ADMIN) {
                const allOrders = await api.orders.getAll();
                setOrders(allOrders);
            } else {
                if (currentUser) loadUserData(currentUser.id);
            }
            showNotification('Note updated');
        } catch (error) {
            showNotification("Failed to update note", "error");
        }
    };

    const deleteStaffNote = async (noteId: string) => {
        try {
            await api.staffNotes.delete(noteId);
            if (currentUser?.role.name === Role.STAFF || currentUser?.role.name === Role.ADMIN) {
                const allOrders = await api.orders.getAll();
                setOrders(allOrders);
            } else {
                if (currentUser) loadUserData(currentUser.id);
            }
            showNotification('Note deleted');
        } catch (error) {
            showNotification("Failed to delete note", "error");
        }
    };

    const updateInventory = async (variantId: string, newStock: number) => {
        try {
            await api.variants.update(variantId, { stockQuantity: newStock });
            const updatedProducts = await api.products.getAll();
            setProducts(updatedProducts);
            showNotification('Inventory updated');
        } catch (error) {
            showNotification("Failed to update inventory", "error");
        }
    };

    const updateVariant = async (variantId: string, data: any) => {
        try {
            await api.variants.update(variantId, data);
            const updatedProducts = await api.products.getAll();
            setProducts(updatedProducts);
            showNotification('Variant updated');
        } catch (error) {
            showNotification("Failed to update variant", "error");
        }
    };

    const updateProduct = async (productId: string, data: any) => {
        try {
            await api.products.update(productId, data);
            const updatedProducts = await api.products.getAll();
            setProducts(updatedProducts);
            showNotification('Product updated successfully');
        } catch (error) {
            showNotification("Failed to update product", "error");
        }
    };

    const addProduct = async (productData: any) => {
        try {
            const newProduct = await api.products.create(productData);
            setProducts(prev => [newProduct, ...prev]);
            showNotification('Product added successfully', 'success');
        } catch (error: any) {
            showNotification(error.message || "Failed to add product", "error");
        }
    };

    const deleteProduct = async (productId: string) => {
        try {
            await api.products.delete(productId);
            setProducts(prev => prev.filter(p => p.id !== productId));
            showNotification('Product deleted successfully', 'success');
        } catch (error: any) {
            showNotification(error.message || "Failed to delete product", "error");
        }
    };

    const addAddress = async (addressData: Omit<Address, 'id' | 'isDefault' | 'userId'>) => {
        if (!currentUser) return;
        try {
            await api.addresses.create({
                ...addressData,
                userId: currentUser.id,
                isDefault: (currentUser.addresses?.length ?? 0) === 0
            });
            const user = await api.users.getById(currentUser.id);
            setCurrentUser(user);
            showNotification("Address added successfully", "success");
        } catch (error: any) {
            showNotification(error.message || "Failed to add address", "error");
        }
    };

    const updateAddress = async (id: string, addressData: Partial<Address>) => {
        if (!currentUser) return;
        try {
            await api.addresses.update(id, addressData);
            const user = await api.users.getById(currentUser.id);
            setCurrentUser(user);
            showNotification("Address updated successfully", "success");
        } catch (error: any) {
            showNotification(error.message || "Failed to update address", "error");
        }
    };

    const deleteAddress = async (id: string) => {
        if (!currentUser) return;
        try {
            await api.addresses.delete(id);
            const user = await api.users.getById(currentUser.id);
            setCurrentUser(user);
            showNotification("Address deleted successfully", "success");
        } catch (error: any) {
            showNotification(error.message || "Failed to delete address", "error");
        }
    };

    const setDefaultAddress = async (id: string) => {
        if (!currentUser) return;
        try {
            await api.addresses.setDefault(id);
            const user = await api.users.getById(currentUser.id);
            setCurrentUser(user);
            showNotification("Default address updated successfully", "success");
        } catch (error: any) {
            showNotification(error.message || "Failed to set default address", "error");
        }
    };

    const updateUserRole = async (userId: string, newRole: Role) => {
        try {
            const updatedUser = await api.users.update(userId, { role: newRole });
            setAllUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
            showNotification(`Role updated to ${newRole}`);
        } catch (error: any) {
            showNotification(error.message || "Failed to update role", "error");
        }
    };

    useEffect(() => {
        if ((view === 'dashboard' || view === 'admin-dashboard' || view === 'orders')) {
            if (currentUser?.role.name === Role.STAFF || currentUser?.role.name === Role.ADMIN) {
                api.orders.getAll().then(setOrders).catch(console.error);
                if (currentUser?.role.name === Role.ADMIN) {
                    api.users.getAll().then(setAllUsers).catch(console.error);
                }
            }
        }
    }, [view, currentUser]);

    return (
        <AppContext.Provider value={{
            currentUser, allUsers, products, cart, orders, view, currentProduct, notifications,
            login, register, logout, addToCart, removeFromCart, updateCartQty, placeOrder,
            updateOrderStatus, setView, setCurrentProduct, addStaffNote, editStaffNote, deleteStaffNote, updateInventory, showNotification, addAddress, updateAddress, deleteAddress, setDefaultAddress, updateUserRole, updateProduct, updateVariant, addProduct, deleteProduct
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be used within AppProvider");
    return context;
};
