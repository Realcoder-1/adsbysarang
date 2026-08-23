# Practice Ad Offer — Landing Page

A static, zero-build landing page for the "free ad, built before you say yes"
offer. Pure HTML/CSS/JS — no framework, no build step, deploys to Vercel as-is.

## Before you deploy — replace these placeholders

Search each file for the bracketed placeholders below and replace with your
real details.

| Placeholder | Where | Replace with |
|---|---|---|
| `[Your Agency Name]` | `index.html` (title, nav, footer) | Your actual business/brand name |
| `you@youragency.com` | `index.html` (3 mailto links) | Your real sending email address |
| `[Your City / Service Area]` | `index.html` (footer) | e.g. "Dallas–Fort Worth, TX" |

Tip: use your editor's find-and-replace across the whole folder rather than
editing each spot manually.

## Run it locally

No build step required. Either:

- Open `index.html` directly in a browser, or
- Serve it locally for a closer-to-production preview:
  ```bash
  npx serve .
  ```

## Deploy to Vercel

1. Push this folder to a new GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import that repository.
3. Vercel will auto-detect it as a static site — no framework preset needed,
   no build command required. Click **Deploy**.
4. Once live, you can attach a custom domain under
   **Project → Settings → Domains** (see the earlier conversation on
   domain/email setup if you're pointing a custom domain here).

## File structure

```
.
├── index.html      # All page content and structure
├── styles.css      # Design tokens, layout, type system
├── script.js       # FAQ accordion behavior + scroll-reveal
├── vercel.json     # Static deploy config (clean URLs)
└── README.md       # This file
```

## Editing content

- **FAQ items** — each is a `<details class="faq-item">` block in
  `index.html`. Copy/paste the block to add another question.
- **Process steps** — the four `.process-step` items are a real sequence
  (build → review → run → scale), so keep them numbered and in order if you
  edit the copy.
- **Guarantee seal** — the circular graphic in the `.guarantee` section is
  inline SVG with text set on a circular path. Edit the `<text>` elements
  directly if you change the guarantee wording.

## What this page intentionally does NOT do

- No fabricated testimonials, client logos, or review counts. Add real ones
  once you have them — don't fill these in with placeholder numbers, since
  fake social proof undermines the trust this page is built around.
- No specific outcome or return is promised anywhere in the copy (see the
  disclaimers in the "How this actually works" and footer sections). Keep
  it that way if you edit this content — overpromising results is both a
  trust risk and, in some regions, a healthcare-marketing compliance risk.
