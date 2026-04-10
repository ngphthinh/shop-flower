# Cấu trúc thư mục dự án
```
src/
│
├── assets/                 # Tài nguyên tĩnh
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   └── styles/
│       ├── global.css
│       └── variables.css
│
├── components/             # Component dùng chung toàn app
│   ├── Button/
│   │   └── Button.jsx
│   ├── Modal/
│   ├── Loader/
│   └── Header/
│
├── layouts/                # Khung giao diện
│   ├── MainLayout.jsx
│   ├── AuthLayout.jsx
│   └── AdminLayout.jsx
│
├── pages/                  # Các trang (gắn với route)
│   ├── Home/
│   │   └── Home.jsx
│   ├── Login/
│   │   └── Login.jsx
│   ├── Profile/
│   │   └── Profile.jsx
│   └── NotFound/
│       └── NotFound.jsx
│
├── routes/                 # Điều hướng
│   ├── AppRoutes.jsx
│   ├── PrivateRoute.jsx
│   └── path.js
│
├── services/               # Mock data từ .data
│   ├── api.js              
│   ├── authService.js
│   └── userService.js
│
├── store/                  # State global dùng redux
│   ├── store.js
│   └── slices/
│       ├── authSlice.js
│       └── userSlice.js
│
├── hooks/                  # Custom hooks
│   └── useFetch.js
│
├── utils/                  # Hàm tiện ích
│   ├── formatDate.js
│   ├── storage.js
│   └── validators.js
│
├── data/                   # Mock data / constant
│   ├── menu.js
│   └── roles.js
│
├── App.jsx
├── main.jsx
└── index.css

```

# Mô tả thư mục
- `assets/`: Chứa các tài nguyên tĩnh như hình ảnh, biểu tượng, phông chữ và các tệp CSS toàn cục.
- `components/`: Chứa các component tái sử dụng được trong toàn bộ ứng dụng.
- `layouts/`: Chứa các khung giao diện khác nhau cho các phần của ứng dụng.
- `pages/`: Chứa các trang tương ứng với các route trong ứng dụng.
- `routes/`: Quản lý điều hướng và các route của ứng dụng.
- `services/`: Chứa các hàm để tương tác với mock data.
- `store/`: Quản lý state toàn cục của ứng dụng sử dụng Redux.
- `hooks/`: Chứa các custom hooks để tái sử dụng logic.
- `utils/`: Chứa các hàm tiện ích dùng chung trong ứng dụng.
- `data/`: Chứa các mock data hoặc constant dùng trong ứng dụng.

# Các dependencies 
- React
- React Router DOM (Dùng để điều hướng)
- Redux Toolkit (Dùng để chứa state global)
- Axios (hoặc Fetch API)
- Tostify (hoặc thư viện thông báo khác)
- Bootstrap 5 
- React Icon (chứa các icon phổ biến)
- React pagination (phân trang)
- nprogress (thanh tiến trình)

