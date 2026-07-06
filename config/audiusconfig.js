const AUDIUS_API_BASE = "https://discoveryprovider.audius.co/v1";

export async function fetchAudiusTracks({ limit = 30, search = "" } = {}) {
  const params = new URLSearchParams({
    app_name: "VibeVault",
    limit: String(limit),
  });
  if (search) params.set("query", search);

  const endpoint = search ? "tracks/search" : "tracks/trending";

  // Don't let a slow/unreachable discovery node stall the whole songs list.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${AUDIUS_API_BASE}/${endpoint}?${params}`, {
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Audius API responded ${response.status}`);
    }
    const json = await response.json();

    return (json.data || [])
      .map((track) => ({
        _id: `audius-${track.id}`,
        title: track.title,
        artist: track.user?.name || track.user?.handle || "Unknown Artist",
        filePath: track.stream?.url,
        imagePath:
          track.artwork?.["480x480"] ||
          track.artwork?.["1000x1000"] ||
          track.artwork?.["150x150"] ||
          null,
        source: "audius",
      }))
      .filter((track) => track.filePath);
  } finally {
    clearTimeout(timeout);
  }
}
