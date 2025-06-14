import React from "react";
import "./Product.css";

const products = [
  {
    title: "Private Workspace",
    img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
    fasilitas: "Meja pribadi, kursi ergonomis, lampu baca, colokan listrik, wifi super cepat.",
    harga: "Rp 50.000 / hari"
  },
  {
    title: "Group Workspace",
    img: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=600&q=80",
    fasilitas: "Meja besar untuk 4-6 orang, whiteboard, colokan listrik, wifi super cepat.",
    harga: "Rp 150.000 / hari"
  }
];

const meetingProduct = {
    title: "Meeting Workspace",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    fasilitas: "Ruang meeting tertutup, proyektor, papan tulis, air mineral, wifi super cepat.",
    harga: "Rp 200.000 / 2 jam"
};

const Product = () => (
<section className="product-section">
    <h2 className="product-title">Produk Kami</h2>
    <div className="product-scroll">
    {products.map((item, idx) => (
        <div className="product-card" key={idx}>
            <img src={item.img} alt={item.title} />
            <div className="product-card-title">{item.title}</div>
            <div className="product-card-facility">{item.fasilitas}</div>
            <div className="product-card-price">{item.harga}</div>
        </div>
    ))}
    </div>
    <div className="product-meeting-wrapper">
    <div className="product-card meeting-card">
        <img src={meetingProduct.img} alt={meetingProduct.title} />
        <div className="product-card-title">{meetingProduct.title}</div>
        <div className="product-card-facility">{meetingProduct.fasilitas}</div>
        <div className="product-card-price">{meetingProduct.harga}</div>
    </div>
    </div>
    </section>
);

export default Product;