import React, { useState } from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faq = [
    {
      q: "How does the Matrimony platform work?",
      a: "You can register, create your detailed profile, upload photos, and search for compatible matches based on your preferences.",
    },
    {
      q: "Is my information safe?",
      a: "Yes. Your data is fully protected with advanced security systems and will not be shared publicly.",
    },
    {
      q: "Can I upload multiple photos?",
      a: "Yes. You can upload up to five photos during registration or later from your profile.",
    },
    {
      q: "How do I contact a match?",
      a: "Once you find a profile you are interested in, you can send an interest request and start communication when accepted.",
    },
    {
      q: "Is registration free?",
      a: "Basic registration is free. Premium plans are available for enhanced visibility and features.",
    },
  ];

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div
      className="py-16 px-6 md:px-20"
      // style={{
      //   background: "rgba(0,0,0,0.25)",
      //   backdropFilter: "blur(6px)",
      //   WebkitBackdropFilter: "blur(6px)",
      //   borderTop: "1px solid rgba(255,255,255,0.08)",
      //   borderBottom: "1px solid rgba(255,255,255,0.08)",
      // }}
    >
      <h2
        className="text-4xl font-bold text-center mb-10 tracking-wide"
        style={{ color: "#C2185B" }}
      >
        Frequently Asked Questions
      </h2>

      <div className="max-w-3xl mx-auto space-y-4">
        {faq.map((item, i) => (
          <div
            key={i}
            onClick={() => toggle(i)}
            className="rounded-lg shadow-lg p-5 cursor-pointer transition-all"
            // style={{
            //   background: "rgba(255,255,255,0.08)",
            //   backdropFilter: "blur(8px)",
            //   WebkitBackdropFilter: "blur(8px)",
            //   border: "1px solid rgba(255,255,255,0.15)",
            //   boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
            // }}
          >
            <div className="flex justify-between items-center">
              <h3
                className="text-lg font-semibold"
                style={{ color: "black", letterSpacing: "0.3px" }}
              >
                {item.q}
              </h3>

              <span
                className="text-3xl font-bold"
                style={{ color: "#C2185B", lineHeight: "18px" }}
              >
                {openIndex === i ? "−" : "+"}
              </span>
            </div>

            {openIndex === i && (
              <p
                className="mt-3 text-sm leading-relaxed rounded-md shadow-inner transition-all"
                style={{
                  background: "#C2185B",
                  color: "white",
                  padding: "14px",
                  borderLeft: "4px solid #D4A437",
                }}
              >
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
