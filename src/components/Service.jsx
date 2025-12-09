import React, { useState } from "react";

export default function Service() {
  const [lang, setLang] = useState("ta");

  return (
    <div
      className="min-h-screen px-5 py-12 my-20 flex justify-center"
      style={{ backgroundColor: "#F5F5F5", color: "#212121" }}
    >
      <div
        className="w-full max-w-4xl p-8 rounded-2xl shadow-xl"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        {/* LANGUAGE SWITCH BUTTON */}
        <div className="flex justify-end">
          <button
            onClick={() => setLang(lang === "ta" ? "en" : "ta")}
            className="px-6 py-2 rounded-lg font-bold shadow-md transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#D4A437", color: "#212121" }}
          >
            {lang === "ta" ? "Translate to English" : "தமிழில் காண (Tamil)"}
          </button>
        </div>

        {/* TITLE */}
        <h1
          className="sm:text-[24px] md:text-4xl font-extrabold text-center mt-6 mb-8 leading-snug"
          style={{ color: "#C2185B" }}
        >
          {lang === "ta"
            ? "திருக்கல்யாணமாலை திருமண சேவை மையம்"
            : "Thirukkalyanam Matrimony Service Centre"}
        </h1>

        {/* TAMIL CONTENT */}
        {lang === "ta" ? (
          <>
            <p className="text-lg leading-relaxed mb-6">
              நமது சேவை கடந்த 30 வருடங்களாக அணைத்து சமூகத்தினருக்கும் சிறப்பான
              முறையில், நீங்கள் எதிர்நோக்கும் விதத்தில் வரனை அமைத்து தந்து
              கொண்டு இருக்கிறோம்.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              திருக்கல்யாணமாலை மூலம் ஏராளமான திருமணங்களை மகிழ்ச்சியுடன் ஏற்பாடு
              செய்து வருகிறோம். நீங்கள் விரும்பும் வரன்களை எங்கள் சேவை மையத்தில்
              இருந்து நீங்களே தேர்வு செய்யலாம்.
            </p>

            {/* SPECIAL FEATURES CARD */}
            <div
              className="p-6 rounded-xl shadow-lg mb-6"
              style={{ backgroundColor: "#FFF0F5" }}
            >
              <h2
                className="text-2xl font-bold mb-3"
                style={{ color: "#C2185B" }}
              >
                சிறப்பு அம்சங்கள்:
              </h2>

              <p className="text-lg leading-relaxed">
                எங்களிடம் — மருத்துவர், பொறியாளர், தொழில் அதிபர், அரசு ஊழியர்,
                வங்கி ஊழியர்கள், தனியார் வேலை செய்பவர்கள் உள்ளிட்ட பல்வேறு
                துறைகளில் உள்ள வரன்கள் உள்ளனர்.
              </p>

              <p className="text-lg leading-relaxed mt-3">
                மறுமணம் வரன்களும் உங்கள் விருப்பத்திற்கு ஏற்ப மிக கவனமாக தேர்வு
                செய்து தரப்படுகின்றனர்.
              </p>
            </div>

            {/* SERVICE CHARGES CARD */}
            <div
              className="p-6 rounded-xl shadow-lg mb-6"
              style={{ backgroundColor: "#FFFFFF" }}
            >

              <p className="text-lg font-semibold mt-3">
                மேலும் விவரங்களுக்கு:{" "}
                <span style={{ color: "#C2185B" }}>9655326468</span>
              </p>

              <p
                className="text-lg font-bold mt-2"
                style={{ color: "#D81B60" }}
              >
                * எந்த வகை கமிஷனும் கிடையாது
              </p>
            </div>

            {/* CALL BUTTON */}
            <div className="text-center mt-8">
              <a
                href="tel:9655326468"
                className="px-10 py-3 rounded-lg sm:text-[20px] font-bold shadow-md transition-all hover:opacity-95 active:scale-95"
                style={{ backgroundColor: "#D4A437", color: "#212121" }}
              >
                அழைக்க கிளிக் செய்யவும்
              </a>
            </div>
          </>
        ) : (
          <>
            {/* ENGLISH CONTENT */}
            <p className="text-lg leading-relaxed mb-6">
              Our service has been helping all communities for over 30 years,
              arranging suitable matches exactly as you expect.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Through our Thirukkalyanam Matrimony Centre, we have arranged many
              successful marriages. You can choose your preferred match from our
              available profiles.
            </p>

            {/* SPECIAL FEATURES CARD */}
            <div
              className="p-6 rounded-xl shadow-lg mb-6"
              style={{ backgroundColor: "#FFF0F5" }}
            >
              <h2
                className="text-2xl font-bold mb-3"
                style={{ color: "#C2185B" }}
              >
                Special Features:
              </h2>

              <p className="text-lg leading-relaxed">
                Profiles available from various fields — Doctors, Engineers,
                Business owners, Government employees, Bankers, Private
                employees, and many more.
              </p>

              <p className="text-lg leading-relaxed mt-3">
                Second marriage profiles are also arranged carefully.
              </p>
            </div>

            {/* SERVICE CHARGES CARD */}
            <div
              className="p-6 rounded-xl shadow-lg mb-6"
              style={{ backgroundColor: "#FFFFFF" }}
            >

              <p className="text-lg font-semibold mt-3">
                For more details:{" "}
                <span style={{ color: "#C2185B" }}>9655326468</span>
              </p>

              <p
                className="text-lg font-bold mt-2"
                style={{ color: "#D81B60" }}
              >
                * No commission charged
              </p>
            </div>

            {/* CALL BUTTON */}
            <div className="text-center mt-8">
              <a
                href="tel:9655326468"
                className="px-10 py-3 rounded-lg text-lg font-bold shadow-md transition-all hover:opacity-95 active:scale-95"
                style={{ backgroundColor: "#D4A437", color: "#212121" }}
              >
                Click to Call
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
