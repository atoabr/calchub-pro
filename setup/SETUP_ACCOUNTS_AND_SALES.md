# CalcHub Pro — switching on accounts, plans and sales

The app ships with **everything unlocked** (`mode: 'open'` in `config.js`). Follow these steps when you are ready to sell. Each step is done in your own accounts; never share passwords or secret keys with anyone, including an AI assistant.

| Level | Who | What they get |
|---|---|---|
| Guest | Anyone, no sign-up | Every calculator with result, formula, working and standard; SI/US; share links; recent list on the device |
| Free account | Signs in with an email link | Saved calculations and calculation sheet on all devices; 3 PDF reports a month |
| Pro / Lifetime | Paid licence key | Unlimited PDF reports and sheets, CSV export |
| Business | Paid licence key | Pro for up to 5 users; company logo on reports (coming soon) |

Email is required only when a person saves, uses the calculation sheet or downloads a PDF. That keeps first use fast, meets Apple's rule against forcing sign-up, and gives you an opted-in list of the users most likely to buy.

---

## Step 1 — Contact details (required before launch)

In `config.js` set:

- `support.email` — the address customers write to (shown on Help, Privacy, Terms and Refunds).
- `company.law` — where the company is registered (default: the Province of Ontario, Canada).

Have a lawyer review the Privacy, Terms and Refund pages (the app's Help → Policies). They describe how the app actually works, but they are not legal advice.

## Step 2 — Email sign-in with Supabase (free tier)

1. Create an account at supabase.com and a **New project** (choose the region closest to your users, e.g. Canada Central).
2. **SQL Editor → New query**: paste `supabase.sql` from this folder and press **Run**. It creates the table for saved work, with row-level security so each user sees only their own data.
3. **Authentication → Sign In / Providers → Email**: keep Email enabled. Magic links need no password.
4. **Authentication → URL Configuration**: set **Site URL** to your app address (e.g. `https://yourname.github.io/calchub-pro/`) and add the same address under **Redirect URLs**.
5. **Authentication → SMTP / Emails**: connect your own email sender (for example Resend or Brevo, both have free tiers). Supabase's built-in sender is for testing only and does not deliver to customers.
6. Optional: **Authentication → Email Templates → Magic Link** — put your logo and "CalcHub Pro" in the message.
7. **Project Settings → API**: copy the **Project URL** and the **anon public** key into `config.js` → `auth.url` and `auth.anonKey`.

## Step 3 — Payments and licence keys with Lemon Squeezy

1. Create a store at lemonsqueezy.com in the name of Best Quality First Inc. and complete the payout and identity steps. Lemon Squeezy is the merchant of record: it charges and files sales tax, VAT and GST.
2. Create a product **CalcHub Pro** with these variants (prices as on the Plans page):
   - Pro Monthly — subscription, US$6.99 a month
   - Pro Yearly — subscription, US$49 a year
   - Pro Lifetime — single payment, US$89 (make a discount code for the US$59 launch price)
   - Business — subscription, US$249 a year
3. On **each variant** turn on **Generate license keys**. Suggested activation limit: 3 devices for Pro, 15 for Business. Leave "license length" unlimited; subscriptions end the key when they lapse.
4. Copy each variant's **checkout link** into `config.js` → `license.buy` (`proMonth`, `proYear`, `lifetime`, `business`).
5. Note the **store id**, **product id** and the Business **variant id** (Settings → Stores, and the product page URL).

## Step 4 — The licence service (Cloudflare Worker, free)

1. Create an account at cloudflare.com → **Workers & Pages → Create → Worker**.
2. Replace the starter code with `license-worker.js` from this folder and **Deploy**.
3. **Settings → Variables** — add:
   - `LS_STORE_ID` = your store id
   - `LS_PRODUCT_ID` = the CalcHub Pro product id
   - `BUSINESS_VARIANT_IDS` = the Business variant id
   - `ALLOWED_ORIGIN` = your site origin, e.g. `https://yourname.github.io` (no path, no trailing slash)
4. Copy the Worker address (e.g. `https://calchub-licence.yourname.workers.dev`) into `config.js` → `license.endpoint`.

## Step 5 — Switch plans on

1. In `config.js` set `mode: 'tiers'` and upload it.
2. Test with Lemon Squeezy **test mode**: buy Pro, paste the key on the Plans page, check unlimited PDFs and CSV, then remove the licence. Sign in with your email, save a calculation, open the app on your phone and sign in there to see it synced.
3. Turn test mode off.

## Updating the app later

Upload the new `index.html`, `sw.js` and `icons/` over the old ones but **keep your own `config.js`**. Installed copies update the next time they open online.

## Honest limits

- Plans are checked in the browser. A determined technical user could get round them; at these prices that is normal for web apps. Keys are tied to a number of devices, and the worker accepts only keys from your store.
- The free 3-PDF allowance is counted per device. Server-made PDFs would close that gap later.
- After activation a licence works offline for 30 days; the app re-checks it about once a week when online.
