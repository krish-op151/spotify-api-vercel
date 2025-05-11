import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Allow GET or POST
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).end();


  const token = process.env.SPOTIFY_ACCESS_TOKEN;

  const result = await fetch('https://api.spotify.com/v1/me/player/pause', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  res.status(result.status).json({ status: result.statusText });
}
