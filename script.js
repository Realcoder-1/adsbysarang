const bookingConfig = {
  bookingUrl: "https://calendly.com/adsbysarang/creative-audit",
  webhookUrl: ""
};

const isPlaceholderBookingUrl =
  !bookingConfig.bookingUrl || bookingConfig.bookingUrl.includes("your-account");

const tabButtons = document.querySelectorAll(".tab-button");
const panels = {
  calendar: document.getElementById("calendar-panel"),
  form: document.getElementById("lead-form")
};

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const activeTab = button.dataset.tab;

    tabButtons.forEach((tab) => tab.classList.toggle("active", tab === button));
    Object.entries(panels).forEach(([name, panel]) => {
      if (panel) {
        panel.classList.toggle("active", name === activeTab);
      }
    });
  });
});

const bookingLink = document.getElementById("booking-link");
const calendlyWidget = document.getElementById("calendly-widget");

if (calendlyWidget && !isPlaceholderBookingUrl) {
  calendlyWidget.dataset.url = `${bookingConfig.bookingUrl}?hide_gdpr_banner=1`;

  const calendlyScript = document.createElement("script");
  calendlyScript.src = "https://assets.calendly.com/assets/external/widget.js";
  calendlyScript.async = true;
  document.body.appendChild(calendlyScript);
}

if (bookingLink) {
  bookingLink.href = bookingConfig.bookingUrl;
  bookingLink.addEventListener("click", (event) => {
    if (isPlaceholderBookingUrl) {
      event.preventDefault();
      const formNote = document.getElementById("form-note");
      const formTab = document.querySelector('[data-tab="form"]');

      if (formNote) {
        formNote.textContent =
          "Add your live booking URL in script.js, or use the form tab for webhook capture.";
      }

      if (formTab) {
        formTab.click();
      }
    }
  });
}

const leadForm = document.getElementById("lead-form");

if (leadForm) {
  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const note = document.getElementById("form-note");
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.source = "adsbysarang creative landing page";
    payload.requestedAt = new Date().toISOString();

    if (!bookingConfig.webhookUrl) {
      note.textContent = `Webhook not connected yet. Payload ready: ${JSON.stringify(payload)}`;
      return;
    }

    try {
      const response = await fetch(bookingConfig.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}`);
      }

      form.reset();
      note.textContent = "Request sent. Check your CRM, automation tool, or webhook destination.";
    } catch (error) {
      note.textContent = `Could not send request: ${error.message}`;
    }
  });
}
