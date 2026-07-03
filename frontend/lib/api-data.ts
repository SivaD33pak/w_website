/**
 * api-data.ts — merge layer that reconciles the backend API contract with the
 * richer frontend types.
 *
 * The API returns a thin shape (`{eventId, eventName, date, time, venue}` for
 * events). The local wedding-content.ts registry carries the extra display
 * metadata (`location`, `mapUrl`, `alt`, `aspectRatio`, `role`). The seeded
 * backend IDs match the local `id`s exactly, so we merge by id.
 *
 * Set NEXT_PUBLIC_USE_API_DATA=true to source events from the backend.
 * Until then (and on any fetch failure) we fall back to local data, so the
 * page never breaks.
 */

import { events as localEvents } from "@/lib/wedding-content";
import { getEvents } from "@/lib/api";

/** When true, events are sourced from the backend API. */
export const useApiData = process.env.NEXT_PUBLIC_USE_API_DATA === "true";

// The frontend reads from local data as a typed array (loosening the `as const`
// readonly narrowing so we can reassign from API merges).
export type LocalEvent = (typeof localEvents)[number];

/**
 * Fetch events from the API when enabled and merge in the local
 * `location`/`mapUrl` metadata by eventId. Always falls back to local data
 * (e.g. when the flag is off, or the request fails).
 */
export async function getEnrichedEvents(): Promise<LocalEvent[]> {
  if (!useApiData) return [...localEvents];

  try {
    const apiEvents = await getEvents();
    return apiEvents.map((api) => {
      const local = localEvents.find((e) => e.id === api.eventId);
      // API is the source of truth for dynamic fields; local supplies the rest.
      return {
        ...(local ?? {}),
        id: api.eventId,
        title: api.eventName,
        date: api.date,
        time: api.time,
        venue: api.venue,
      } as LocalEvent;
    });
  } catch {
    // Network/parse failure — never break the page over optional enrichment.
    return [...localEvents];
  }
}
