# CalcHub Pro — website and installable app

Created by Engr. Abrar Hussain · Best Quality First Inc.

This folder is the complete app. Upload it to any static host and it works on Windows, macOS, Android, iPhone and iPad in the browser, can be installed like an app, and works offline after the first visit.

## Free hosting on GitHub Pages (about 10 minutes)
1. Create a free account at github.com.
2. New repository → name it `calchub-pro` → Public → Create.
3. "uploading an existing file" → drag in everything in this folder (index.html, config.js, manifest.webmanifest, sw.js, .nojekyll, icons/) → Commit. The `setup/` folder is for you; you may leave it out.
4. Settings → Pages → Source: "Deploy from a branch" → Branch: main, folder: / (root) → Save.
5. After 1–2 minutes the app is live at https://YOUR-USERNAME.github.io/calchub-pro/

## Install it as an app
- Windows / Mac (Chrome or Edge): open the link → install icon in the address bar → Install.
- Android (Chrome): menu ⋮ → Add to Home screen / Install app.
- iPhone / iPad (Safari): Share → Add to Home Screen.

## Your own domain (optional, about $10–15 a year)
Buy a domain (e.g. calchubpro.com), then GitHub → Settings → Pages → Custom domain, and add the DNS records GitHub shows. HTTPS is free.

## Store listings (optional)
Go to https://www.pwabuilder.com, enter your site address, and download store packages:
- Microsoft Store: free registration for individuals.
- Google Play: $25 one time; new personal accounts must run a closed test with 12 testers for 14 days first.
- Apple App Store: $99 a year; Apple may reject apps that are only a website wrapper, so add app-only value first (offline mode, saved projects).

## Settings, accounts and selling
`config.js` holds the app's settings: support email, prices, sign-in and licence service. Edit it on GitHub (pencil icon) — no rebuild needed. When you upload a new version of the app, keep your own `config.js`.

The app starts with everything unlocked. To switch on free accounts (email sign-in), Pro licences and payments, follow `setup/SETUP_ACCOUNTS_AND_SALES.md`.
