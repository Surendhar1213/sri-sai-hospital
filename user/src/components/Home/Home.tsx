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
      const element = document.getElementById("pasentname") || document.getElementById("appointment-section");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          if (element.tagName === "INPUT") {
            (element as HTMLInputElement).focus();
          }
        }, 100);
      }
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
