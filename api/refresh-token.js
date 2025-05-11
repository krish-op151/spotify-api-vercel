import fetch from 'node-fetch';

export default async function handler(req, res) {
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Missing refresh token' });
  }

  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || 'Refresh failed', details: data });
    }

    return res.status(200).json({
      new_access_token: data.access_token,
      expires_in: data.expires_in,
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Internal server error',
      message: err.message,
    });
  }
}
