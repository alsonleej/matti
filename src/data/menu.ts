export type MenuTag = "veg" | "spicy";

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
      "ICA frozen lasagne. Beef ragu, pasta sheets, and béchamel — plated hot after the microwave.",
    priceKr: 55,
    image: "/foods/lasagne.jpg",
    heatMinutes: 5,
    tags: [],
  },
  {
    id: "meatballs",
    name: "Köttbullar",
    description:
      "ICA köttbullar. Swedish meatballs from the freezer, heated through and served fresh.",
    priceKr: 49,
    image: "/foods/meatballs.jpg",
    heatMinutes: 4,
    tags: [],
  },
  {
    id: "salmon",
    name: "Lax i dillsås",
    description:
      "ICA salmon tray with dill sauce. Frozen at the store, looks like dinner once it’s heated.",
    priceKr: 60,
    image: "/foods/salmon.jpg",
    heatMinutes: 5,
    tags: [],
  },
  {
    id: "tikka",
    name: "Kyckling tikka masala",
    description:
      "Convini / ICA chicken tikka. Creamy tomato-curry from a frozen tray, with rice on the side.",
    priceKr: 59,
    image: "/foods/butter-chicken.jpg",
    heatMinutes: 5,
    tags: ["spicy"],
  },
  {
    id: "bolognese",
    name: "Pasta bolognese",
    description:
      "ICA pasta bolognese. A freezer classic — spaghetti and meat sauce, ready in a few minutes.",
    priceKr: 48,
    image: "/foods/carbonara.jpg",
    heatMinutes: 4,
    tags: [],
  },
  {
    id: "pizza",
    name: "Pan pizza",
    description:
      "The ICA / Billys-style pan pizza. Frozen disc, molten cheese after a short heat.",
    priceKr: 46,
    image: "/foods/pizza.jpg",
    heatMinutes: 3,
    tags: [],
  },
  {
    id: "pancakes",
    name: "Pannkakor",
    description:
      "ICA frozen pannkakor. Swedish pancakes from the freezer aisle, served stacked and hot.",
    priceKr: 45,
    image: "/foods/pancakes.jpg",
    heatMinutes: 2,
    tags: ["veg"],
  },
  {
    id: "chicken-wok",
    name: "Kycklingwok",
    description:
      "ICA chicken wok with peppers. A Convini cabinet regular, reheated until the sauce shines.",
    priceKr: 57,
    image: "/foods/stroganoff.jpg",
    heatMinutes: 4,
    tags: [],
  },
  {
    id: "curry",
    name: "Röd curry",
    description:
      "ICA red curry with chicken. Thai-style frozen tray — spicy, coconut, office-lunch staple.",
    priceKr: 55,
    image: "/foods/chili.jpg",
    heatMinutes: 4,
    tags: ["spicy"],
  },
  {
    id: "fried-rice",
    name: "Stekt ris",
    description:
      "ICA fried rice with chicken and vegetables. Straight from the freezer, fluffed in the microwave.",
    priceKr: 50,
    image: "/foods/rice-bowl.jpg",
    heatMinutes: 4,
    tags: [],
  },
  {
    id: "pork-noodles",
    name: "Nudlar med fläsk",
    description:
      "Convini-style pork noodles. Frozen Asian tray that plates like a fresh bowl once heated.",
    priceKr: 56,
    image: "/foods/noodles.jpg",
    heatMinutes: 4,
    tags: [],
  },
  {
    id: "veg-pasta",
    name: "Vegetarisk pasta",
    description:
      "ICA vegetarian pasta in tomato sauce. No meat, still a proper microwave lunch.",
    priceKr: 47,
    image: "/foods/veg-lasagne.jpg",
    heatMinutes: 4,
    tags: ["veg"],
  },
  {
    id: "samosas",
    name: "Samosas",
    description:
      "ICA frozen vegetable samosas. Crisp after heating — the snack tray from the freezer aisle.",
    priceKr: 45,
    image: "/foods/falafel.jpg",
    heatMinutes: 3,
    tags: ["veg", "spicy"],
  },
  {
    id: "beef-pasta",
    name: "Pasta med biff",
    description:
      "ICA creamy beef pasta. Frozen tagliatelle with steak pieces, served looking freshly tossed.",
    priceKr: 58,
    image: "/foods/pasta2.jpg",
    heatMinutes: 5,
    tags: [],
  },
];

export function getMenuItem(id: string) {
  return MENU.find((item) => item.id === id);
}

export function formatPrice(kr: number) {
  return `${kr} kr`;
}
