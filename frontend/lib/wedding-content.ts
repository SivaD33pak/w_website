export type WeddingImage = {
  id: string;
  title: string;
  src: string;
  alt: string;
  aspectRatio: "1:1" | "1:3" | "3:4" | "4:3" | "16:9";
  role: "hero" | "story" | "event" | "decorative" | "rsvp";
  source: "banani-firebase" | "banani-generated" | "local";
};

export const weddingTheme = {
  colors: {
    background: "#181b3a",
    deepPlum: "#2c1e3a",
    wine: "#3d1e2a",
    cream: "#f8eee7",
    creamForeground: "#3a2d2d",
    foreground: "#f6f6f6",
    gold: "#d8b26e",
    rose: "#c98fa2",
  },
  fonts: {
    body: "Inter",
    headings: "PT Serif",
  },
} as const;

export const couple = {
  brideFirstName: "Sushmi",
  brideFullName: "Sushmi Rajan",
  groomFirstName: "Nijin",
  groomFullName: "Nijin Raveendran",
  displayName: "Sushmi & Nijin",
} as const;

export const weddingDate = {
  isoDate: "2026-08-13",
  day: "13",
  monthYear: "AUGUST 2026",
  weekday: "THURSDAY",
  display: "13 AUGUST 2026",
  footerDisplay: "13 - AUGUST - 2026",
  rsvpDeadline: "JULY 2026",
} as const;

export const venue = {
  name: "Sree Ragam Convention Centre",
  label: "SREE RAGAM CONVENTION CENTRE",
  address: "Poovar - Neyyatinkara Rd, Swadeshabhimani Nagar, Neyyattinkara, Kerala",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Sree%20Ragam%20Convention%20Centre%20Poovar%20Neyyattinkara%20Kerala",
} as const;

export const sectionOrder = [
  "home",
  "our-story",
  "countdown",
  "events",
  "bible-verse",
  "rsvp",
  "contact",
] as const;

export const navigationItems = [
  { label: "HOME", href: "#home", sectionId: "home" },
  { label: "OUR STORY", href: "#our-story", sectionId: "our-story" },
  { label: "EVENTS", href: "#events", sectionId: "events" },
  { label: "BIBLE VERSE", href: "#bible-verse", sectionId: "bible-verse" },
  { label: "RSVP", href: "#rsvp", sectionId: "rsvp" },
] as const;

export const storyLines = [
  "Two souls, chosen by God,",
  "brought together in His perfect time",
  "and blessed with a love that",
  "strengthens every day.",
  "We can't wait to begin our forever",
  "with you by our side.",
] as const;

export const bibleVerse = {
  quote: '"I have found the one whom my soul loves."',
  reference: "Song of Solomon 3:4",
} as const;

export const events = [
  {
    id: "wedding-ceremony",
    title: "Holy Mass & Wedding Ceremony",
    date: weddingDate.display,
    time: "10:00 AM ONWARDS",
    venue: venue.label,
    location: venue.address,
    mapUrl: venue.mapUrl,
  },
  {
    id: "reception",
    title: "Reception",
    date: weddingDate.display,
    time: "06:00 PM ONWARDS",
    venue: venue.label,
    location: venue.address,
    mapUrl: venue.mapUrl,
  },
  {
    id: "dinner",
    title: "Dinner",
    date: weddingDate.display,
    time: "07:30 PM ONWARDS",
    venue: venue.label,
    location: venue.address,
    mapUrl: venue.mapUrl,
  },
] as const;

export const images = [
  {
    id: "hero-sky",
    title: "Twilight sky",
    alt: "Twilight sky",
    aspectRatio: "16:9",
    role: "hero",
    source: "local",
    src: "/hero/layer-0-sky.png",
  },
  {
    id: "hero-mountain",
    title: "Mountain silhouette",
    alt: "Mountain silhouette",
    aspectRatio: "16:9",
    role: "hero",
    source: "local",
    src: "/hero/layer-1-mountain.png",
  },
  {
    id: "hero-church",
    title: "Church with fairy lights",
    alt: "Church with fairy lights",
    aspectRatio: "16:9",
    role: "hero",
    source: "local",
    src: "/hero/layer-2-church.png",
  },
  {
    id: "hero-blossoms",
    title: "Cherry blossom branches",
    alt: "Cherry blossom branches",
    aspectRatio: "16:9",
    role: "hero",
    source: "local",
    src: "/hero/layer-3-blossoms.png",
  },
  {
    id: "story-couple-portrait",
    title: "Couple portrait",
    alt: "Indian bride and groom in a romantic portrait",
    aspectRatio: "3:4",
    role: "story",
    source: "banani-generated",
    src: "https://storage.googleapis.com/banani-generated-images/generated-images/c39db306-4532-4305-aba5-1b3481543ea1.jpg",
  },
  {
    id: "decorative-cross",
    title: "Floral Cross",
    alt: "Golden cross with roses",
    aspectRatio: "1:1",
    role: "decorative",
    source: "banani-generated",
    src: "https://storage.googleapis.com/banani-generated-images/generated-images/9b4b53c6-443c-4f94-af80-3c3ebeaaf6a3.jpg",
  },
  {
    id: "decorative-candle",
    title: "Candle",
    alt: "Single candle with warm flame",
    aspectRatio: "1:3",
    role: "decorative",
    source: "banani-generated",
    src: "https://storage.googleapis.com/banani-generated-images/generated-images/997a586e-7a53-4594-ae75-22ad370a1da0.jpg",
  },
  {
    id: "decorative-bible",
    title: "Open Bible",
    alt: "Open Bible with golden pages",
    aspectRatio: "16:9",
    role: "decorative",
    source: "banani-generated",
    src: "https://storage.googleapis.com/banani-generated-images/generated-images/5b9e902b-b8de-4ab6-9098-175887409271.jpg",
  },
] as const satisfies readonly WeddingImage[];
