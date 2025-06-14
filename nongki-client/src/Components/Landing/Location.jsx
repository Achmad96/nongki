import React from "react";
import "../../Styles/Location.css";

const Location = () => (
  <section className="location-section">
    <div className="location-row">
      <div className="location-title-group">
        <div className="location-title">Temukan Kami!</div>
        <div className="location-brand">NONGKI</div>
      </div>
      <div className="location-info-group">
        <div className="location-address">
          Jl. loremipsum 1 (sebelah warung pak tho), dolor si amet, Surabaya, Jawa timur, Indonesia, 61262
        </div>
        <button className="location-btn">DAPATKAN LOKASI</button>
      </div>
    </div>
    <div className="location-map">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.932282019994!2d112.730362!3d-7.137778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fbf7c6e8e8e1%3A0x7e3b7e3e3e3e3e3e!2sSurabaya!5e0!3m2!1sen!2sid!4v1680000000000!5m2!1sen!2sid"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Lokasi Nongki"
      ></iframe>
    </div>
  </section>
);

export default Location;