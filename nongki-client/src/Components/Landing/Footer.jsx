import React from "react";
import "../../Styles/Footer.css";
import { FaInstagram, FaTiktok, FaFacebook, FaWhatsapp } from "react-icons/fa";

const Footer = () => (
  <footer className="footer" id ="footer">
    <div className="footer-col logo-col">
      <div className="footer-logo-group">
        <span className="footer-logo-icon"></span>
        <span className="footer-logo-text">Nongki</span>
      </div>
      <div className="footer-desc">Lorem ipsum dolor sit amet</div>
      <div className="footer-social">
        <a href="#" aria-label="Instagram"><FaInstagram /></a>
        <a href="#" aria-label="Tiktok"><FaTiktok /></a>
        <a href="#" aria-label="Facebook"><FaFacebook /></a>
      </div>
    </div>
    <div className="footer-col">
      <div className="footer-title">Ruangan Kami</div>
      <div>Private Workspace</div>
      <div>Group Workspace</div>
      <div>Meeting Workspace</div>
    </div>
    <div className="footer-col">
      <div className="footer-title">Operasional</div>
      <div>Senin - Jum'at</div>
      <div><b>9 AM – 9PM</b></div>
      <div>Sabtu - Minggu</div>
      <div><b>9 AM – 10PM</b></div>
      <div style={{ marginTop: 8 }}><b>Hanya IDR 5.000 / Jam</b></div>
    </div>
    <div className="footer-col">
      <div className="footer-title">Kontak</div>
      <div className="footer-address">
        Jl. loremipsum 1 (sebelah warung pak tho), dolor si amet, Surabaya, Jawa timur, Indonesia, 61262
      </div>
      <div className="footer-contact">
        <FaWhatsapp className="footer-wa-icon" />
        <b>0899999999999</b>
      </div>
    </div>
  </footer>
);

export default Footer;