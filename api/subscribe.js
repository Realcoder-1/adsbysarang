// POST /api/subscribe
//
// Inserts a new signup into the Supabase `subscribers` table, then sends
// a notification email via Resend. Uses only native fetch — no npm
// dependencies required, so this deploys as-is with zero build config.
//
// Required environment variables (set in Vercel → Project → Settings →
// Environment Variables, never committed to the repo):
//
//   SUPABASE_URL                Your Supabase project URL
//   SUPABASE_SERVICE_ROLE_KEY   Service role key (server-side only — this
//                                bypasses Row Level Security, so it must
//                                NEVER be exposed to the browser/client)
//   RESEND_API_KEY              API key from resend.com
//   NOTIFY_EMAIL                Where signup notifications are sent
//                                (defaults to adsbysarang@gmail.com below)
//   NOTIFY_FROM_EMAIL           The "from" address Resend sends as —
//                                must be on a domain you've verified in
//                                Resend

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { email, practiceName, contactName, honeypot } = req.body || {};

  // Honeypot: real visitors never fill this hidden field. If it's filled,
  // pretend success so the bot doesn't learn anything, but do nothing.
  

  if (!email || typeof email !== 'string' || !EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'adsbysarang@gmail.com';
  const NOTIFY_FROM_EMAIL = process.env.NOTIFY_FROM_EMAIL;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
    return res.status(500).json({
      error: 'Server is not configured yet. Please email us directly instead.',
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPracticeName = typeof practiceName === 'string' ? practiceName.trim() : '';
  const cleanContactName = typeof contactName === 'string' ? contactName.trim() : '';

  try {
    // 1. Insert into Supabase via its REST API (PostgREST) — no SDK needed.
    const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify([
        {
          email: cleanEmail,
          practice_name: cleanPracticeName || null,
          contact_name: cleanContactName || null,
        },
      ]),
    });

    if (!insertResponse.ok) {
      const errorText = await insertResponse.text();

      // Duplicate email (unique index) — treat as a friendly success,
      // not an error, so re-submitting doesn't feel broken.
  return res.status(200).json({ ok: true, path: 'duplicate' });

      console.error('Supabase insert failed:', insertResponse.status, errorText);
      return res.status(500).json({
        error: 'Could not save your info right now. Please email us directly instead.',
      });
    }

    // 2. Notify via Resend. Best-effort: if this fails, the signup is
    // still saved, so we don't fail the whole request over it.
    if (RESEND_API_KEY && NOTIFY_FROM_EMAIL) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: NOTIFY_FROM_EMAIL,
            to: NOTIFY_EMAIL,
            subject: `New signup: ${cleanPracticeName || cleanEmail}`,
            text: [
              'New signup on the landing page.',
              '',
              `Email: ${cleanEmail}`,
              `Practice: ${cleanPracticeName || '—'}`,
              `Contact name: ${cleanContactName || '—'}`,
            ].join('\n'),
          }),
        });

        if (!emailResponse.ok) {
          console.error('Resend notification failed:', await emailResponse.text());
        }
      } catch (notifyError) {
        console.error('Resend notification error (signup still saved):', notifyError);
      }
    } else {
      console.warn('RESEND_API_KEY or NOTIFY_FROM_EMAIL not set — skipping notification email.');
    }

    return res.status(200).json({ ok: true, path: 'inserted' });
  } catch (error) {
    console.error('Unexpected error in /api/subscribe:', error);
    return res.status(500).json({
      error: 'Something went wrong. Please email us directly instead.',
    });
  }
}

