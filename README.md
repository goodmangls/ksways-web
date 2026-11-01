# KS WAYS Web

KS WAYS brand landing page built with Next.js 16, TypeScript, Tailwind CSS v4, and path-based bilingual routing.

## Routes

- `/` — Primary global homepage
- `/kr` — Korean content
- /quote — structured freight quote request form
- `/services/special-cargo-korea` — Special cargo review service page
- Language toggle maps `/` ↔ `/kr`.

## Brand Direction

- Family look from Goodman GLS: deep navy, large editorial headline, logistics control-tower card, proof panels.
- KS WAYS accent identity: Route Bronze (`#B88A5A`) for actions, Warm Gold (`#E7C99A`) for highlights on dark surfaces. The earlier Electric Teal/Cyan identity is retired; `src/brand-palette.test.ts` fails if it returns. Components use palette tokens (`bg-navy`, `text-accent-ink`), never hex.
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
- Static routes generated: `/`, `/_not-found`, `/kr`, `/quote`, `/services/air-freight-korea`, `/services/ocean-freight-korea`, `/services/special-cargo-korea`, `/services/exw-pickup-korea`, `/network/korea-agent-network`, `/robots.txt`, `/sitemap.xml`
- Browser QA: desktop/mobile EN/KR screenshots, no console errors, no page errors, no horizontal overflow

## Deployment Notes

- Recommended Vercel account/project owner: `goodman-jways`
- Recommended GitHub owner: `goodmangls`
- Production domain target: `ksways.co`
- Keep English as `x-default` and Korean canonical at `/kr`.
