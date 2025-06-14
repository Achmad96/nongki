import React from "react";
import "../../Styles/Testi.css";

const testimonials = [
  {
    text: `"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."`,
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Sarah",
    role: "Feminist brutal"
  },
  {
    text: `"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."`,
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Hans",
    role: "Wibu bau bawang"
  },
  {
    text: `"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."`,
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    name: "Maya",
    role: "Programmer Handal"
  }
];

const Testimoni = () => (
  <section className="testimoni-section">
    <h2 className="testimoni-title">TESTIMONI</h2>
    <div className="testimoni-list">
      {testimonials.map((item, idx) => (
        <div className="testimoni-card" key={idx}>
          <div className="testimoni-text">{item.text}</div>
          <img className="testimoni-img" src={item.img} alt={item.name} />
          <div className="testimoni-name">{item.name}</div>
          <div className="testimoni-role">{item.role}</div>
        </div>
      ))}
    </div>
  </section>
);

export default Testimoni;