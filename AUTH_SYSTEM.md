# 🔐 Authentication & Authorization System

## 📋 Overview

This document describes the complete **Authentication + Authorization** system built for the flower shop e-commerce application using **React + Redux Toolkit + React Router DOM**.

---

## ✅ Features Implemented

### 1. Authentication
- ✅ Login with email + password
- ✅ Mock JWT token generation  
- ✅ Redux Toolkit state management (`authSlice`)
- ✅ Persistent storage using localStorage
- ✅ Auto-restore auth state on app reload
- ✅ Logout functionality

### 2. Authorization (Roles)
- ✅ Two role system: `USER` and `ADMIN`
- ✅ USER permissions: view products, add to cart, checkout, view orders
- ✅ ADMIN permissions: all USER permissions + admin dashboard + product/order management

### 3. Protected Routes
- ✅ `PrivateRoute` component - redirects to `/login` if not authenticated
- ✅ `AdminRoute` component - redirects to `/` if not admin

### 4. UI Features
- ✅ Navbar shows login/register links for unauthenticated users
- ✅ Navbar shows username + logout button for authenticated users
- ✅ Admin badge in navbar when logged in as admin
- ✅ Admin menu item visible only for admins
- ✅ Orders menu item visible only for authenticated users
- ✅ Protected cart, checkout, and orders pages
- ✅ Toast notifications for auth errors

---

## 📁 Project Structure

```
src/
├── redux/
│   ├── slices/
│   │   ├── authSlice.js          ← Auth state & actions
│   │   ├── cartSlice.js
│   │   └── productSlice.js
│   └── store.js                   ← Includes auth reducer
├── routes/
│   ├── AppRoutes.jsx              ← All routes with protection
│   ├── PrivateRoute.jsx           ← Route guard for users
│   ├── AdminRoute.jsx             ← Route guard for admins
│   └── path.js                    ← Route constants
├── pages/
│   ├── Login/
│   │   ├── Login.jsx              ← Login form
│   │   └── Login.css
│   ├── Register/
│   │   ├── Register.jsx           ← Registration form
│   │   └── Register.css
│   ├── Cart/
│   │   └── Cart.jsx               ← Protected (PrivateRoute)
│   ├── Checkout/
│   │   ├── Checkout.jsx           ← Protected (PrivateRoute)
│   │   └── Checkout.css
│   ├── Orders/
│   │   ├── Orders.jsx             ← Protected (PrivateRoute)
│   │   └── Orders.css
│   ├── AdminDashboard/
│   │   ├── AdminDashboard.jsx     ← Protected (AdminRoute)
│   │   └── AdminDashboard.css
│   └── ProductDetail/
│       └── ProductDetail.jsx      ← Auth check before add-to-cart
├── components/
│   ├── Navbar.jsx                 ← Shows auth UI
│   └── Navbar.css                 ← Auth styling
├── App.jsx                         ← Restores auth on mount
└── main.jsx
```

---

## 🔑 Mock Credentials

Test the auth system using these mock accounts:

| Email | Password | Role |
|-------|----------|------|
| admin@gmail.com | 123456 | ADMIN |
| user@gmail.com | 123456 | USER |

---

## 🏗️ Redux Auth State Structure

### State
```javascript
{
  user: {
    email: string,
    name: string
  },
  token: string,           // JWT token (simulated)
  role: "USER" | "ADMIN",
  isAuthenticated: boolean
}
```

### Actions
- `login({ user, token, role })` - Set user, token, role on login
- `logout()` - Clear auth state and localStorage
- `setUser({ user, token, role })` - Update user info
- `restoreAuth({ user, token, role })` - Restore from localStorage on app load

---

## 🛣️ Route Configuration

### Public Routes
- `/` - Home (public, visible to all)
- `/product/:id` - Product detail (public, add-to-cart requires auth)
- `/login` - Login page (public)
- `/register` - Register page (public)

### Protected Routes (Requires Authentication)
- `/cart` - User's shopping cart
- `/checkout` - Order checkout
- `/orders` - User's order history

### Admin Routes (Requires Admin Role)
- `/admin/dashboard` - Admin dashboard

### Error Routes
- `/404` - Not found page
- Catch-all redirects to `/404`

---

## 🔄 Authentication Flow

### Login Flow
1. User enters email + password
2. Mock API validates credentials
3. JWT token simulated (JWT format)
4. Redux `login` action stores user + token + role
5. localStorage saves auth data
6. Redirect to home page
7. Navbar updates to show username + logout

### Persistence Flow
1. App mounts
2. App.jsx checks localStorage for "auth" key
3. If found → Redux `restoreAuth` action restores state
4. User stays logged in without re-entering credentials
5. Navbar reflects authenticated state

### Logout Flow
1. User clicks logout button in navbar
2. Redux `logout` action clears state
3. localStorage "auth" key removed
4. Redirect to home page
5. Navbar shows login/register links

### Protected Route Flow
1. User tries to access `/cart` without logging in
2. PrivateRoute checks `isAuthenticated`
3. If false → redirect to `/login`
4. Same logic for AdminRoute (checks `role === "ADMIN"`)

---

## 🎨 UI Components

### Navbar Authentication UI
- **Logged Out**:  
  `Đăng nhập | Đăng ký`

- **Logged In (USER)**:  
  `👤 John Doe | [Logout]`

- **Logged In (ADMIN)**:  
  `👤 Admin User | [Admin Badge] | [Logout]`

### Protected Components
- **Add to Cart Button** (ProductDetail):
  - Checks `isAuthenticated`
  - If false → Shows toast: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng"
  - Redirects to login

- **Checkout Button** (Cart):
  - Only visible if authenticated (via PrivateRoute)
  - Links to `/checkout`

---

## 🔒 Authorization Rules

### USER Role
✅ Can view home page  
✅ Can view product details  
✅ Can add to cart  
✅ Can access `/cart`  
✅ Can access `/checkout`  
✅ Can view `/orders`  
❌ Cannot access `/admin/*`  

### ADMIN Role
✅ All USER permissions  
✅ Can access `/admin/dashboard`  
✅ Can see "Admin" menu item in navbar  
✅ Can see "Admin" badge in navbar  

---

## 🧪 Testing the System

### Test 1: Unauthenticated User
1. Go to http://localhost:5174/
2. Try accessing `/cart` → redirects to `/login` ✅
3. Try accessing `/orders` → redirects to `/login` ✅
4. Try accessing `/admin/dashboard` → redirects to `/login` then `/` ✅

### Test 2: User Login
1. Go to `/login`
2. Enter `user@gmail.com` / `123456`
3. Click "Đăng Nhập"
4. Toast shows "Đăng nhập thành công!"
5. Navbar shows "John Doe" + logout button ✅
6. Can now access `/cart`, `/orders`
7. Cannot access `/admin/dashboard` → redirected to `/` ✅

### Test 3: Admin Login
1. Go to `/login`
2. Enter `admin@gmail.com` / `123456`
3. Click "Đăng Nhập"
4. Navbar shows "Admin User" + "Admin" badge + logout button ✅
5. Can access `/admin/dashboard` ✅
6. Navbar menu shows "Admin" link ✅

### Test 4: Persistence
1. Login as user
2. Refresh the page (F5)
3. User should still be logged in ✅
4. Navbar still shows username
5. Close and reopen browser → should still remember login

### Test 5: Add to Cart Protection
1. Logout or use incognito
2. Go to any product detail page
3. Try clicking "Thêm vào giỏ hàng"
4. Toast shows: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng" ✅
5. Redirects to `/login` ✅

### Test 6: Logout
1. Login as admin
2. Click logout button
3. Redirects to `/` ✅
4. Navbar shows login/register links ✅
5. Refresh the page → must login again (localStorage cleared) ✅

---

## 🚀 Next Steps

### Phase 2: Backend Integration
- Replace mock authentication with real API
- Implement JWT token management
- Add refresh token logic
- Add role-based API endpoint access

### Phase 3: Enhanced Features
- Two-factor authentication (2FA)
- Social login (Google, Facebook)
- Password reset functionality
- Email verification
- OAuth2 integration

### Phase 4: Admin Features
- Product CRUD operations
- Order management system
- User management
- Analytics dashboard
- Revenue reports

---

## 📚 Code Examples

### Using Auth State in Components

```javascript
import { useSelector } from "react-redux";

function MyComponent() {
  const { isAuthenticated, user, role } = useSelector(state => state.auth);
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  if (role === "ADMIN") {
    return <AdminPanel />;
  }
  
  return <UserDashboard />;
}
```

### Dispatching Auth Actions

```javascript
import { useDispatch } from "react-redux";
import { login, logout } from "../redux/slices/authSlice";

function LoginForm() {
  const dispatch = useDispatch();
  
  const handleLogin = (email, password) => {
    dispatch(login({
      user: { email, name: "John Doe" },
      token: "jwt_token_...",
      role: "USER"
    }));
  };
  
  const handleLogout = () => {
    dispatch(logout());
  };
}
```

---

## 🐛 Troubleshooting

### Issue: User not persisting after refresh
**Solution**: Check browser's localStorage is enabled. Clear localStorage and re-login.

### Issue: Redirect loops between routes
**Solution**: Ensure PrivateRoute/AdminRoute are properly wrapped around target components in AppRoutes.

### Issue: Add to cart shows error but doesn't redirect
**Solution**: Check isAuthenticated state in Redux DevTools. Ensure ProductDetail is checking auth state.

---

## 📞 Support

For questions or issues with the authentication system, refer to:
- Redux authSlice: `src/redux/slices/authSlice.js`
- Route protection: `src/routes/PrivateRoute.jsx` & `AdminRoute.jsx`
- App initialization: `src/App.jsx`

