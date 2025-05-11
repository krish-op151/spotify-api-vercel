import fetch from 'node-fetch';

export default async function handler(req, res) {
  const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;

  if (!accessToken) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error.message });
    }

    if (!data.item) {
      return res.status(404).json({ error: 'No song currently playing' });
    }

    return res.status(200).json({
      name: data.item.name,
      artist: data.item.artists.map((artist) => artist.name).join(', '),
      album: data.item.album.name,
      url: data.item.external_urls.spotify,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
}
