# [திருச்சபையின் பெயர்] — Website

A Tamil-first church website built with Next.js 14 (App Router), TypeScript
and Tailwind CSS.

## 1. Requirements

- Node.js 18.18 or newer (Node 20 LTS recommended)
- VS Code
- Git (optional, but recommended)

## 2. Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## 3. Where to edit content

Almost everything is controlled from **one file**:

```
data/church.ts
```

Open it and replace every `[bracketed]` placeholder with your real
church name, address, phone, email, pastor name, service times,
sermons, events, and social links.

## 4. Where to add images

```
public/images/
```

See `public/images/README.txt` for the exact filenames the code expects.

## 5. Build for production

```bash
npm run build
npm run start
```

## 6. Deploy (Vercel — recommended, free tier available)

1. Push this project to a GitHub repository.
2. Go to https://vercel.com → "Add New Project" → import your repo.
3. Vercel auto-detects Next.js — leave the default build settings.
4. Click **Deploy**. You'll get a live URL in ~1 minute.
5. (Optional) Add your own domain under Project → Settings → Domains.

## 7. Production checklist

- [ ] Replaced all placeholder text in `data/church.ts`
- [ ] Added real photos to `public/images/`
- [ ] Replaced `googleMapsEmbedUrl` with your real Google Maps embed link
- [ ] Connected the prayer request form (`components/PrayerRequestForm.tsx`)
      to a real backend/email service — it does NOT send anywhere yet
- [ ] Updated the domain in `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`
- [ ] Checked the site on mobile (360–430px), tablet, and desktop widths
- [ ] Ran `npm run build` with no errors
