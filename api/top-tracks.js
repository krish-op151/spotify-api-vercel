import fetch from 'node-fetch';

export default async function handler(req, res) {
  const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;

  if (!accessToken) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/me/top/artists', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error.message });
    }

    return res.status(200).json({
      top_tracks: data.items.slice(0, 10).map((track) => ({
        name: track.name,
        artists: track.artists.map((artist) => artist.name).join(', '),
        url: track.external_urls.spotify,
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
}
