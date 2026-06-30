import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
// react toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const [token, setToken] = useState<string | null>(null);

  // Page refresh aana appavum login state persist aaganum
  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

   const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
    toast.success("🔐 Login Successful! Welcome Back Admin.");
  };


    const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
    toast.info("🚪 Logged Out Successfully!");
  };



   return (
    <>
      {!token ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
      {/* Toast Notifications Provider Container */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  );
}

export default App;
