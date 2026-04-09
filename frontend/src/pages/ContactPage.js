import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

function ContactPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Validation for Name (only letters and spaces)
    const nameInput = document.getElementById("name");
    if (nameInput) {
      nameInput.addEventListener("input", function () {
        const name = this.value;
        const errorSpan = document.getElementById("name-error");
        if (errorSpan) {
          if (!/^[A-Za-z\s]+$/.test(name) && name !== "") {
            errorSpan.style.display = "block";
          } else {
            errorSpan.style.display = "none";
          }
        }
        setFormData((prev) => ({ ...prev, name }));
      });
    }

    // Validation for Email (valid email format)
    const emailInput = document.getElementById("email");
    if (emailInput) {
      emailInput.addEventListener("input", function () {
        const email = this.value;
        const errorSpan = document.getElementById("email-error");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (errorSpan) {
          if (!emailRegex.test(email) && email !== "") {
            errorSpan.style.display = "block";
          } else {
            errorSpan.style.display = "none";
          }
        }
        setFormData((prev) => ({ ...prev, email }));
      });
    }

    // Validation for Message (minimum 10 characters)
    const messageInput = document.getElementById("message");
    if (messageInput) {
      messageInput.addEventListener("input", function () {
        const message = this.value;
        const errorSpan = document.getElementById("message-error");
        if (errorSpan) {
          if (message.length < 10 && message !== "") {
            errorSpan.style.display = "block";
          } else {
            errorSpan.style.display = "none";
          }
        }
        setFormData((prev) => ({ ...prev, message }));
      });
    }

    // Cleanup event listeners on unmount
    return () => {
      if (nameInput) {
        nameInput.removeEventListener("input", function () {});
      }
      if (emailInput) {
        emailInput.removeEventListener("input", function () {});
      }
      if (messageInput) {
        messageInput.removeEventListener("input", function () {});
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check all error spans are hidden (no validation errors)
    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const messageError = document.getElementById("message-error");

    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let isValid = true;

    // Final validation checks
    if (!nameRegex.test(formData.name) || formData.name === "") {
      if (nameError) nameError.style.display = "block";
      isValid = false;
    }

    if (!emailRegex.test(formData.email) || formData.email === "") {
      if (emailError) emailError.style.display = "block";
      isValid = false;
    }

    if (formData.message.length < 10) {
      if (messageError) messageError.style.display = "block";
      isValid = false;
    }

    if (isValid) {
      if (!user) {
        alert("Please log in to send a message.");
        return;
      }
      try {
        await API.post("/auth/contact", formData);
        setIsSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setIsSubmitted(false), 3000);
      } catch (err) {
        console.error("Send failed:", err);
        alert("Failed to send message. Please try again.");
      }
    }
  };

  return (
    <>
      <section className="contact-form">
        <h2>Contact Me</h2>
        <p className="contact-message">
          Feel free to reach out with questions, feedback, or collaboration
          ideas.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            placeholder="Your Name"
            required
            pattern="[A-Za-z\s]+"
            title="Name should only contain letters and spaces."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <span id="name-error" style={{ color: "red", display: "none" }}>
            Name should only contain letters and spaces.
          </span>

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Your Email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <span id="email-error" style={{ color: "red", display: "none" }}>
            Please enter a valid email address.
          </span>

          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            placeholder="Your Message"
            rows="5"
            required
            minLength="10"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
          ></textarea>
          <span id="message-error" style={{ color: "red", display: "none" }}>
            Message must be at least 10 characters.
          </span>

          <button type="submit">Submit</button>
          {isSubmitted && (
            <p
              style={{
                color: "green",
                marginTop: "10px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Message sent successfully!
            </p>
          )}
        </form>
      </section>

      <section className="resources">
        <h3>Helpful Resources</h3>
        <section className="previews">
          <div className="preview">
            <a
              href="https://www.netflix.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2>Netflix</h2>
              <p>Discover movies from different genres.</p>
            </a>
          </div>
          <div className="preview">
            <a
              href="https://store.steampowered.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2>Steam</h2>
              <p>Gaming news, reviews, and community discussions.</p>
            </a>
          </div>
          <div className="preview">
            <a
              href="https://www.wattpad.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2>Wattpad</h2>
              <p>Review books, find recommendation and favorite stories.</p>
            </a>
          </div>
          <div className="preview">
            <a
              href="https://www.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2>Spotify</h2>
              <p>Find your music taste from differennt genres and albums</p>
            </a>
          </div>
        </section>

        <h2 className="map-caption">Find Me Here!</h2>

        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30633.452904030575!2d120.40875700380468!3d16.313662051691804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3391768fec3ac033%3A0xafbc5c00a6b2a3e0!2sPideg%2C%20Tubao%2C%20La%20Union!5e0!3m2!1sen!2sph!4v1768271524726!5m2!1sen!2sph"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
          ></iframe>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
