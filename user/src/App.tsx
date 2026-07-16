import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import Home from "./components/Home/Home";

// Lazy loaded page/speciality components
const Aboutus = lazy(() => import("./components/About/Aboutus"));
const Gynecology = lazy(() => import("./components/Speciality/Gynecology/Gynecology"));
const Fertility = lazy(() => import("./components/Speciality/Fertility/Fertility"));
const ObstetricsAndMaternity = lazy(() => import("./components/Speciality/ObstetricsAndMaternity/ObstetricsAndMaternity"));
const PelvicFloor = lazy(() => import("./components/Speciality/PelvicFloor/PelvicFloor"));
const WomensIntimateWellness = lazy(() => import("./components/Speciality/WomensIntimateWellness/WomensIntimateWellness"));
const Endocrinology = lazy(() => import("./components/Speciality/Endocrinology/Endocrinology"));
const ObesityandWeightLoss = lazy(() => import("./components/Speciality/ObesityandWeightLoss/ObesityandWeightLoss"));
const Diabetology = lazy(() => import("./components/Speciality/Diabetology/Diabetology"));
const Dermatology = lazy(() => import("./components/Speciality/DermatologyandCosmetology/Dermatology"));
const HairandNail = lazy(() => import("./components/Speciality/Hairandnail/Hairandnail"));
const Urology = lazy(() => import("./components/Speciality/Urology/Urology"));
const GeneralMedicine = lazy(() => import("./components/Speciality/GeneralMedicin/GeneralMedicine"));
const Doctors = lazy(() => import("./components/Doctors/Doctors"));
const Gallery = lazy(() => import("./components/Gallery/Gallery"));
const Contactus = lazy(() => import("./components/Contactus/Contactus"));
const Facilities = lazy(() => import("./components/Facilities/Facilities"));

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Fallback loader while lazy components are downloading
const PageLoader = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<Aboutus />} />

            {/* Speciality pages */}
            <Route path="/gynecology" element={<Gynecology />} />
            <Route path="/fertility" element={<Fertility />} />
            <Route
              path="/obstetricsandmaternity"
              element={<ObstetricsAndMaternity />}
            />
            <Route path="/PelvicFloor" element={<PelvicFloor />} />
            <Route
              path="/WomensIntimateWellness"
              element={<WomensIntimateWellness />}
            />
            <Route path="/endocrinology" element={<Endocrinology />} />

            <Route
              path="/obesityandweightloss"
              element={<ObesityandWeightLoss />}
            />
            <Route path="/diabetology" element={<Diabetology />} />
            <Route path="/dermatology" element={<Dermatology />} />
            <Route path="/hairandnail" element={<HairandNail />} />
            <Route path="/urology" element={<Urology />} />
            <Route path="/generalmedicine" element={<GeneralMedicine />} />

            {/*  pages */}

            <Route path="/facilities" element={<Facilities />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contactus" element={<Contactus />} />

            {/* ✅ Auth Pages — Login & Register */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />


            {/* ✅ User Profile / Dashboard Page */}
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Suspense>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </BrowserRouter>
  );

}

export default App;
