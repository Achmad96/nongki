import React from "react";
import "../../Styles/Hero.css";

const Hero = () => (
  <div className="home-root">
    {/* Navbar */}
    <div className="navbar">
      <div className="logo">
        <span className="logo-icon" />
        Nongki
      </div>
      <div className="nav-menu">
        <a href="#">Beranda</a>
        <a href="#">Lokasi</a>
        <a href="#">Produk</a>
        <a href="#">Kontak</a>
      </div>
      <button className="booking-btn">Pesan</button>
    </div>
    {/* Main Content */}
    <div className="container">
      <div className="left-content">
        <h1>
          LOREM IPSUM
          <span className="highlight">DOLOR SIT AMET</span>
        </h1>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
        <button className="cta-btn">Pesan Sekarang</button>
      </div>
      <div className="right-content">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
          alt="Office View"
        />
      </div>
    </div>
  </div>

);
export default Hero;
