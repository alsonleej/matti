export type MenuTag = "veg" | "spicy";

export const PRICE_KR = 55;

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  priceKr: number;
  image: string;
  heatMinutes: number;
  tags: MenuTag[];
};

export const MENU: MenuItem[] = [
  {
    id: "lasagne",
    name: "Lasagne",
    description:
      "Beef ragu, pasta sheets, and béchamel. Heated through and plated hot.",
    priceKr: PRICE_KR,
    image: "/foods/lasagne.jpg",
    heatMinutes: 5,
    tags: [],
  },
  {
    id: "meatballs",
    name: "Köttbullar",
    description:
      "Swedish meatballs from the freezer, heated through and served fresh.",
    priceKr: PRICE_KR,
    image: "/foods/meatballs.jpg",
    heatMinutes: 4,
    tags: [],
  },
  {
    id: "salmon",
    name: "Lax i dillsås",
    description:
      "Salmon with dill sauce. Frozen until we heat it; looks like dinner on the plate.",
    priceKr: PRICE_KR,
    image: "/foods/salmon.jpg",
    heatMinutes: 5,
    tags: [],
  },
  {
    id: "tikka",
    name: "Kyckling tikka masala",
    description:
      "Creamy tomato-curry chicken from a frozen tray, with rice on the side.",
    priceKr: PRICE_KR,
    image: "/foods/butter-chicken.jpg",
    heatMinutes: 5,
    tags: ["spicy"],
  },
  {
    id: "bolognese",
    name: "Pasta bolognese",
    description:
      "Spaghetti and meat sauce. A freezer classic, ready in a few minutes.",
    priceKr: PRICE_KR,
    image: "/foods/carbonara.jpg",
    heatMinutes: 4,
    tags: [],
  },
  {
    id: "pizza",
    name: "Pan pizza",
    description:
      "Frozen pan pizza. Short heat, molten cheese.",
    priceKr: PRICE_KR,
    image: "/foods/pizza.jpg",
    heatMinutes: 3,
    tags: [],
  },
  {
    id: "pancakes",
    name: "Pannkakor",
    description:
      "Swedish pancakes from the freezer, served stacked and hot.",
    priceKr: PRICE_KR,
    image: "/foods/pancakes.jpg",
    heatMinutes: 2,
    tags: ["veg"],
  },
  {
    id: "chicken-wok",
    name: "Kycklingwok",
    description:
      "Chicken wok with peppers. Reheated until the sauce shines.",
    priceKr: PRICE_KR,
    image: "/foods/stroganoff.jpg",
    heatMinutes: 4,
    tags: [],
  },
  {
    id: "curry",
    name: "Röd curry",
    description:
      "Thai-style red curry with chicken — spicy, coconut, office-lunch staple.",
    priceKr: PRICE_KR,
    image: "/foods/chili.jpg",
    heatMinutes: 4,
    tags: ["spicy"],
  },
  {
    id: "fried-rice",
    name: "Stekt ris",
    description:
      "Fried rice with chicken and vegetables, fluffed in the microwave.",
    priceKr: PRICE_KR,
    image: "/foods/rice-bowl.jpg",
    heatMinutes: 4,
    tags: [],
  },
  {
    id: "pork-noodles",
    name: "Nudlar med fläsk",
    description:
      "Pork noodles. Frozen tray that plates like a fresh bowl once heated.",
    priceKr: PRICE_KR,
    image: "/foods/noodles.jpg",
    heatMinutes: 4,
    tags: [],
  },
  {
    id: "veg-pasta",
    name: "Vegetarisk pasta",
    description:
      "Vegetarian pasta in tomato sauce. No meat, still a proper microwave lunch.",
    priceKr: PRICE_KR,
    image: "/foods/veg-lasagne.jpg",
    heatMinutes: 4,
    tags: ["veg"],
  },
  {
    id: "samosas",
    name: "Samosas",
    description:
      "Vegetable samosas. Crisp after heating — the snack tray from the freezer.",
    priceKr: PRICE_KR,
    image: "/foods/falafel.jpg",
    heatMinutes: 3,
    tags: ["veg", "spicy"],
  },
  {
    id: "beef-pasta",
    name: "Pasta med biff",
    description:
      "Creamy beef pasta. Tagliatelle with steak pieces, served looking freshly tossed.",
    priceKr: PRICE_KR,
    image: "/foods/pasta2.jpg",
    heatMinutes: 5,
    tags: [],
  },
  {
    id: "red-curry-chicken",
    name: "Red Curry Chicken",
    description:
      "Creamy red curry with tender chicken, bamboo shoots, and Thai basil. Rich and aromatic.",
    priceKr: PRICE_KR,
    image: "/foods/butter-chicken.jpg",
    heatMinutes: 5,
    tags: ["spicy"],
  },
];

export function getMenuItem(id: string) {
  return MENU.find((item) => item.id === id);
}

export function formatPrice(kr: number) {
  return `${kr} kr`;
}
