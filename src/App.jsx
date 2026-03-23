import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { restoreAuth } from "./redux/slices/authSlice";

function App() {
  const dispatch = useDispatch();

  // Khôi phục auth từ localStorage khi app load
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      try {
        const authData = JSON.parse(auth);
        dispatch(restoreAuth(authData));
      } catch (error) {
        console.error("Lỗi khôi phục dữ liệu auth:", error);
      }
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={2000} />
    </BrowserRouter>
  );
}

export default App;
