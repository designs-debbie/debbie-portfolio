// Debbie portfolio interactions

// Typing headline
const typingElement = document.getElementById("typing");
const roles = [
  "modern websites",
  "responsive experiences",
  "creative digital ideas",
  "useful web applications"
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function runTypingEffect() {
  if (!typingElement) return;
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typingElement.textContent = currentRole.slice(0, charIndex);
  let delay = isDeleting ? 38 : 75;

  if (!isDeleting && charIndex === currentRole.length) {
    isDeleting = true;
    delay = 1500;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 350;
  }

  window.setTimeout(runTypingEffect, delay);
}
if (typingElement) runTypingEffect();

// Accessible mobile navigation
const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

function closeMenu() {
  if (!menuBtn || !navbar) return;
  navbar.classList.remove("active");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "Open navigation menu");
  document.body.classList.remove("menu-open");
}

if (menuBtn && navbar) {
  menuBtn.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("active");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    document.body.classList.toggle("menu-open", isOpen);
  });

  navbar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) closeMenu();
  });
}

// Contact form: Formspree receives submissions and emails the account configured there.
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");

if (contactForm && formMessage && submitBtn) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    formMessage.textContent = "";
    formMessage.className = "form-message";

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const originalButtonText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Sending…";
    formMessage.textContent = "Sending your message…";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        formMessage.textContent = "Thank you! Your message was sent successfully.";
        formMessage.classList.add("success");
        contactForm.reset();
      } else {
        let details = {};
        try { details = await response.json(); } catch (_) {}
        const serverMessage = details.errors?.map((item) => item.message).join(" ");
        throw new Error(serverMessage || "Formspree could not accept the message. Check your form setup and try again.");
      }
    } catch (error) {
      formMessage.textContent = error.message || "Something went wrong. Please try again in a moment.";
      formMessage.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalButtonText;
    }
  });
}

// Footer year
const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();
