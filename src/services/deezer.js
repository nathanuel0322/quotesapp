// Deezer's public API needs no key. Preview urls are signed and expire after a while,
// so we store the track id and fetch a fresh preview url right before playing.

const API = 'https://api.deezer.com';
const previewCache = new Map();

export async function searchTracks(q, signal) {
  const res = await fetch(`${API}/search/track?q=${encodeURIComponent(q)}&limit=15`, { signal });
  const json = await res.json();
  return (json.data ?? []).filter((t) => t.readable !== false && t.preview);
}

function linkExpiry(link) {
  const match = /exp=(\d+)/.exec(link ?? '');
  return match ? Number(match[1]) * 1000 : null;
}

function stillValid(link) {
  if (!link) return false;
  const exp = linkExpiry(link);
  // unsigned links (older Deezer format) don't expire
  return exp === null || exp - Date.now() > 60_000;
}

export async function resolvePreview(quote) {
  if (!quote?.link && !quote?.trackId && !quote?.name) return null;
  const key = quote.trackId ?? quote.id;
  const cached = previewCache.get(key);
  if (stillValid(cached)) return cached;
  if (!quote.trackId && stillValid(quote.link)) return quote.link;

  let preview = null;
  try {
    if (quote.trackId) {
      const res = await fetch(`${API}/track/${quote.trackId}`);
      preview = (await res.json()).preview || null;
    } else if (quote.name) {
      // posts made before we stored track ids: look the song up again
      const [first] = await searchTracks(`${quote.artist ?? ''} ${quote.name}`.trim());
      preview = first?.preview ?? null;
    }
  } catch {
    preview = null;
  }
  if (preview) previewCache.set(key, preview);
  return preview;
}
