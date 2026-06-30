import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import Home from "./components/Home/Home";
import Aboutus from "./components/About/Aboutus";
import Gynecology from "./components/Speciality/Gynecology/Gynecology";
import Fertility from "./components/Speciality/Fertility/Fertility";
import ObstetricsAndMaternity from "./components/Speciality/ObstetricsAndMaternity/ObstetricsAndMaternity";
import PelvicFloor from "./components/Speciality/PelvicFloor/PelvicFloor";
import WomensIntimateWellness from "./components/Speciality/WomensIntimateWellness/WomensIntimateWellness";
import Endocrinology from "./components/Speciality/Endocrinology/Endocrinology";
import ObesityandWeightLoss from "./components/Speciality/ObesityandWeightLoss/ObesityandWeightLoss";
import Diabetology from "./components/Speciality/Diabetology/Diabetology";
import Dermatology from "./components/Speciality/DermatologyandCosmetology/Dermatology";
import HairandNail from "./components/Speciality/Hairandnail/Hairandnail";
import Urology from "./components/Speciality/Urology/Urology";
import GeneralMedicine from "./components/Speciality/GeneralMedicin/GeneralMedicine";
import Doctors from "./components/Doctors/Doctors";
import Gallery from "./components/Gallery/Gallery";
import Contactus from "./components/Contactus/Contactus";
import Facilities from "./components/Facilities/Facilities";

import Login from "./pages/Login";
import Register from "./pages/Register";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <BrowserRouter>
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
        </Route>
      </Routes>
    <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </BrowserRouter>
  );

}

export default App;
