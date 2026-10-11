# Mätti

Office interest check for a heat-up vending machine. Colleagues order frozen meals (55 kr) from a personal menu. We microwave what’s available today, and they can request trays to stock next.

## Run it

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

Personal menus (send these individually):

- [/kisi](http://127.0.0.1:43127/kisi)
- [/standab](http://127.0.0.1:43127/standab)
- [/bmb](http://127.0.0.1:43127/bmb)
- [/chinsay](http://127.0.0.1:43127/chinsay)

Kitchen board: [/kitchen](http://127.0.0.1:43127/kitchen)

## How it works

1. Open your link. **Available today** is above; **Request to stock** is below.
2. Order a tray and type a ready-by time (or nudge ±15 min).
3. Pay with Swish at pickup. We heat it by hand.
4. Kitchen marks orders heating → ready → picked up, and sees stock requests as demand.

## Host on GitHub Pages at `/matti`

The site is a static export (`out/`), so it runs on GitHub Pages with no server.

1. Create a GitHub repo named **`matti`** and push this code to its `main` branch.
2. In the repo, go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
3. The workflow in `.github/workflows/pages.yml` builds with `NEXT_PUBLIC_BASE_PATH=/matti` and deploys. The site is at `https://<your-username>.github.io/matti/`, and the menus are at `/matti/kisi/`, `/matti/standab/`, `/matti/bmb/`, and `/matti/chinsay/`.

Already have a `<your-username>.github.io` repo instead? Run `NEXT_PUBLIC_BASE_PATH=/matti npm run build` and copy the contents of `out/` into a `matti/` folder in that repo.

### Shared orders (Google Sheet)

Pages has no backend. Without one, each order is saved only in the browser it was placed from, so the kitchen board only shows orders made on that device. To collect everyone's orders in one place:

1. Create a Google Sheet, open **Extensions → Apps Script**, and paste in `scripts/orders-sheet.gs`.
2. **Deploy → New deployment → Web app**, with *Execute as: Me* and *Who has access: Anyone*. Copy the `/exec` URL.
3. In the GitHub repo, open **Settings → Secrets and variables → Actions → Variables** and add `ORDERS_URL` set to that URL. Then re-run the Pages workflow.

To build locally against the sheet, set `NEXT_PUBLIC_ORDERS_URL` before `npm run dev` or `npm run build`.

## Stack

Next.js (static export), TypeScript, Tailwind CSS, and shadcn/ui. Orders are stored in `localStorage`, or in a Google Sheet when `NEXT_PUBLIC_ORDERS_URL` is set.
