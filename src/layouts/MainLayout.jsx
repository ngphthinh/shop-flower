import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NProgress from "nprogress";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";

NProgress.configure({ showSpinner: false, speed: 350 });

export default function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    // Simulate a short transition so route change feels responsive.
    NProgress.start();
    const timeoutId = setTimeout(() => {
      NProgress.done();
    }, 250);

    return () => {
      clearTimeout(timeoutId);
      NProgress.done();
    };
  }, [location.pathname]);

  return (
    <div className="min-vh-100 bg-light-subtle">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
