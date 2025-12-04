import React, { useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    emailjs
      .send("service_1999c0q", "YOUR_TEMPLATE_ID", formData, "YOUR_PUBLIC_KEY")
      .then(() => {
        setSuccess("Message sent successfully!");
        setFormData({ name: "", phone: "", email: "", message: "" });
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to send message. Try again later.");
        setLoading(false);
      });
  };

  const sendWhatsApp = () => {
    const text = `Hello, I am ${formData.name || "User"}.
Phone: ${formData.phone || "N/A"}
Message: ${formData.message || ""}`;

    window.open(
      `https://wa.me/9655326468?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <footer
      className="pt-14 pb-10"
      style={{ backgroundColor: "#333333", color: "white" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* GRID: 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* ------------------------------------- */}
          {/* COLUMN 1: About + Quick Links + Contact */}
          {/* ------------------------------------- */}
          <div className="space-y-10">

            {/* About */}
            <div>
              <h3 className="text-4xl font-bold" style={{ color: "#C2185B" }}>
                Thirukalyanamalai
              </h3>
              <p className="text-sm mt-2 leading-relaxed">
                A trusted platform helping thousands find their perfect life
                partner. Secure, reliable, and easy to use.
              </p>
            </div>

            {/* Quick Links & Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

              {/* Quick Links */}
              <div>
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ color: "#D4A437" }}
                >
                  Quick Links
                </h3>

                <ul className="space-y-2 text-sm">
                  <li><Link to="/" className="hover:underline">Home</Link></li>
                  <li><Link to="/about" className="hover:underline">About Us</Link></li>
                  <li><Link to="/service" className="hover:underline">Service</Link></li>
                  <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ color: "#C2185B" }}
                >
                  Contact Info
                </h3>

                <p className="text-sm">
                  <strong className="text-red-400">3/8 Pandiyan Nagar</strong>
                </p>

                <p className="text-sm">Near Govt Hospital, Virudhunagar</p>

                <p className="text-sm mt-3">Mon – Sat : 9:30 AM – 8:00 PM</p>

                <p className="text-sm mt-2">thirukalyanamalai@gmail.com</p>

                <p className="text-sm font-semibold text-[#C2185B] mt-1">
                  +91 9655326468
                </p>

                {/* Social Icons */}
                <div className="flex gap-4 mt-4">
                  <a href="https://facebook.com" target="_blank">
                    <FaFacebook size={22} className="hover:scale-125 transition" style={{ color: "#4267B2" }} />
                  </a>

                  <a href="https://instagram.com" target="_blank">
                    <FaInstagram size={22} className="hover:scale-125 transition" style={{ color: "#E1306C" }} />
                  </a>

                  <a href="https://wa.me/9655326468" target="_blank">
                    <FaWhatsapp size={22} className="hover:scale-125 transition" style={{ color: "#25D366" }} />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* ------------------------------------- */}
          {/* COLUMN 2: LOCATION MAP */}
          {/* ------------------------------------- */}
          <div>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "#FFC107" }}
            >
              Location Map
            </h3>
            <iframe
              title="Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.6173397089065!2d77.95827857471437!3d9.585388690467665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06dff4a0cc5adf%3A0x8f4bb1b475e829e2!2sGovernment%20Hospital%20Virudhunagar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="260"
              style={{ border: 0, borderRadius: "10px" }}
              loading="lazy"
            ></iframe>
          </div>

          {/* ------------------------------------- */}
          {/* COLUMN 3: MESSAGE FORM */}
          {/* ------------------------------------- */}
          <div>
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: "#FFC107" }}
            >
              Send Message
            </h3>

            <form
              onSubmit={handleSubmit}
              className="p-6 rounded-lg space-y-4 shadow-lg"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="p-3 rounded w-full text-black bg-white border border-[#C2185B]"
                required
              />

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="p-3 rounded w-full text-black bg-white border border-[#C2185B]"
                required
              />

              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="p-3 rounded w-full text-black bg-white border border-[#C2185B]"
                required
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                rows="3"
                className="p-3 rounded w-full text-black bg-white border border-blue-700"
                required
              />

              {success && <p className="text-green-400">{success}</p>}
              {error && <p className="text-red-400">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded font-bold text-white"
                  style={{ backgroundColor: "#C2185B" }}
                >
                  {loading ? "Sending..." : "Send Email"}
                </button>

                <button
                  type="button"
                  onClick={sendWhatsApp}
                  className="flex-1 py-3 rounded font-bold text-white"
                  style={{ backgroundColor: "#C2185B" }}
                >
                  WhatsApp
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="text-center mt-12 pt-6 text-sm border-t border-white/20">
          © {new Date().getFullYear()} Thirukalyanamalai <br />
          Developed by <b>Alagu Tech Solutions</b>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
