import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative z-10 bg-gray-900 text-gray-300 py-8">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-lg font-bold text-white">About Developer</h2>
          <p className="mt-2 text-sm">
            B.Tech in Computer Science & Business at IIIT Lucknow. Passionate
            about MERN Stack, Software Development, and Competitive Programming.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-bold text-white">Quick Links</h2>
          <ul className="mt-2 text-sm space-y-2">
            <li>
              <Link to="/" className="hover:text-blue-400 transition">
                Home
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/LCB2021051?tab=repositories"
                className="hover:text-blue-400 transition"
              >
                Projects
              </a>
            </li>

            <li>Contact</li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-lg font-bold text-white">Contact</h2>
          <ul className="mt-2 text-sm space-y-2">
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-blue-400" />
              <a
                href="mailto:lcb2021051@iiitl.ac.in"
                className="hover:text-blue-400 transition"
              >
                lcb2021051@iiitl.ac.in
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaPhone className="text-blue-400" />
              <a
                href="tel:+919631163216"
                className="hover:text-blue-400 transition"
              >
                +91-9631163216
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="mt-8 text-center">
        <h2 className="text-lg font-bold text-white">Follow Me</h2>
        <div className="flex justify-center gap-6 mt-3">
          <a
            href="https://github.com/LCB2021051"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/vivek-korah-0b39b7233/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition"
          >
            <FaLinkedin size={24} />
          </a>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Vivek Korah. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
