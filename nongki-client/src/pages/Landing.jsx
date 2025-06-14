import React from "react";
import Hero from '../Components/Landing/Hero';
import About from '../Components/Landing/About';
import WhyUs from '../Components/Landing/WhyUs';
import Product from '../Components/Landing/Product';
import Location from '../Components/Landing/Location';
import Testi from '../Components/Landing/Testi';
import FAQ from "../Components/Landing/faq";
import Footer from "../Components/Landing/Footer";


const Landing = () => (
  <div>
  <div>
    <Hero />
    </div>
    <div style={{ marginTop: 1 }}>
      <About />
      <WhyUs />
      <Product />
      <Location />
      <Testi />
      <FAQ />
    </div>
    <div>
      <Footer />
    </div>
  </div>
);

export default Landing;