// AZ GraphixTech — app.js
// Clean, professional SPA navigation + interactions
// No CSS changes required

document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     ELEMENTS
  ========================= */

  const messageEl = document.getElementById("message");
  const countEl = document.getElementById("count");

  const btnPrimary = document.getElementById("btnPrimary");
  const btnSecondary = document.getElementById("btnSecondary");
  const btnReset = document.getElementById("btnReset");

  const nameInput = document.getElementById("nameInput");
  const btnGreet = document.getElementById("btnGreet");

  const contactForm = document.getElementById("contactForm");
  const contactName = document.getElementById("contactName");
  const contactEmail = document.getElementById("contactEmail");
  const contactMessage = document.getElementById("contactMessage");
  const formStatus = document.getElementById("formStatus");

  const navLinks = document.querySelectorAll("[data-section]");
  const sections = document.querySelectorAll("section[id]");

  /* =========================
     STATE
  ========================= */

  let clickCount = 0;

  /* =========================
     HELPERS
  ========================= */

  function updateCount() {
    if (countEl) countEl.innerText = String(clickCount);
  }

  function setMessage(text) {
    if (messageEl) messageEl.innerText = text;
  }

  function showSection(targetId) {
    sections.forEach((section) => {
      section.classList.toggle("hidden", section.id !== targetId);
    });
  }

  /* =========================
     NAVIGATION (SPA)
  ========================= */

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.dataset.section;
      if (target) showSection(target);
    });
  });

  // Show HOME by default
  showSection("home");

  /* =========================
     DEMO / COUNTER (OPTIONAL)
  ========================= */

  function incrementCount() {
    clickCount += 1;
    updateCount();
  }

  if (btnPrimary) {
    btnPrimary.addEventListener("click", () => {
      incrementCount();
      setMessage("Thanks for checking out AZ GraphixTech 🚀");
    });
  }

  if (btnSecondary) {
    btnSecondary.addEventListener("click", () => {
      incrementCount();
      setMessage("Websites, Branding, QR Codes, Tech Support & Automation.");
    });
  }

  if (btnReset) {
    btnReset.addEventListener("click", () => {
      clickCount = 0;
      updateCount();
      setMessage("");
    });
  }

  /* =========================
     QUOTE STARTER (NAME)
  ========================= */

  if (btnGreet) {
    btnGreet.addEventListener("click", () => {
      const name = (nameInput?.value || "").trim();

      if (!name) {
        setMessage("Please enter your name 👋");
        return;
      }

      setMessage(`Thanks, ${name}! ✅ Let’s get you a quick quote below.`);

      showSection("contact");
    });
  }

  /* =========================
     CONTACT FORM (FRONT-END)
  ========================= */

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = (contactName?.value || "").trim();
      const email = (contactEmail?.value || "").trim();
      const msg = (contactMessage?.value || "").trim();

      if (!name || !email || !msg) {
        formStatus.innerText = "Please fill in all fields.";
        formStatus.className = "form-status error";
        return;
      }

      formStatus.innerText =
        "Message sent! ✅ I’ll reply with pricing and timeline.";
      formStatus.className = "form-status success";

      contactForm.reset();
    });
  }

  /* =========================
     INIT
  ========================= */

  updateCount();
});
/* =========================================
   HERO BUTTON NAV FIX (SAFE OVERRIDE)
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-section]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = link.getAttribute("data-section");
      const target = document.getElementById(targetId);

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});
/* =========================================
   QUICK QUOTE → AUTO SCROLL TO CONTACT
   (SAFE OVERRIDE – DOES NOT BREAK EXISTING LOGIC)
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const continueBtn = document.getElementById("btnGreet");

  if (!continueBtn) return;

  continueBtn.addEventListener("click", () => {
    const nameInput = document.getElementById("nameInput");
    const contactSection = document.getElementById("contact");

    if (nameInput && nameInput.value.trim() !== "" && contactSection) {
      setTimeout(() => {
        contactSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300); // small delay so message update feels natural
    }
  });
});
// ===== QUICK QUOTE CTA -> Autofill contact message =====
(function () {
  const templateText = {
    website:
      "Hi Christian, I’d like a WEBSITE quote.\n\nBusiness name:\nPages needed (1-5):\nDo you already have a logo? (Yes/No):\nExamples/websites you like:\nDeadline:\nNotes:",
    logo: "Hi Christian, I’d like a LOGO / BRANDING quote.\n\nBusiness name:\nStyle (clean/premium/etc):\nColors you want:\nAny examples you like:\nDeadline:\nNotes:",
    qr: "Hi Christian, I’d like QR CODE SETUP.\n\nWhat should the QR link to? (menu/payment/site/social):\nDo you need a custom design? (Yes/No):\nHow many QR codes:\nDeadline:\nNotes:",
    support:
      "Hi Christian, I need TECH SUPPORT.\n\nDevice (PC/Laptop/Network/Printer):\nWhat’s the issue:\nWhen did it start:\nAny error messages:\nBest time to reach you:\nNotes:",
  };

  // Grab form fields
  const nameInput = document.getElementById("contactName");
  const emailInput = document.getElementById("contactEmail");
  const messageBox = document.getElementById("contactMessage");

  // Find all CTA buttons that have data-template
  const templateButtons = document.querySelectorAll("[data-template]");

  templateButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const key = btn.getAttribute("data-template");
      if (!key || !templateText[key]) return;

      // Let the browser jump to #contact normally
      // BUT fill message first
      if (messageBox) {
        const current = messageBox.value.trim();
        messageBox.value = current
          ? current + "\n\n" + templateText[key]
          : templateText[key];
      }

      // Optional: focus the message box so they see it worked
      setTimeout(() => {
        if (messageBox) messageBox.focus();
      }, 150);
    });
  });
})();
// Smooth scroll for any link using data-section (SAFE)
document.querySelectorAll("a[data-section]").forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const id = a.getAttribute("data-section");
    const el = document.getElementById(id);
    if (!el) return;

    // offset for sticky nav
    const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  });
});
const form = document.getElementById("quote-form");
const status = document.getElementById("formStatus");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = new FormData(form);
    const button = form.querySelector("button");

    button.disabled = true;
    button.textContent = "Sending...";

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        status.innerHTML = `
          <strong>Message received.</strong><br>
          I’ll personally review your request and respond within 24 hours.
        `;
        status.style.color = "#0a7f5a";

        form.reset();
      } else {
        status.textContent = "Something went wrong. Please try again.";
        status.style.color = "red";
      }
    } catch (error) {
      status.textContent = "Network error. Please try again.";
      status.style.color = "red";
    }

    button.disabled = false;
    button.textContent = "Request a Quote";
  });
}
