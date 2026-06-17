# KS WAYS Web

KS WAYS brand landing page built with Next.js 16, TypeScript, Tailwind CSS v4, and path-based bilingual routing.

## Routes

- `/` — English default
- `/kr` — Korean content
- Language toggle maps `/` ↔ `/kr`.

## Brand Direction

- Family look from Goodman GLS: deep navy, large editorial headline, logistics control-tower card, proof panels.
- KS WAYS accent identity: Electric Teal/Cyan (`#21D4C2`, `#6FFFE7`).
- Public terminology avoids “Network Marketing”; uses Partner Network / Agent Network / referral-based logistics cooperation.
- `DESIGN.md` is the source of truth for visual tokens, component rules, brand spelling, mobile touch-target standards, and global logistics positioning.

## Commands

```bash
npm install
npm run test:run
npm run lint
NODE_OPTIONS='--max-old-space-size=1536' npm run build
npm run start -- --hostname 127.0.0.1 --port 3010
```

## Verification Snapshot

- Unit tests: 5 passed
- ESLint: passed
- Production build: passed
- Static routes generated: `/`, `/_not-found`, `/kr`, `/services/air-freight-korea`, `/services/ocean-freight-korea`, `/services/exw-pickup-korea`, `/network/korea-agent-network`, `/robots.txt`, `/sitemap.xml`
- Browser QA: desktop/mobile EN/KR screenshots, no console errors, no page errors, no horizontal overflow

## Deployment Notes

- Recommended Vercel account/project owner: `goodman-jways`
- Recommended GitHub owner: `goodmangls`
- Production domain target: `ksways.co`
- Keep English as `x-default` and Korean canonical at `/kr`.
