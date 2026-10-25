/* CalcHub Pro settings — edit this file on your website; no rebuild needed.
   Keep your own copy when you upload a new version of the app.
   Nothing here is secret: the Supabase "anon public" key is designed to be public
   (your data is protected by row-level security). Never put a secret key here. */
window.CALCHUB_CONFIG = {
  // 'open'  = everything unlocked (launch period, no accounts needed)
  // 'tiers' = Guest / Free account / Pro. Switch on after accounts and licences are set up.
  mode: 'open',

  // Email sign-in (free account). Fill both values from Supabase → Project Settings → API.
  auth: { provider: 'supabase', url: '', anonKey: '' },

  // Licence checking (your Cloudflare Worker URL) and the checkout links from Lemon Squeezy.
  license: {
    endpoint: '',
    buy: { proMonth: '', proYear: '', lifetime: '', business: '' }
  },

  // Prices shown on the Plans page (charge the same amounts at checkout).
  prices: { currency: 'USD', proMonth: 6.99, proYear: 49, lifetime: 89, lifetimeLaunch: 59, business: 249, businessSeats: 5 },
  freePdfPerMonth: 3,

  // Shown on the Help, Privacy, Terms and Refund pages. Required before launch.
  support: { email: '' },
  company: { name: 'Best Quality First Inc.', law: 'the Province of Ontario, Canada' },

  // Owner tools (switch calculators off, plan preview). Keep false on the public website.
  adminTools: false
};
