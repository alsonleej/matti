# Mätti

Office interest check for a heat-up vending machine. Colleagues order ICA / Convini frozen meals (45–60 kr) from a personal menu. We microwave what’s available today, and they can request trays to stock next.

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

## Stack

Next.js, TypeScript, Tailwind CSS, and shadcn/ui. Orders persist in `data/orders.json` while the server is running.
