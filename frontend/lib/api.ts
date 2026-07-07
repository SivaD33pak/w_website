/**
 * api.ts — typed fetch client for the wedding backend (FastAPI).
 *
 * The backend uses camelCase aliases everywhere (see backend/models/*.py), so
 * every type here is camelCase to match the wire format. Set the base URL with
 * NEXT_PUBLIC_API_URL (defaults to the local dev server).
 *
 * No external HTTP library — this uses native fetch, which is available in both
 * the server runtime and modern browsers.
 */

// Resolved once at module load.
//
// In the browser, an empty base URL means "use this site's origin", so requests
// go through Next rewrites instead of asking a visitor's machine for localhost.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "";

/** Request timeout in milliseconds for every API call. */
const REQUEST_TIMEOUT_MS = 25_000;

/**
 * Typed error thrown by {@link apiFetch} on a non-2xx response or network
 * failure. Carries the backend `message` (when present) so the UI can show it.
 */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ---------------------------------------------------------------------------
// Shared fetch wrapper
// ---------------------------------------------------------------------------

/** Attempt to read a `message` field from a JSON error body, falling back. */
async function extractMessage(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (body && typeof body.message === "string") return body.message;
    if (body && typeof body.detail === "string") return body.detail;
  } catch {
    // Response wasn't JSON — ignore and use the status text.
  }
  return response.statusText || `Request failed (${response.status})`;
}

/**
 * Thin wrapper around fetch that JSON-encodes the body, applies a timeout, and
 * throws an {@link ApiError} (with the backend message) on non-2xx responses.
 */
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  // AbortController gives us a hard timeout — the backend should respond fast,
  // but we never want the RSVP flow to hang forever on a dead network.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      throw new ApiError(await extractMessage(response), response.status);
    }

    return (await response.json()) as T;
  } catch (err) {
    // AbortError → translate into a friendlier message for the UI.
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError(
        "The RSVP is taking longer than usual. Please check your connection and try again.",
      );
    }
    // Already an ApiError — rethrow as-is.
    if (err instanceof ApiError) throw err;
    // Network errors (server down, CORS blocked, DNS) land here.
    throw new ApiError(
      "Unable to reach the server. Please check your connection and try again.",
    );
  } finally {
    clearTimeout(timeout);
  }
}

// ---------------------------------------------------------------------------
// RSVP types — mirror backend/models/rsvp.py
// ---------------------------------------------------------------------------

/** POST /api/rsvp request body. `coming` is the attending yes/no toggle. */
export interface RsvpPayload {
  fullName: string;
  place: string;
  whatsappNumber: string;
  side: "bride" | "groom";
  relation: "friend" | "family";
  coming: boolean;
  guests: number;
}

/** POST /api/rsvp response. */
export interface RsvpResponse {
  saved: boolean;
  guestName: string | null;
  message: string;
}

// ---------------------------------------------------------------------------
// Events types — mirror backend/models/events.py
// ---------------------------------------------------------------------------

/** GET /api/events item. */
export interface WeddingEventApi {
  eventId: string;
  eventName: string;
  date: string;
  time: string;
  venue: string;
}

// ---------------------------------------------------------------------------
// Endpoint functions
// ---------------------------------------------------------------------------

/** POST /api/rsvp — submit (or update) an RSVP entry. */
export function submitRsvp(payload: RsvpPayload): Promise<RsvpResponse> {
  return apiFetch<RsvpResponse>("/api/rsvp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** GET /api/events — list all wedding events. */
export function getEvents(): Promise<WeddingEventApi[]> {
  return apiFetch<WeddingEventApi[]>("/api/events");
}
