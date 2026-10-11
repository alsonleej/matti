export type MenuTag = "veg" | "spicy" | "value";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  image: string;
  heatMinutes: number;
  tags: MenuTag[];
};

export const MENU: MenuItem[] = [
  {
    id: "ramen",
    name: "Spicy miso ramen",
    description:
      "Wheat noodles in a chili-miso broth with corn and nori. Hits like a vending-machine classic.",
    priceCents: 450,
    image: "/foods/ramen.jpg",
    heatMinutes: 4,
    tags: ["spicy", "value"],
  },
  {
    id: "mac",
    name: "Classic mac & cheese",
    description:
      "Elbow pasta in a thick cheddar sauce. Three minutes in the microwave, zero decisions.",
    priceCents: 350,
    image: "/foods/mac.jpg",
    heatMinutes: 3,
    tags: ["veg", "value"],
  },
  {
    id: "dumplings",
    name: "Pork dumplings",
    description:
      "Eight pan-style dumplings with soy-ginger dip. Steams through in the microwave.",
    priceCents: 500,
    image: "/foods/dumplings.jpg",
    heatMinutes: 4,
    tags: [],
  },
  {
    id: "burrito",
    name: "Breakfast burrito",
    description:
      "Eggs, potato, cheddar, and salsa in a flour tortilla. Built for a 12:00 pickup.",
    priceCents: 550,
    image: "/foods/burrito.jpg",
    heatMinutes: 2,
    tags: [],
  },
  {
    id: "soup",
    name: "Tomato basil soup",
    description:
      "Cup of roasted tomato soup with basil. Light, hot, and ready between meetings.",
    priceCents: 300,
    image: "/foods/soup.jpg",
    heatMinutes: 3,
    tags: ["veg", "value"],
  },
  {
    id: "pizza",
    name: "Pepperoni pizza slice",
    description:
      "A thick New York-style slice. We heat it until the cheese bubbles again.",
    priceCents: 400,
    image: "/foods/pizza.jpg",
    heatMinutes: 2,
    tags: ["value"],
  },
  {
    id: "butter-chicken",
    name: "Butter chicken + rice",
    description:
      "Creamy tomato-butter chicken over basmati. The closest thing here to a real lunch.",
    priceCents: 700,
    image: "/foods/butter-chicken.jpg",
    heatMinutes: 4,
    tags: [],
  },
  {
    id: "noodles",
    name: "Garlic sesame noodles",
    description:
      "Chewy wheat noodles with garlic oil, sesame, and scallion. Vegetarian, still filling.",
    priceCents: 550,
    image: "/foods/noodles.jpg",
    heatMinutes: 3,
    tags: ["veg"],
  },
  {
    id: "chili",
    name: "Three-bean chili",
    description:
      "Kidney, black, and pinto beans in a smoky tomato chili. No meat, plenty of heat.",
    priceCents: 450,
    image: "/foods/chili.jpg",
    heatMinutes: 3,
    tags: ["veg", "spicy", "value"],
  },
  {
    id: "rice-bowl",
    name: "Teriyaki chicken rice",
    description:
      "Chicken and vegetables over steamed rice with teriyaki glaze. The office bowl.",
    priceCents: 650,
    image: "/foods/rice-bowl.jpg",
    heatMinutes: 4,
    tags: [],
  },
];

export function getMenuItem(id: string) {
  return MENU.find((item) => item.id === id);
}

export function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}
