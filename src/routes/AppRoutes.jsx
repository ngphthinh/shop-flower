import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import Cart from "../pages/Cart/Cart";
import Category from "../pages/Category/Category";
import Search from "../pages/Search/Search";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Profile from "../pages/Profile/Profile";
import Checkout from "../pages/Checkout/Checkout";
import Orders from "../pages/Orders/Orders";
import OrderDetail from "../pages/Orders/OrderDetail";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import AdminSupport from "../pages/AdminSupport/AdminSupport";
import StatisticsDetail from "../pages/Statistics/StatisticsDetail";
import ProductManagement from "../pages/AdminDashboard/ProductManagement";
import OrderManagement from "../pages/AdminDashboard/OrderManagement";
import UserManagement from "../pages/AdminDashboard/UserManagement";
import NotFound from "../pages/NotFound/NotFound";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import { PATH } from "./path";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<MainLayout />}>
        <Route path={PATH.home} element={<Home />} />
        <Route path={PATH.productDetail} element={<ProductDetail />} />
        <Route path={PATH.category} element={<Category />} />
        <Route path={PATH.search} element={<Search />} />
        <Route path={PATH.login} element={<Login />} />
        <Route path={PATH.register} element={<Register />} />
      </Route>

      {/* Private routes - Require authentication */}
      <Route element={<MainLayout />}>
        <Route
          path={PATH.cart}
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path={PATH.checkout}
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route
          path={PATH.orders}
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path={PATH.orderDetail}
          element={
            <PrivateRoute>
              <OrderDetail />
            </PrivateRoute>
          }
        />
        <Route
          path={PATH.profile}
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Admin routes - Require admin role */}
      <Route element={<MainLayout />}>
        <Route
          path={PATH.adminDashboard}
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path={PATH.adminSupport}
          element={
            <AdminRoute>
              <AdminSupport />
            </AdminRoute>
          }
        />
        <Route
          path={PATH.adminProducts}
          element={
            <AdminRoute>
              <ProductManagement />
            </AdminRoute>
          }
        />
        <Route
          path={PATH.adminOrders}
          element={
            <AdminRoute>
              <OrderManagement />
            </AdminRoute>
          }
        />
        <Route
          path={PATH.adminUsers}
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
        <Route
          path={PATH.statisticsDetail}
          element={
            <AdminRoute>
              <StatisticsDetail />
            </AdminRoute>
          }
        />
      </Route>

      {/* 404 routes */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
