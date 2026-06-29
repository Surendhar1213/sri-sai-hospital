import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const authRoutes = ["/login", "/register"];

const Layout = () => {
  const location = useLocation();
  const isAuthPage = authRoutes.includes(location.pathname);

  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      {!isAuthPage && <Footer />}
    </>
  );
};

export default Layout;