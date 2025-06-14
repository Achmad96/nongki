import React from "react";
import "./WhyUs.css";
import { FaWifi, FaPrint, FaSyncAlt, FaSmoking, FaSmokingBan, FaMosque, FaSnowflake, FaClock } from "react-icons/fa";

const features = [
  {
    icon: <FaClock className="whyus-icon" />,
    title: "9 AM - 9 PM",
    desc: "Jam operasional yang mendukung produktifitas"
  },
  {
    icon: <FaWifi className="whyus-icon" />,
    title: "WIFI SUPER KENCANG",
    desc: "Tersedia Wifi Cepat untuk meningkatkan efisiensi kerja"
  },
  {
    icon: <FaPrint className="whyus-icon" />,
    title: "GRATIS PRINTING",
    desc: "Menyediakan Printing Gratis untuk keperluan dokumen anda"
  },
  {
    icon: <FaSyncAlt className="whyus-icon" />,
    title: "GRATIS ISI ULANG",
    desc: "Gratis isi ulang air minum jika diperlukan"
  },
  {
    icon: <FaSmoking className="whyus-icon" />,
    title: "Smoking Indoor",
    desc: "Tersedia ruangan khusus untuk anda yang suka ingin bekerja sambil merokok"
  },
  {
    icon: <FaSmokingBan className="whyus-icon" />,
    title: "No-Smoking Indoor",
    desc: "Ruangan utama bebas asap rokok, cocok untuk yang ingin bekerja tanpa gangguan asap"
  },
  {
    icon: <FaMosque className="whyus-icon" />,
    title: "Musholla",
    desc: "Dunia Sementara, Akhirat Selamanya, jangan lupa beribadah meskipun bekerja"
  },
  {
    icon: <FaSnowflake className="whyus-icon" />,
    title: "AC DINGIN",
    desc: "Dilengkapi AC disetiap sudut ruangan, agar bekerja jadi lebih nyaman"
  }
];

const WhyUs = () => (
  <section className="whyus-section">
    <h2 className="whyus-title">
      Kenapa harus pilih <span className="whyus-highlight">NONGKI ?</span>
    </h2>
    <div className="whyus-cards">
      {features.map((item, idx) => (
        <div className="whyus-card" key={idx}>
          {item.icon}
          <div className="whyus-card-title">{item.title}</div>
          <div className="whyus-card-desc">{item.desc}</div>
        </div>
      ))}
    </div>
    <div className="whyus-footer">
      <span className="whyus-highlight">NONGKI</span> MENYEDIAKAN SETIAP KEBUTUHAN PRODUKTIFITAS ANDA
    </div>
  </section>
);

export default WhyUs;