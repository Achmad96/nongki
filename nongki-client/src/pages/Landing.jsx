import React from "react";
import Hero from '../Components/Landing/Hero';
import About from '../Components/Landing/About';
import WhyUs from '../Components/Landing/WhyUs';
import Product from '../Components/Landing/Product';
import Location from '../Components/Landing/Location';


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
  </div>
  </div>
);

export default Landing;