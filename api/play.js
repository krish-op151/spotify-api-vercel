import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { trackUri, q = "lofi" } = req.query; // 'q' = fallback query if no trackUri
  const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;

  if (!accessToken) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  let finalTrackUri = trackUri;

  // If no track URI provided, search Spotify
  if (!finalTrackUri) {
    try {
      const searchRes = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=1`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!searchRes.ok) {
        const errData = await searchRes.json();
        return res.status(searchRes.status).json({ error: errData.error.message });
      }

      const searchData = await searchRes.json();
      const firstTrack = searchData?.tracks?.items?.[0];

      if (!firstTrack) {
        return res.status(404).json({ error: 'No track found for query' });
      }

      finalTrackUri = firstTrack.uri;
    } catch (err) {
      return res.status(500).json({ error: 'Track search failed', message: err.message });
    }
  }

  // Play the track
  try {
    const playRes = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uris: [finalTrackUri] }),
    });

    if (!playRes.ok) {
      const errData = await playRes.json();
      return res.status(playRes.status).json({ error: errData.error.message });
    }

    return res.status(204).end(); // Success
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
}
