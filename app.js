document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // GA4 helper
  // -----------------------------
  function track(eventName, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params || {});
    }
  }

  function bindClick(selector, eventName, params) {
    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener("click", () => track(eventName, params));
    });
  }

  // -----------------------------
  // GA4 click tracking
  // -----------------------------
  bindClick('.nav__actions a[href="#contact"]', "nav_quote_click", {
    location: "nav",
  });

  bindClick('a.btn--primary[href="#contact"]', "cta_quote_click", {
    location: "page",
  });

  bindClick('a[href^="tel:"]', "call_click", { location: "site" });
  bindClick('a[href^="sms:"]', "text_click", { location: "site" });
  bindClick('a[href*="wa.me/"]', "whatsapp_click", { location: "site" });

  // -----------------------------
  // Quick Quote Starter -> Prefill + Track
  // -----------------------------
  const nameInput = document.getElementById("nameInput");
  const btnGreet = document.getElementById("btnGreet");
  const messageEl = document.getElementById("message");

  const contactName = document.getElementById("contactName");
  const contactSection = document.getElementById("contact");

  function startQuickQuote() {
    const name = (nameInput?.value || "").trim();
    if (!name) {
      if (messageEl) messageEl.textContent = "Please enter your name to continue.";
      return;
    }

    // Track micro-lead
    track("quick_quote_started", { location: "hero_card" });

    // Prefill contact form name
    if (contactName) contactName.value = name;

    // Update helper text
    if (messageEl) messageEl.innerHTML = `<strong>Nice, ${name}.</strong> I’ll pre-fill your name below — just send your message.`;

    // Scroll to contact
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  if (btnGreet) btnGreet.addEventListener("click", startQuickQuote);
  if (nameInput) {
    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") startQuickQuote();
    });
  }

  // -----------------------------
  // Formspree inline submit (no redirect)
  // -----------------------------
  const form = document.getElementById("quote-form");
  const status = document.getElementById("formStatus");

  if (form && status) {
    form.querySelectorAll("input, textarea").forEach((el) => {
      el.addEventListener("input", () => {
        status.textContent = "";
        status.className = "form-status";
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      track("quote_form_submit_attempt", { location: "contact_form" });

      const data = new FormData(form);
      const button = form.querySelector('button[type="submit"]');

      if (button) {
        button.disabled = true;
        button.textContent = "Sending...";
      }

      status.textContent = "";
      status.className = "form-status";

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          status.innerHTML =
            "<strong>Message received.</strong><br>I'll personally review it and reply within 24 hours.";
          status.className = "form-status success";

          track("quote_form_submit_success", { location: "contact_form" });

          form.reset();
        } else {
          status.textContent = "Something went wrong. Please try again.";
          status.className = "form-status error";

          track("quote_form_submit_error", { location: "contact_form" });
        }
      } catch (err) {
        status.textContent = "Network error. Please try again.";
        status.className = "form-status error";

        track("quote_form_submit_error", { location: "contact_form" });
      }

      if (button) {
        button.disabled = false;
        button.textContent = "Request a Quote";
      }
    });
  }
});

