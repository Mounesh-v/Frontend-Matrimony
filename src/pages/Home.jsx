import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

import hero1 from "../assets/bg1.png";
import hero2 from "../assets/bg2.png";
import hero3 from "../assets/bg3.png";
import hero4 from "../assets/bg4.jpg";

import premium1 from "../assets/premium1.jpg";
import premium2 from "../assets/premium2.jpg";
import premium3 from "../assets/premium3.jpg";

import g1 from "../assets/gallery1.png";
import g2 from "../assets/gallery2.jpg";
import g3 from "../assets/gallery3.jpg";
import g4 from "../assets/gallery4.jpg";
import g5 from "../assets/gallery5.jpg";
import g6 from "../assets/gallery6.jpg";

import muslim from "../assets/muslim.jpg";
import remarriage from "../assets/remarriage.jpeg";
import hindus from "../assets/hindus.jpg";
import christian from "../assets/christian.jpg";

import god1 from "../assets/god1.jpg";
import god2 from "../assets/god2.jpg";
import god3 from "../assets/god3.jpg";
import god4 from "../assets/god4.jpg";
import god5 from "../assets/god5.jpg";

export default function Home() {
  const navigate = useNavigate();

  const heroImages = [hero4, hero2, hero3, hero1];


  const godItems = [
    { img: god1, title: "Sacred Rituals" },
    { img: god2, title: "Divine Blessings" },
    { img: god3, title: "Holy Celebrations" },
    { img: god4, title: "Temple Traditions" },
    { img: god5, title: "Spiritual Harmony" },
  ];

  const [slide, setSlide] = useState(0);
  const [user, setUser] = useState(null);
  const [hasGroom, setHasGroom] = useState(false);
  const [hasBride, setHasBride] = useState(false);
  import.meta.env.VITE_API_URL;

  const itemsToShow = 3;
  const extendedItems = [
    ...godItems.slice(-itemsToShow),
    ...godItems,
    ...godItems.slice(0, itemsToShow),
  ];

  const [position, setPosition] = useState(itemsToShow);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const nextGod = () => {
    setPosition((prev) => prev + 1);
    setIsTransitioning(true);
  };

  const prevGod = () => {
    setPosition((prev) => prev - 1);
    setIsTransitioning(true);
  };

  useEffect(() => {
    if (position === extendedItems.length - itemsToShow) {
      setTimeout(() => {
        setIsTransitioning(false);
        setPosition(itemsToShow);
      }, 300);
    }

    if (position === 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        setPosition(godItems.length);
      }, 300);
    }
  }, [position]);

  useEffect(() => {
    const auto = setInterval(() => {
      setSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(auto);
  }, []);

  const GetStarted = (type) => {
    if (!user) return navigate("/signup");
    if (type === "groom" && hasGroom)
      return alert("Groom Profile Already Registered");
    if (type === "bride" && hasBride)
      return alert("Bride Profile Already Registered");
    navigate(type === "groom" ? "/groom-register" : "/bride-register");
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const load = async () => {
      try {
        const userRes = await axios.get(
          `${API}/api/user/${userId}`
        );
        setUser(userRes.data);

        const groomRes = await axios.get(
          `${API}/api/grooms/check/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setHasGroom(groomRes.data.exists);

        const brideRes = await axios.get(
          `${API}/api/brides/check/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setHasBride(brideRes.data.exists);
      } catch {}
    };

    load();
  }, []);

  const touchStart = useRef(0);
  const touchEnd = useRef(0);

  const handleSwipe = () => {
    if (touchStart.current - touchEnd.current > 80)
      setSlide((prev) => (prev + 1) % heroImages.length);

    if (touchEnd.current - touchStart.current > 80)
      setSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <div className="bg-gray-50">
      {/* HERO SECTION */}
      <section
        className="relative w-full h-[75vh] xs:h-[80vh] sm:h-[85vh] md:h-[95vh] overflow-hidden pt-20 sm:pt-20 md:pt-16"
        onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
        onTouchMove={(e) => (touchEnd.current = e.touches[0].clientX)}
        onTouchEnd={handleSwipe}
      >
        {heroImages.map((img, index) => (
          <div
            key={index}
            className="absolute mb-[-200px] inset-0 bg-cover bg-center transition-opacity duration-1200"
            style={{
              backgroundImage: `url(${img})`,
              opacity: index === slide ? 1 : 0,
              filter: "brightness(0.75)",
            }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-white/40" />

        {/* HERO TEXT */}
        <div
          className="relative z-10 px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 
                    max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 
                    mt-4 xs:mt-6 sm:mt-8 md:mt-10 lg:mt-12"
        >
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 xs:mb-6 text-pink-700">
            Thirukalyanamalai
          </h1>

          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 xs:mb-4 text-pink-700">
            30 Years of Trusted Matrimonial Service
          </h1>

          <p className="text-sm xs:text-base sm:text-lg md:text-xl mb-4 xs:mb-6 text-gray-800">
            For over 30 years, we have been offering reliable matrimonial
            services.
          </p>

          {/* HERO BUTTONS */}
          <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4">
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-3 xs:px-4 sm:px-5 py-2 rounded font-bold text-white 
                         text-xs xs:text-sm sm:text-base bg-pink-700 hover:bg-pink-800 transition"
                >
                  Register as Groom
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="px-3 xs:px-4 sm:px-5 py-2 rounded font-bold text-white 
                         text-xs xs:text-sm sm:text-base bg-pink-600 hover:bg-pink-700 transition"
                >
                  Register as Bride
                </button>
              </>
            ) : (
              <>
                {hasGroom && (
                  <button
                    className="px-3 xs:px-4 sm:px-6 py-2 sm:py-3 rounded font-bold text-white 
                           text-xs xs:text-sm sm:text-base bg-pink-700 opacity-60 cursor-not-allowed"
                  >
                    Groom Profile Already Registered
                  </button>
                )}

                {hasBride && (
                  <button
                    className="px-3 xs:px-4 sm:px-6 py-2 sm:py-3 rounded font-bold text-white 
                           text-xs xs:text-sm sm:text-base bg-pink-600 opacity-60 cursor-not-allowed"
                  >
                    Bride Profile Already Registered
                  </button>
                )}

                {!hasGroom && !hasBride && (
                  <>
                    <button
                      onClick={() => GetStarted("groom")}
                      className="px-3 xs:px-4 sm:px-5 py-2 rounded font-bold text-white 
                             text-xs xs:text-sm sm:text-base bg-pink-700 hover:bg-pink-800 transition"
                    >
                      Register as Groom
                    </button>

                    <button
                      onClick={() => GetStarted("bride")}
                      className="px-3 xs:px-4 sm:px-5 py-2 rounded font-bold text-white 
                             text-xs xs:text-sm sm:text-base bg-pink-600 hover:bg-pink-700 transition"
                    >
                      Register as Bride
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* SLIDER DOTS */}
        <div className="absolute bottom-4 xs:bottom-6 sm:bottom-8 w-full flex justify-center gap-1 xs:gap-2">
          {heroImages.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 xs:h-2 xs:w-2 sm:h-3 sm:w-3 rounded-full transition-all ${
                slide === i ? "bg-pink-700 scale-110" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* WHATSAPP FLOAT BUTTON */}
        <div
          onClick={() =>
            window.open(
              "https://wa.me/9655326468?text=Hello! I want matrimonial details",
              "_blank"
            )
          }
          className="fixed xs:absolute right-3 xs:right-4 sm:right-6 bottom-20 xs:bottom-6 sm:bottom-10 z-30 
                 bg-green-500 w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 
                 rounded-full flex items-center justify-center shadow-lg 
                 cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8"
          />
        </div>
      </section>

      {/* SPECIAL PROFILES */}
      <section className="py-10 xs:py-12 sm:py-16 px-4 xs:px-6 sm:px-8 md:px-12 lg:px-20 text-center">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold mb-6 xs:mb-8 text-pink-700">
          Special Profiles
        </h2>

        <div
          className="grid gap-4 xs:gap-6 sm:gap-8 grid-cols-1 
              min-[500px]:grid-cols-2 
              md:grid-cols-2 
              lg:grid-cols-4"
        >
          {[hindus, muslim, christian, remarriage].map((img, i) => {
            const titles = [
              "Profile of Hindus",
              "Profile of Muslims",
              "Profile of Christians",
              "Re-Marriage",
            ];

            const sendWhatsApp = () => {
              const message = `Hello! I want to register for ${titles[i]}`;
              window.open(
                `https://wa.me/9655326468?text=${encodeURIComponent(message)}`
              );
            };

            return (
              <div
                key={i}
                className="w-[80%] h-[360px] md:w-[90%] md:h-[300px] mx-auto rounded-xl shadow-lg overflow-hidden bg-white hover:scale-105 transition-all duration-300"
              >
                <img
                  src={img}
                  alt={titles[i]}
                  className="h-62 xs:h-32  sm:h-36 md:h-40 lg:h-44 w-full object-cover"
                />

                <div className="mt-[6%] md:mt-0 p-3 xs:p-4 sm:p-6">
                  <h3 className="text-base xs:text-lg sm:text-xl font-bold text-pink-700">
                    {titles[i]}
                  </h3>

                  <button
                    onClick={sendWhatsApp}
                    className="mt-2 xs:mt-3 sm:mt-4 w-full text-white py-2 xs:py-2.5 sm:py-3 
                         rounded-lg font-semibold bg-pink-700 hover:bg-pink-800 transition"
                  >
                    Register Free
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SPECIAL FEATURES */}
      <h2 className="text-2xl xs:text-3xl sm:text-4xl text-center font-extrabold mb-6 xs:mb-8 text-pink-700">
        Special Features
      </h2>

      <section
        className="py-8 xs:py-10 sm:py-12 md:py-16 px-4 xs:px-6 sm:px-8 md:px-12 lg:px-20 
                      grid gap-4 xs:gap-6 sm:gap-8 grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3"
      >
        {[premium1, premium2, premium3].map((img, i) => {
          const titles = [
            "Verified Profiles",
            "Privacy Protected",
            "Smart Matchmaking",
          ];
          const desc = [
            "All profiles are manually verified.",
            "Your data stays safe.",
            "Get perfect matches easily.",
          ];

          return (
            <div
              key={i}
              className=" w-[80%] h-[360px] md:w-[90%] md:h-[300px] mx-auto rounded-xl shadow-lg overflow-hidden bg-white hover:scale-105 transition-all duration-300"
            >
              <img
                src={img}
                alt={titles[i]}
                className="h-24  h-[290px] md:w-[90%] xs:h-28 sm:h-32 md:h-36 lg:h-40 w-full object-cover"
              />
              <div className="p-3 xs:p-4 sm:p-6">
                <h3 className="text-base xs:text-lg sm:text-xl font-bold mb-1 xs:mb-2 text-pink-700">
                  {titles[i]}
                </h3>
                <p className="text-xs xs:text-sm sm:text-base text-gray-700">
                  {desc[i]}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* GALLERY */}
      <section className="py-8 xs:py-10 sm:py-12 md:py-16 px-4 xs:px-6 sm:px-8 md:px-12 lg:px-20">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-center mb-4 xs:mb-6 text-pink-700">
          Wedding Moments Gallery
        </h2>

        <div className="grid grid-cols-2 md:w-[90%] md:h-[400px] xs:grid-cols-2 sm:grid-cols-3 gap-3 xs:gap-3 sm:gap-4 mt-4 xs:mt-6">
          {[g1, g2, g3, g4, g5, g6].map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Gallery ${i + 1}`}
              className="  rounded-lg shadow-md w-full h-50 xs:h-24 sm:h-28 md:h-36 lg:h-40 object-cover 
                   hover:scale-105 transition-transform duration-300"
            />
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-8 xs:py-10 sm:py-12 md:py-16 text-center bg-gray-900 text-white">
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-3 xs:mb-4 px-4">
          Begin Your Beautiful Journey Today
        </h2>

        <p className="text-sm xs:text-base sm:text-lg mb-4 xs:mb-6 px-4 text-gray-300">
          Contact us for personalized matchmaking services
        </p>

        <div className="flex flex-wrap justify-center gap-2 xs:gap-3 sm:gap-4 mt-4 px-4">
          <button
            className="px-3 xs:px-4 sm:px-5 md:px-6 py-2 rounded font-bold shadow-lg 
                   text-xs xs:text-sm sm:text-base bg-yellow-500 text-gray-900 
                   hover:bg-yellow-600 transition"
            onClick={() => window.open("tel:9655326468")}
          >
            Call Us
          </button>

          <button
            className="px-3 xs:px-4 sm:px-5 md:px-6 py-2 rounded font-bold shadow-lg 
                   text-white text-xs xs:text-sm sm:text-base bg-green-500 
                   hover:bg-green-600 transition"
            onClick={() =>
              window.open(
                "https://wa.me/9655326468?text=Hello! I want matrimonial details"
              )
            }
          >
            WhatsApp
          </button>
        </div>
      </section>

      <FAQ />
      <Footer />
    </div>
  );
}
