import React, { useState } from "react";
import "../../Styles/Faq.css";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

const faqData = [
  {
    question: "Apa tempat parkirnya luas ?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam facilisis."
  },
  {
    question: "Apa penjaga nya Cantik/ganteng?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam facilisis."
  },
  {
    question: "Apa WC nya bau pesing ?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam facilisis."
  },
  {
    question: "Apa harganya bisa di nego?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam facilisis."
  },
  {
    question: "Gimana cara pesennya biar gampang ?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam facilisis."
  },
  {
    question: "Apa ada makan gratis?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam facilisis."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = idx => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="faq-section">
      <h2 className="faq-title">
        Frequently Asked <span className="faq-highlight">Question</span>
      </h2>
      <div className="faq-list">
        {faqData.map((item, idx) => (
          <div className="faq-item" key={idx}>
            <div
              className={`faq-question${openIndex === idx ? " open" : ""}`}
              onClick={() => handleToggle(idx)}
            >
              <span>{item.question}</span>
              <span className="faq-arrow">
                {openIndex === idx ? (
                  <FaChevronDown color="#FFC107" />
                ) : (
                  <FaChevronRight color="#FFC107" />
                )}
              </span>
            </div>
            {openIndex === idx && (
              <div className="faq-answer">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;