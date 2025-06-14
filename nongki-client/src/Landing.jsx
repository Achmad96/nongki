import React from "react";
import Hero from "./Hero";
import About from "./About";
import WhyUs from "./WhyUs";
import Product from "./Product";


const Landing = () => (
  <div>
  <div>
    <Hero />
    </div>
    <div style={{ marginTop: 1 }}>
    <About />
    <WhyUs />
    <Product />
  </div>
  </div>
);

export default Landing;