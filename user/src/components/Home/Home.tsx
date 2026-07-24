import { useEffect, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import About from "./About/About";
import Heroslider from "./Heroslider/Heroslider";
import Special from "./Special/Special";
import Appointment from "./Appointment/Appointment";
import Specialities from "./Specialities/Specialities";

// Lazy load below-the-fold components to improve performance
const Facilities = lazy(() => import("./Facilities/Facilities"));
const Gallery = lazy(() => import("./Gallery/Gallery"));

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#appointment-section") {
      let attempts = 0;
      const scrollInterval = setInterval(() => {
        const element = document.getElementById("appointment-form-wrapper") || document.getElementById("appointment-section");
        if (element) {
          const headerHeight = 90; // Offset for sticky navbar
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo(0, elementPosition - headerHeight - 20);
          
          const nameInput = document.getElementById("pasentname");
          if (nameInput) {
            nameInput.focus();
          }
        }
        attempts++;
        if (attempts >= 15) { // Poll for 4.5 seconds to fully cover slow-loading images/layout shifts
          clearInterval(scrollInterval);
        }
      }, 300);

      return () => clearInterval(scrollInterval);
    }
  }, [location]);

  return (
    <div>
      <Heroslider />
      <About />
      <Special />
      <Suspense fallback={
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "50px 0" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }>
        <Specialities />
        <Appointment />
        <Facilities />
        <Gallery />
      </Suspense>
    </div>
  );
};

export default Home;
