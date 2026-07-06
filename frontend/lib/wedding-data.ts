/* wedding-data.ts — extra wedding content not in wedding-content.ts */

export const heroData = {
  kicker: "TOGETHER WITH THEIR FAMILIES",
  quote: '"So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate."',
  quoteRef: "— Matthew 19:6",
  venueCard: {
    timeLabel: "DETAILS TO FOLLOW",
  },
} as const;

export const contactData = {
  email: "sushmi.nijin2026@gmail.com",
  tagline: "WE CAN'T WAIT TO CELEBRATE WITH YOU!",
} as const;

export const foodOptions = [
  { value: "", label: "Select preference" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "non-vegetarian", label: "Non-Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "jain", label: "Jain" },
  { value: "no-preference", label: "No Preference" },
] as const;

export const eventIcons = {
  ceremony: "church",
  reception: "people",
  dinner: "star",
} as const;
