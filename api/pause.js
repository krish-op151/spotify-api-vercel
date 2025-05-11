import fetch from 'node-fetch';

export default async function handler(req, res) {
  const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;

  if (!accessToken) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return res.status(response.status).json({ error: data.error.message });
    }

    // return res.status(200).json({ message: 'Playback paused' });
    return res.status(204).end(); // Clean, accurate status for success

  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
}
