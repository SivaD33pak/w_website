export type WeddingImage = {
  id: string;
  title: string;
  src: string;
  alt: string;
  aspectRatio: "1:1" | "1:3" | "3:4" | "4:3" | "16:9";
  role: "hero" | "story" | "event" | "gallery" | "decorative" | "rsvp";
  source: "banani-firebase" | "banani-generated";
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
  "gallery",
  "bible-verse",
  "rsvp",
  "contact",
] as const;

export const navigationItems = [
  { label: "HOME", href: "#home", sectionId: "home" },
  { label: "OUR STORY", href: "#our-story", sectionId: "our-story" },
  { label: "EVENTS", href: "#events", sectionId: "events" },
  { label: "GALLERY", href: "#gallery", sectionId: "gallery" },
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
    source: "banani-firebase",
    src: "https://firebasestorage.googleapis.com/v0/b/banani-prod.appspot.com/o/reference-images%2F26a5e1e8-897d-4f9a-b54e-b42f7b4142e3?alt=media&token=9adee2ef-31d9-4863-be51-385748ed2e1a",
  },
  {
    id: "hero-mountain",
    title: "Mountain silhouette",
    alt: "Mountain silhouette",
    aspectRatio: "16:9",
    role: "hero",
    source: "banani-firebase",
    src: "https://firebasestorage.googleapis.com/v0/b/banani-prod.appspot.com/o/reference-images%2Ff436c404-56bf-4d24-a826-59537d1661fd?alt=media&token=91431ade-47bb-4ec3-b151-d59405bb875a",
  },
  {
    id: "hero-church",
    title: "Church with fairy lights",
    alt: "Church with fairy lights",
    aspectRatio: "16:9",
    role: "hero",
    source: "banani-firebase",
    src: "https://firebasestorage.googleapis.com/v0/b/banani-prod.appspot.com/o/reference-images%2Fb7aeb559-268d-4665-ba3a-d86f14f28f13?alt=media&token=952e0fac-e37d-41aa-9585-a0bc679ef882",
  },
  {
    id: "hero-blossoms",
    title: "Cherry blossom branches",
    alt: "Cherry blossom branches",
    aspectRatio: "16:9",
    role: "hero",
    source: "banani-firebase",
    src: "https://firebasestorage.googleapis.com/v0/b/banani-prod.appspot.com/o/reference-images%2Fde129549-78ab-448e-ba9e-780f8f6e1278?alt=media&token=085b93ba-4d44-4153-98ee-3b68cb82977c",
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
    id: "gallery-bride",
    title: "Bride Portrait",
    alt: "Bride in a white wedding gown with a floral crown",
    aspectRatio: "3:4",
    role: "gallery",
    source: "banani-generated",
    src: "https://storage.googleapis.com/banani-generated-images/generated-images/89485a65-8d3e-42aa-ae78-4c945e71b559.jpg",
  },
  {
    id: "gallery-groom",
    title: "Groom Portrait",
    alt: "Groom in an elegant black suit",
    aspectRatio: "4:3",
    role: "gallery",
    source: "banani-generated",
    src: "https://storage.googleapis.com/banani-generated-images/generated-images/09879492-06cb-4e45-8d15-980194817ffe.jpg",
  },
  {
    id: "gallery-couple-garden",
    title: "Garden Walk",
    alt: "Bride and groom walking together in a garden",
    aspectRatio: "4:3",
    role: "gallery",
    source: "banani-generated",
    src: "https://storage.googleapis.com/banani-generated-images/generated-images/564d69bb-01c5-4877-8519-088b8bafef8a.jpg",
  },
  {
    id: "gallery-church-interior",
    title: "Church Interior",
    alt: "Decorated church interior for a wedding ceremony",
    aspectRatio: "3:4",
    role: "gallery",
    source: "banani-generated",
    src: "https://storage.googleapis.com/banani-generated-images/generated-images/183643c1-0078-4856-891f-33dee7795aac.jpg",
  },
  {
    id: "gallery-bouquet",
    title: "Bouquet",
    alt: "Bride holding a rose bouquet",
    aspectRatio: "3:4",
    role: "gallery",
    source: "banani-generated",
    src: "https://storage.googleapis.com/banani-generated-images/generated-images/f7a8d853-9a52-4d6d-a8c7-b3f0e954ea3c.jpg",
  },
  {
    id: "gallery-first-kiss",
    title: "First Kiss",
    alt: "Wedding couple first kiss at the altar",
    aspectRatio: "4:3",
    role: "gallery",
    source: "banani-generated",
    src: "https://storage.googleapis.com/banani-generated-images/generated-images/2daa0de7-8d51-49c9-ad67-a6a85eb8b8f8.jpg",
  },
  {
    id: "gallery-flower-field",
    title: "Flower Field",
    alt: "Pre-wedding couple portrait in a flower field",
    aspectRatio: "4:3",
    role: "gallery",
    source: "banani-generated",
    src: "https://storage.googleapis.com/banani-generated-images/generated-images/8a673d06-31e8-4342-9291-75307ea10417.jpg",
  },
  {
    id: "gallery-family",
    title: "Family Portrait",
    alt: "Wedding family group portrait",
    aspectRatio: "3:4",
    role: "gallery",
    source: "banani-generated",
    src: "https://storage.googleapis.com/banani-generated-images/generated-images/50281493-0077-44d2-8080-cf34feaee0ea.jpg",
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

export const rsvpFields = [
  { name: "invitationCode", label: "Invitation Code", type: "text", required: true },
  { name: "guestName", label: "Guest Name", type: "text", required: true },
  { name: "adults", label: "Number of Adults", type: "number", required: true },
  { name: "children", label: "Number of Children", type: "number", required: false },
  { name: "foodPreference", label: "Food Preference", type: "select", required: false },
  { name: "message", label: "Personal Message", type: "textarea", required: false },
] as const;
