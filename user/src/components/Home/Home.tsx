import React from "react";
import Facilities from "./Facilities/Facilities";
import About from "./About/About";
import Specialities from "./Specialities/Specialities";
import Footer from "../Footer/Footer";
import Gallery from "./Gallery/Gallery";
import Navbar from "../Navbar/Navbar";
import Heroslider from "./Heroslider/Heroslider";
import Appointment from "./Appointment/Appointment";
// import Whychooseus from "./whychooseus/whychooseus";
import Special from "./Special/Special";

const Home = () => {
  return (
    <div>
      <Heroslider />
      <About />
      <Special />
      <Specialities />
      <Appointment />
      <Facilities />
      <Gallery />
      {/* <Whychooseus /> */}
    </div>
  );
};

export default Home;
