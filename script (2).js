// Restrained scroll-reveal for section headers and cards.
// Respects prefers-reduced-motion via CSS; this only toggles a class.
(function () {
  const revealTargets = document.querySelectorAll(
    '.process-step, .education-grid, .guarantee-inner, .faq-item, .footer-main'
  );

  revealTargets.forEach((el) => el.classList.add('reveal'));

  if (!('IntersectionObserver' in window)) {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((el) => observer.observe(el));

  // Only one FAQ item open at a time — keeps the list scannable.
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // Signup form — posts to /api/subscribe, which inserts into Supabase
  // and sends a notification email. No page reload.
  const form = document.getElementById('signupForm');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const statusEl = document.getElementById('signupStatus');
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;

      const payload = {
        practiceName: form.practiceName.value.trim(),
        contactName: form.contactName.value.trim(),
        email: form.email.value.trim(),
        honeypot: form.company_website.value, // should always be empty for real users
      };

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      statusEl.textContent = '';
      statusEl.classList.remove('is-success', 'is-error');

      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.error || 'Something went wrong. Please try again.');
        }

        form.reset();
        statusEl.textContent = "Got it — we'll follow up with your ad shortly.";
        statusEl.classList.add('is-success');
      } catch (err) {
        statusEl.textContent = err.message || 'Something went wrong. Please email us directly instead.';
        statusEl.classList.add('is-error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }
})();
