import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Auth Protection Component
import ProtectedRoute from './components/ProtectedRoute';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Customer Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import TrackOrder from './pages/TrackOrder';
import Login from './pages/Login';
import Register from './pages/Register';

// Dedicated Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-stone-900 font-sans">
            <Routes>
              {/* 1. Customer Authentication Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* 2. Dedicated Owner Admin Authentication */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* 3. Dedicated Owner Admin Portal (Completely isolated from customer layout) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="customers" element={<AdminCustomers />} />
              </Route>

              {/* 4. Customer Storefront (Requires Customer Login to browse & purchase) */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="flex-1 flex flex-col min-h-screen">
                      <Navbar />
                      <div className="flex-1">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/shop" element={<Shop />} />
                          <Route path="/product/:id" element={<ProductDetail />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/order-success/:orderNumber" element={<OrderSuccess />} />
                          <Route path="/your-orders" element={<MyOrders />} />
                          <Route path="/my-orders" element={<MyOrders />} />
                          <Route path="/track" element={<TrackOrder />} />

                          {/* Fallback */}
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </div>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  );
}
