document.addEventListener("DOMContentLoaded", function () {
  // -----------------------------
  // Anime.js — Hero entrance
  // -----------------------------
  if (
    window.anime &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const { animate, stagger } = window.anime;

    const heroTextItems = document.querySelectorAll(
      ".hero__title, .hero__subtitle, .hero__trust, .hero__cta, .hero__badges, .trust-strip"
    );

    if (heroTextItems.length > 0) {
      animate(heroTextItems, {
        opacity: {
          from: 0,
          to: 1,
        },
        y: {
          from: 22,
          to: 0,
        },
        duration: 750,
        delay: stagger(90),
        ease: "outExpo",
      });
    }

    const heroQuoteCard = document.querySelector(".hero__right");

    if (heroQuoteCard) {
      animate(heroQuoteCard, {
        opacity: {
          from: 0,
          to: 1,
        },
        x: {
          from: 28,
          to: 0,
        },
        duration: 900,
        delay: 260,
        ease: "outExpo",
      });
    }

    // -----------------------------
    // Anime.js — Service cards reveal
    // -----------------------------
    const servicesSection = document.querySelector("#services");
    const serviceCards = document.querySelectorAll(".az-service-card");

    if (servicesSection && serviceCards.length > 0) {
      serviceCards.forEach(function (card) {
        card.style.opacity = "0";
      });

      if ("IntersectionObserver" in window) {
        const servicesObserver = new IntersectionObserver(
          function (entries, observer) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting) {
                return;
              }

              animate(serviceCards, {
                opacity: {
                  from: 0,
                  to: 1,
                },
                duration: 650,
                delay: stagger(110),
                ease: "outQuad",
              });

              observer.unobserve(entry.target);
            });
          },
          {
            threshold: 0.18,
          }
        );

        servicesObserver.observe(servicesSection);
      } else {
        serviceCards.forEach(function (card) {
          card.style.opacity = "1";
        });
      }
    }
  }

  // -----------------------------
  // GA4 helper
  // -----------------------------
  function track(eventName, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params || {});
    }
  }

  function bindClick(selector, eventName, params) {
    var els = document.querySelectorAll(selector);

    for (var i = 0; i < els.length; i++) {
      els[i].addEventListener("click", function () {
        track(eventName, params);
      });
    }
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

  bindClick('a[href^="tel:"]', "call_click", {
    location: "site",
  });

  bindClick('a[href^="sms:"]', "text_click", {
    location: "site",
  });

  bindClick('a[href*="wa.me/"]', "whatsapp_click", {
    location: "site",
  });

  // -----------------------------
  // Quick Quote Starter -> Prefill + Track
  // -----------------------------
  var nameInput = document.getElementById("nameInput");
  var btnGreet = document.getElementById("btnGreet");
  var messageEl = document.getElementById("message");

  var contactName = document.getElementById("contactName");
  var contactMessage = document.getElementById("contactMessage");
  var contactSection = document.getElementById("contact");

  function scrollToContact() {
    if (contactSection && typeof contactSection.scrollIntoView === "function") {
      contactSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.location.hash = "#contact";
    }
  }

  function startQuickQuote() {
    var name = "";

    if (nameInput && typeof nameInput.value === "string") {
      name = nameInput.value.trim();
    }

    if (!name) {
      if (messageEl) {
        messageEl.textContent = "Please enter your name to continue.";
      }

      return;
    }

    track("quick_quote_started", {
      location: "hero_card",
    });

    if (contactName) {
      contactName.value = name;
    }

    if (contactMessage && !contactMessage.value.trim()) {
      contactMessage.value =
        "Hi, my name is " +
        name +
        ". I would like a quote for a project with AZ GraphixTech.";
    }

    if (messageEl) {
      messageEl.textContent =
        "Nice, " +
        name +
        ". I’ll pre-fill your name below — just send your message.";
    }

    scrollToContact();
  }

  if (btnGreet) {
    btnGreet.addEventListener("click", startQuickQuote);
  }

  if (nameInput) {
    nameInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        startQuickQuote();
      }
    });
  }

  // -----------------------------
  // Quick Quote buttons -> Prefill contact message
  // -----------------------------
  var quoteButtons = document.querySelectorAll("[data-template]");

  var templates = {
    website:
      "Hi, I’m interested in a website quote for my business. Please send me pricing and timeline information.",

    logo:
      "Hi, I’m interested in a logo or branding quote. I would like to know the process, pricing, and turnaround time.",

    qr:
      "Hi, I’m interested in a QR code setup for my business. Please send me more information about pricing and options.",

    support:
      "Hi, I need tech support. Please contact me so I can explain the issue and get a quote.",
  };

  for (var q = 0; q < quoteButtons.length; q++) {
    quoteButtons[q].addEventListener("click", function () {
      var templateType = this.getAttribute("data-template");

      if (templateType && templates[templateType]) {
        if (contactMessage) {
          contactMessage.value = templates[templateType];
        }

        track("quote_template_click", {
          template: templateType,
          location: "quick_quote_section",
        });

        scrollToContact();
      }
    });
  }

  // -----------------------------
  // Formspree inline submit (no redirect)
  // -----------------------------
  var form = document.getElementById("quote-form");
  var status = document.getElementById("formStatus");

  if (form && status) {
    var fields = form.querySelectorAll("input, textarea");

    for (var f = 0; f < fields.length; f++) {
      fields[f].addEventListener("input", function () {
        status.textContent = "";
        status.className = "form-status";
      });
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      track("quote_form_submit_attempt", {
        location: "contact_form",
      });

      var data = new FormData(form);
      var button = form.querySelector('button[type="submit"]');

      if (button) {
        button.disabled = true;
        button.textContent = "Sending...";
      }

      status.textContent = "";
      status.className = "form-status";

      try {
        var response = await fetch(form.action, {
          method: "POST",
          body: data,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          status.innerHTML =
            "<strong>Message received.</strong><br>I’ll personally review it and reply within 24 hours.";

          status.className = "form-status success";

          track("quote_form_submit_success", {
            location: "contact_form",
          });

          form.reset();
        } else {
          status.textContent = "Something went wrong. Please try again.";
          status.className = "form-status error";

          track("quote_form_submit_error", {
            location: "contact_form",
          });
        }
      } catch (err) {
        status.textContent = "Network error. Please try again.";
        status.className = "form-status error";

        track("quote_form_submit_error", {
          location: "contact_form",
        });
      }

      if (button) {
        button.disabled = false;
        button.textContent = "Request a Quote";
      }
    });
  }
});

