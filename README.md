# Practice Ad Offer — Landing Page

A static, zero-build landing page for the "free ad, built before you say yes"
offer. Pure HTML/CSS/JS — no framework, no build step, deploys to Vercel as-is.

## Before you deploy

`index.html` is already filled in with **Ads by Sarang** /
**adsbysarang@gmail.com** / **Dallas–Fort Worth, TX**. If any of those
change later, they appear in exactly these spots:

| Text | Where |
|---|---|
| "Ads by Sarang" | `index.html` — page title, nav bar, footer |
| "adsbysarang@gmail.com" | `index.html` — nav "Email us" button, footer |
| "Dallas–Fort Worth, TX" | `index.html` — footer |

Nothing else needs manual editing before deploying.

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
├── index.html          # All page content and structure
├── styles.css          # Design tokens, layout, type system
├── script.js           # FAQ accordion + scroll-reveal + signup form handler
├── api/
│   └── subscribe.js    # Serverless function: saves signups to Supabase, emails a notification
├── supabase/
│   └── schema.sql       # Run once in Supabase to create the subscribers table
├── vercel.json          # Static deploy config (clean URLs)
├── .env.example          # Documents required environment variables
└── README.md             # This file
```

## Setting up the email signup list (Supabase + Resend)

The "Get your free ad" form on the page saves signups to a Supabase table
and sends you a notification email whenever someone submits it. Three
things to set up before this works — all free to start.

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project (free tier is
   plenty for this).
2. Once it's created, go to **SQL Editor** → New query, paste in the
   contents of `supabase/schema.sql`, and run it. This creates the
   `subscribers` table.
3. Go to **Project Settings → API**. Copy:
   - **Project URL** → this is `SUPABASE_URL`
   - **service_role key** (not the `anon` key — the function needs the
     service role key to bypass Row Level Security) → this is
     `SUPABASE_SERVICE_ROLE_KEY`

### 2. Create a Resend account (for the notification email)

1. Go to [resend.com](https://resend.com) → sign up (free tier covers
   low-volume signup notifications easily).
2. **API Keys** → create one → this is `RESEND_API_KEY`.
3. **Domains** → add and verify the domain you're sending from (the same
   domain/DNS setup discussed for cold outreach applies here — SPF/DKIM
   need to be verified before Resend will send). Once verified, pick an
   address on it, e.g. `notifications@yourdomain.com` → this is
   `NOTIFY_FROM_EMAIL`.
   - If you don't have a verified domain yet, Resend gives you a sandbox
     sender for testing — fine for confirming the flow works before your
     domain is ready, but replace it before real signups start coming in.

### 3. Add environment variables to Vercel

In your Vercel project: **Settings → Environment Variables**, add each of
the five variables listed in `.env.example` with your real values.
Redeploy after adding them (Vercel doesn't hot-reload env vars into
already-running functions).

### 4. Where signups go

- Every submission lands as a row in the `subscribers` table in Supabase
  — view it anytime in **Table Editor → subscribers**.
- `adsbysarang@gmail.com` gets an email notification for each new signup
  (change this via the `NOTIFY_EMAIL` variable if needed).
- If the notification email fails for any reason, the signup is still
  saved — the two steps are independent, so a Resend hiccup never loses
  a lead.

### Security note

The Supabase table has Row Level Security enabled with **no public
policies** — meaning the anonymous/public API key can't read or write it
at all, even if someone found your Supabase URL. Only the server-side
function (using the service role key, which is never exposed to the
browser) can write to it. This is intentional and shouldn't be changed
without understanding the tradeoff.

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
