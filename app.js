document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quote-form");
  const status = document.getElementById("formStatus");

  if (!form || !status) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

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
          "<strong>Message received.</strong><br>I'll personally review your request and respond within 24 hours.";
        status.className = "form-status success";
        form.reset();
      } else {
        status.textContent = "Something went wrong. Please try again.";
        status.className = "form-status error";
      }
    } catch (err) {
      status.textContent = "Network error. Please try again.";
      status.className = "form-status error";
    }

    if (button) {
      button.disabled = false;
      button.textContent = "Request a Quote";
    }
  });
});
// --- GA4 Event Tracking (AZ GraphixTech) ---
(function () {
  function track(name, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params || {});
    }
  }

  function onClick(selector, eventName, params) {
    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener("click", () => track(eventName, params));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Quote CTAs
    onClick('a.btn--primary[href="#contact"]', "cta_quote_click", {
      location: "page",
    });

    // Nav CTA (top right)
    onClick('.nav__actions a[href="#contact"]', "nav_quote_click", {
      location: "nav",
    });

    // Contact methods
    onClick('a[href^="tel:"]', "call_click", { location: "site" });
    onClick('a[href^="sms:"]', "text_click", { location: "site" });
    onClick('a[href*="wa.me/"]', "whatsapp_click", { location: "site" });

    // Form submit success (fires when your success message appears)
    const form = document.getElementById("quote-form");
    if (form) {
      form.addEventListener("submit", () => {
        track("quote_form_submit_attempt", { location: "contact_form" });
      });
    }
  });
})();
