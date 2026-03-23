# API Usage Guide

## Overview

Dự án đã được cấu hình để sử dụng `useFetch` hook và axios API instance có sẵn. Tất cả các API request đều đi qua một layer tập trung để xử lý authentication, caching, retry logic và error handling.

## 1. Cấu trúc API

### Files chính:

- **`src/services/api.js`** - Axios instance với interceptors
- **`src/hooks/useFetch.js`** - Hook để fetch dữ liệu
- **`src/services/productService.js`** - Các hàm liên quan sản phẩm
- **`src/services/authService.js`** - Các hàm liên quan authentication
- **`src/services/userService.js`** - Các hàm liên quan user/order

## 2. Sử dụng useFetch Hook

### Cơ bản:

```jsx
import { useFetch } from "../../hooks/useFetch";

function ProductPage() {
  const { data: products, loading, error, refetch } = useFetch("products.json");

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div>
      {products?.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
      <button onClick={refetch}>Tải lại</button>
    </div>
  );
}
```

### Với parameters:

```jsx
const { data, loading, error } = useFetch("/api/products", {
  params: { category: "flowers", limit: 10 },
});
```

### Với custom headers:

```jsx
const { data, loading, error } = useFetch("/api/protected-data", {
  headers: { "X-Custom-Header": "value" },
});
```

### Tắt auto-fetch:

```jsx
const { data, loading, error, refetch } = useFetch("/api/data", {
  enabled: false, // Không auto-fetch
});

// Gọi refetch khi cần
useEffect(() => {
  if (someCondition) {
    refetch();
  }
}, [someCondition, refetch]);
```

### Tùy chỉnh cache:

```jsx
const { data, loading, error } = useFetch("/api/data", {
  useCache: true,        // Bật cache (mặc định: true)
  cacheTime: 10 * 60 * 1000, // Cache 10 phút
});
```

### Retry logic:

```jsx
const { data, loading, error } = useFetch("/api/data", {
  retryCount: 5,        // Số lần retry (mặc định: 3)
  retryDelay: 2000,     // Delay giữa retry (ms, mặc định: 1000)
});
```

## 3. Sử dụng Services

### Product Service:

```jsx
import { productService } from "../../services/productService";

// Lấy tất cả sản phẩm
const products = await productService.getProducts();

// Lấy sản phẩm theo ID
const product = await productService.getProductById(id);

// Tìm kiếm sản phẩm
const results = await productService.searchProducts("hoa hồng");

// Lấy sản phẩm theo danh mục
const categoryProducts = await productService.getProductsByCategory(categoryId);
```

### Auth Service:

```jsx
import { authService } from "../../services/authService";

// Đăng nhập
const { token, user } = await authService.login("email@test.com", "password");

// Đăng xuất
await authService.logout();

// Đăng ký
await authService.register({
  email: "new@test.com",
  password: "password",
  name: "User Name",
});

// Lấy user hiện tại
const currentUser = await authService.getCurrentUser();

// Kiểm tra đã login
if (authService.isAuthenticated()) {
  // User đã login
}
```

### User Service:

```jsx
import { userService } from "../../services/userService";

// Lấy profile
const profile = await userService.getProfile();

// Cập nhật profile
await userService.updateProfile({ name: "New Name", phone: "123456" });

// Lấy danh sách đơn hàng
const orders = await userService.getOrders();

// Lấy chi tiết đơn hàng
const order = await userService.getOrder(orderId);

// Tạo đơn hàng
const newOrder = await userService.createOrder({
  products: [{ id: 1, quantity: 2 }],
  shippingAddress: "...",
});

// Hủy đơn hàng
await userService.cancelOrder(orderId);
```

## 4. Features

### Auto Token Management
- Token được tự động thêm vào mọi request từ localStorage
- Nếu nhận response 401, tự động quay về trang login

### Request Cancellation
- Nếu component unmount trước khi request hoàn tất, request sẽ bị cancel
- Tránh memory leak

### Caching
- Dữ liệu được cache 5 phút (có thể tuỳ chỉnh)
- Tự động xóa cache khi hết hạn
- `refetch()` sẽ xóa cache và lấy dữ liệu mới

### Retry Logic
- Tự động retry 3 lần nếu request thất bại
- Sử dụng exponential backoff: 1s → 2s → 4s
- Có thể tuỳ chỉnh số lần retry và delay

### Error Handling
- Lỗi từ API được trích xuất message
- Bỏ qua lỗi từ request cancellation
- Toast hoặc error boundary có thể sử dụng error state

## 5. Best Practices

### ✅ DO:

```jsx
// Sử dụng useFetch trong component
function ProductList() {
  const { data, loading, error, refetch } = useFetch("products.json");
  
  return (
    <div>
      {loading && <Spinner />}
      {error && <ErrorAlert message={error} onRetry={refetch} />}
      {data && <Products list={data} />}
    </div>
  );
}
```

```jsx
// Sử dụng service methods trực tiếp khi cần xử lý logic phức tạp
async function handleLogin(email, password) {
  try {
    const { token, user } = await authService.login(email, password);
    dispatch(setAuth(user));
  } catch (error) {
    toast.error(error.message);
  }
}
```

### ❌ DON'T:

```jsx
// Không call API trực tiếp từ component mà không hook
fetch("products.json")
  .then((res) => res.json())
  .then((data) => setProducts(data));
```

```jsx
// Không bypass interceptors bằng cách import axios trực tiếp
import axios from "axios";
axios.get("/api/data"); // ❌ Sẽ không có interceptors
```

## 6. Redux Integration

Nếu cần sync data với Redux:

```jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useFetch } from "../../hooks/useFetch";
import { setProducts } from "../../redux/slices/productSlice";

function ProductLoader() {
  const dispatch = useDispatch();
  const { data } = useFetch("products.json");

  useEffect(() => {
    if (data) {
      dispatch(setProducts(data));
    }
  }, [data, dispatch]);

  return null;
}
```

## 7. Error Handling

```jsx
function Component() {
  const { data, loading, error, refetch } = useFetch("/api/data");

  if (error) {
    return (
      <div className="alert alert-danger">
        <p>{error}</p>
        <button onClick={refetch} className="btn btn-sm btn-primary">
          Thử lại
        </button>
      </div>
    );
  }

  return <div>{/* ... */}</div>;
}
```

## 8. API Endpoints (Example)

Ứng dụng hiện tại hỗ trợ các endpoint sau (cần backend implementation):

### Products:
- `GET /products.json` - Lấy danh sách sản phẩm (local)
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `GET /api/products/search` - Tìm kiếm sản phẩm
- `GET /api/products/category/:categoryId` - Lấy sản phẩm theo danh mục

### Auth:
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/register` - Đăng ký
- `GET /api/auth/me` - Lấy thông tin hiện tại

### Users:
- `GET /api/users/profile` - Lấy profile
- `PUT /api/users/profile` - Cập nhật profile
- `GET /api/users/orders` - Lấy danh sách đơn hàng
- `GET /api/users/orders/:id` - Lấy chi tiết đơn hàng
- `POST /api/users/orders` - Tạo đơn hàng
- `POST /api/users/orders/:id/cancel` - Hủy đơn hàng

---

**Tất cả requests được tự động sync và xử lý tập trung!**
