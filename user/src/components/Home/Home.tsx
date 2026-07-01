import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Facilities from "./Facilities/Facilities";
import About from "./About/About";
import Specialities from "./Specialities/Specialities";
import Gallery from "./Gallery/Gallery";
import Heroslider from "./Heroslider/Heroslider";
import Appointment from "./Appointment/Appointment";
import Special from "./Special/Special";

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
      <Specialities />
      <Appointment />
      <Facilities />
      <Gallery />
    </div>
  );
};

export default Home;
