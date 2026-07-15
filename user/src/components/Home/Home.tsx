import { useEffect, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import About from "./About/About";
import Heroslider from "./Heroslider/Heroslider";
import Special from "./Special/Special";

// Lazy load below-the-fold components to improve performance
const Specialities = lazy(() => import("./Specialities/Specialities"));
const Appointment = lazy(() => import("./Appointment/Appointment"));
const Facilities = lazy(() => import("./Facilities/Facilities"));
const Gallery = lazy(() => import("./Gallery/Gallery"));

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#appointment-section") {
      setTimeout(() => {
        const element = document.getElementById("appointment-form-wrapper") || document.getElementById("appointment-section");
        if (element) {
          const headerHeight = 90; // Offset for sticky navbar
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - headerHeight - 20,
            behavior: "smooth",
          });
          // Focus the name input field inside the wrapper if it exists
          const nameInput = document.getElementById("pasentname");
          if (nameInput) {
            (nameInput as HTMLInputElement).focus();
          }
        }
      }, 200);
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
