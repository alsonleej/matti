import { getMenuItem, type MenuItem } from "@/data/menu";

export const PERSON_IDS = ["alson", "harshita", "joel", "yixuan"] as const;

export type PersonId = (typeof PERSON_IDS)[number];

export type PersonMenu = {
  id: PersonId;
  name: string;
  availableIds: string[];
  requestIds: string[];
};

export const PEOPLE: Record<PersonId, PersonMenu> = {
  alson: {
    id: "alson",
    name: "Alson",
    availableIds: ["lasagne", "meatballs", "bolognese", "pizza"],
    requestIds: ["salmon", "tikka", "chicken-wok", "samosas"],
  },
  harshita: {
    id: "harshita",
    name: "Harshita",
    availableIds: ["tikka", "samosas", "curry", "veg-pasta"],
    requestIds: ["salmon", "pancakes", "bolognese", "fried-rice"],
  },
  joel: {
    id: "joel",
    name: "Joel",
    availableIds: ["fried-rice", "meatballs", "pizza", "beef-pasta"],
    requestIds: ["lasagne", "curry", "pancakes", "pork-noodles"],
  },
  yixuan: {
    id: "yixuan",
    name: "Yixuan",
    availableIds: ["salmon", "chicken-wok", "bolognese", "fried-rice"],
    requestIds: ["meatballs", "lasagne", "samosas", "tikka"],
  },
};

export function isPersonId(value: string): value is PersonId {
  return PERSON_IDS.includes(value as PersonId);
}

export function getPerson(id: string): PersonMenu | null {
  if (!isPersonId(id)) return null;
  return PEOPLE[id];
}

function itemsFromIds(ids: string[]): MenuItem[] {
  return ids
    .map((id) => getMenuItem(id))
    .filter((item): item is MenuItem => Boolean(item));
}

export function getAvailableToday(person: PersonMenu): MenuItem[] {
  return itemsFromIds(person.availableIds);
}

export function getRequestToStock(person: PersonMenu): MenuItem[] {
  return itemsFromIds(person.requestIds);
}

export function personHasItem(
  person: PersonMenu,
  itemId: string,
  kind: "heat" | "stock",
) {
  const ids = kind === "heat" ? person.availableIds : person.requestIds;
  return ids.includes(itemId);
}
