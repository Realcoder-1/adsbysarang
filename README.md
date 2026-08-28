# adsbysarang landing page

Static landing page for `adsbysarang`, adapted from the Leads by Hammad sample funnel but repositioned for brand-catered ad creatives for venture-backed companies.

## Files

- `index.html` - page structure and landing-page copy
- `book.html` - dedicated calendar booking page
- `styles.css` - responsive visual design
- `script.js` - tab interaction, booking link, and optional webhook form submit

## Booking setup

Fastest path: create a calendar event in Calendly, Cal.com, SavvyCal, or GoHighLevel, then replace `bookingUrl` in `script.js`. The landing page sends visitors to `book.html`, where the calendar is embedded.

Form path: keep the form and set `webhookUrl` in `script.js` to a Zapier, Make, n8n, HubSpot, Salesforce, or GoHighLevel webhook endpoint. This is optional and is not required for calendar booking.

Best production path: use both. Send the prospect to a calendar for instant booking, and also fire a webhook so the lead record, Slack alert, email follow-up, and pipeline stage are created automatically.

## Offer questions to refine next

- Should the offer be priced as a one-time creative sprint, monthly creative testing, or performance creative retainer?
- Which channels should the first creative examples emphasize: LinkedIn, Meta, X, YouTube Shorts, or TikTok?
- What exact deliverables should be promised: number of ad concepts, scripts, statics, hooks, or revisions?
- Where should booked-call requests go: HubSpot, Salesforce, GoHighLevel, Close, Pipedrive, Slack, or custom webhook?
