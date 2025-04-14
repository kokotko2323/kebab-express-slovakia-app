
import { MenuItem } from "../types";

// Menu categories
export const menuCategories = [
  "DÖNER KEBAB PITA",
  "DÜRÜM KEBAB",
  "DÖNER TANIER",
  "DÖNER BOX",
  "NEALKOHOLICKÉ NÁPOJE"
];

// Menu items
export const menuItems: MenuItem[] = [
  {
    id: "10",
    name: "Pita žemľa",
    description: "kebab mäso, turecký chlieb, šalát, dressing",
    price: 5.00,
    weight: "360g",
    allergens: "1,3,7",
    category: "DÖNER KEBAB PITA",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=1374&auto=format&fit=crop"
  },
  {
    id: "11",
    name: "Pita žemľa so syrom",
    description: "kebab mäso, turecký chlieb, šalát, dressing, turecký/halloumi syr",
    price: 6.00,
    weight: "390g",
    allergens: "1,3,7",
    category: "DÖNER KEBAB PITA",
    image: "https://images.unsplash.com/photo-1633896949673-1eb9d131a9b4?q=80&w=1374&auto=format&fit=crop"
  },
  {
    id: "12",
    name: "Pita kebab pita žemľa s cheddarom",
    description: "kebab mäso, turecký chlieb, šalát, cheddar",
    price: 6.00,
    weight: "360g",
    allergens: "1,3,7",
    category: "DÖNER KEBAB PITA",
    image: "https://images.unsplash.com/photo-1664216713864-d4b2167c1ed1?q=80&w=1374&auto=format&fit=crop"
  },
  {
    id: "20",
    name: "Dürüm tortilla",
    description: "kebab mäso, tortilla, šalát, dressing",
    price: 6.00,
    weight: "360g",
    allergens: "1,3,7",
    category: "DÜRÜM KEBAB",
    image: "https://images.unsplash.com/photo-1655889059346-d0c0d8552518?q=80&w=1374&auto=format&fit=crop"
  },
  {
    id: "21",
    name: "Dürüm tortilla so syrom",
    description: "kebab mäso, tortilla, šalát, dressing, turecký/halloumi syr",
    price: 7.00,
    weight: "390g",
    allergens: "1,3,7",
    category: "DÜRÜM KEBAB",
    image: "https://images.unsplash.com/photo-1656268164012-119304af0c69?q=80&w=1374&auto=format&fit=crop"
  },
  {
    id: "22",
    name: "Dürüm tortilla s cheddarom",
    description: "kebab mäso, tortilla, šalát, cheddar, špeciálny dresing",
    price: 8.00,
    weight: "360g",
    allergens: "1,3,7",
    category: "DÜRÜM KEBAB",
    image: "https://images.unsplash.com/photo-1662116765994-1e4200c43589?q=80&w=1374&auto=format&fit=crop"
  },
  {
    id: "23",
    name: "Mega dürüm tortilla",
    description: "2x mäso, 2x tortilla, 2x šalát, 2x špeciálny dresing",
    price: 11.00,
    weight: "32cm",
    allergens: "1,3,7",
    category: "DÜRÜM KEBAB",
    image: "https://images.unsplash.com/photo-1514843319620-4f042827c481?q=80&w=1470&auto=format&fit=crop"
  },
  {
    id: "24",
    name: "Mega dürüm tortilla so syrom",
    description: "2x mäso, 2x tortilla, 2x šalát, 2x turecký syr, 2x špeciálny dresing",
    price: 13.00,
    weight: "32cm",
    allergens: "1,3,7",
    category: "DÜRÜM KEBAB",
    image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?q=80&w=1374&auto=format&fit=crop"
  },
  {
    id: "30",
    name: "Döner tanier",
    description: "kebab mäso, šalát, dressing, ryža / turecký chlieb",
    price: 6.00,
    weight: "360g",
    allergens: "1,3,7",
    category: "DÖNER TANIER",
    image: "https://images.unsplash.com/photo-1606755456206-b25206cde27e?q=80&w=1374&auto=format&fit=crop"
  },
  {
    id: "31",
    name: "Döner tanier so syrom",
    description: "kebab mäso, šalát, dressing, ryža / turecký chlieb, turecký syr",
    price: 7.00,
    weight: "390g",
    allergens: "1,3,7",
    category: "DÖNER TANIER",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?q=80&w=1374&auto=format&fit=crop"
  },
  {
    id: "34",
    name: "Döner tanier s cheddarom",
    description: "kebab mäso, šalát, cheddar, hranolky / ryža",
    price: 8.00,
    weight: "390g",
    allergens: "1,3,7",
    category: "DÖNER TANIER",
    image: "https://images.unsplash.com/photo-1525518392674-39ba1feb2931?q=80&w=1374&auto=format&fit=crop"
  },
  {
    id: "35",
    name: "Döner tanier so žemľou a cheddarom",
    description: "kebab mäso, šalát, cheddar",
    price: 8.00,
    weight: "390g",
    allergens: "1,3,7",
    category: "DÖNER TANIER",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1374&auto=format&fit=crop"
  },
  {
    id: "40",
    name: "Döner box",
    description: "kebab mäso, hranolky, šalát",
    price: 5.00,
    weight: "340g",
    allergens: "1,3,7",
    category: "DÖNER BOX",
    image: "https://images.unsplash.com/photo-1609167830220-7164aa360951?q=80&w=1470&auto=format&fit=crop"
  },
  {
    id: "41",
    name: "Döner box so syrom",
    description: "kebab mäso, hranolky, šalát, turecký/halloumi syr",
    price: 6.00,
    weight: "340g",
    allergens: "1,3,7",
    category: "DÖNER BOX",
    image: "https://images.unsplash.com/photo-1613564834361-9436948817d1?q=80&w=1374&auto=format&fit=crop"
  },
  {
    id: "120",
    name: "Coca Cola",
    description: "0.5l",
    price: 2.00,
    weight: "0.5l",
    allergens: "",
    category: "NEALKOHOLICKÉ NÁPOJE",
    image: "https://images.unsplash.com/photo-1594971475674-a7907408c847?q=80&w=1374&auto=format&fit=crop"
  },
  {
    id: "121",
    name: "Coca Cola light",
    description: "0.5l",
    price: 2.00,
    weight: "0.5l",
    allergens: "",
    category: "NEALKOHOLICKÉ NÁPOJE",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1374&auto=format&fit=crop"
  },
  {
    id: "122",
    name: "Coca Cola zero",
    description: "0.5l",
    price: 2.00,
    weight: "0.5l",
    allergens: "",
    category: "NEALKOHOLICKÉ NÁPOJE",
    image: "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?q=80&w=1374&auto=format&fit=crop"
  },
  {
    id: "123",
    name: "Coca Cola",
    description: "0.33l",
    price: 1.50,
    weight: "0.33l",
    allergens: "",
    category: "NEALKOHOLICKÉ NÁPOJE",
    image: "https://images.unsplash.com/photo-1554866585-c0de6c15d528?q=80&w=1471&auto=format&fit=crop"
  },
  {
    id: "124",
    name: "Coca Cola zero",
    description: "0.33l",
    price: 1.50,
    weight: "0.33l",
    allergens: "",
    category: "NEALKOHOLICKÉ NÁPOJE",
    image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?q=80&w=1374&auto=format&fit=crop"
  },
  {
    id: "125",
    name: "Fanta",
    description: "0.5l",
    price: 2.00,
    weight: "0.5l",
    allergens: "",
    category: "NEALKOHOLICKÉ NÁPOJE",
    image: "https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?q=80&w=1374&auto=format&fit=crop"
  },
  {
    id: "126",
    name: "Capri-Sun",
    description: "200ml",
    price: 1.50,
    weight: "200ml",
    allergens: "",
    category: "NEALKOHOLICKÉ NÁPOJE",
    image: "https://images.unsplash.com/photo-1618355776464-8666794d3f7c?q=80&w=1374&auto=format&fit=crop"
  },
  {
    id: "127",
    name: "Ice Tea",
    description: "500ml",
    price: 2.50,
    weight: "500ml",
    allergens: "",
    category: "NEALKOHOLICKÉ NÁPOJE",
    image: "https://images.unsplash.com/photo-1556679343-c1306ee9277f?q=80&w=1364&auto=format&fit=crop"
  }
];

// Restaurant information
export const restaurantInfo = {
  name: "Kebab Express",
  address: "Ivana Krasku 1092/20, 93401 Levice",
  phone: "+421 123 456 789",
  email: "info@kebabexpress.sk",
  openingHours: {
    monday: "10:00-21:00",
    tuesday: "10:00-21:00",
    wednesday: "10:00-21:00",
    thursday: "10:00-21:00",
    friday: "10:00-21:00",
    saturday: "09:00-21:00",
    sunday: "Zatvorené"
  },
  businessDetails: {
    register: "Okresný urad levice",
    licenseNumber: "307-16519",
    ico: "37425561"
  }
};
