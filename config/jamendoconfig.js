const JAMENDO_API_BASE = "https://api.jamendo.com/v3.0";

export async function fetchJamendoTracks({ limit = 30, search = "" } = {}) {
  const clientId = process.env.JAMENDO_CLIENT_ID;
  if (!clientId) {
    console.log("JAMENDO_CLIENT_ID not set, skipping Jamendo fetch");
    return [];
  }

  const params = new URLSearchParams({
    client_id: clientId,
    format: "json",
    limit: String(limit),
    include: "musicinfo",
    audioformat: "mp32",
    imagesize: "300",
  });
  if (search) params.set("search", search);

  const response = await fetch(`${JAMENDO_API_BASE}/tracks/?${params}`);
  if (!response.ok) {
    throw new Error(`Jamendo API responded ${response.status}`);
  }

  const json = await response.json();

  return (json.results || []).map((track) => ({
    _id: `jamendo-${track.id}`,
    title: track.name,
    artist: track.artist_name,
    filePath: track.audio,
    imagePath: track.image,
    source: "jamendo",
  }));
}
