# Heat Check

A small office web app for testing whether people would use a heat-up vending machine. Colleagues browse microwaveable meals, pick a ready-by time, and submit an order. Whoever is on kitchen duty heats the food by hand and has it ready at that time.

No payments, accounts, or vending hardware. Orders are stored in a local JSON file on the server.

## Run it

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

- **Menu** (`/`) — share this link with the office
- **Kitchen** (`/kitchen`) — incoming orders grouped by ready-by time

## How an order works

1. Pick a meal (photo + price).
2. Enter your name, desk/Slack, and a pickup window at least 15 minutes out.
3. Submit. Pay at pickup.
4. Kitchen marks the order heating → ready → picked up.

## Stack

Next.js, TypeScript, Tailwind CSS, and shadcn/ui. Orders persist in `data/orders.json` while the server is running.
