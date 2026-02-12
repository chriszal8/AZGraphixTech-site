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
