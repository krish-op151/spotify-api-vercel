export default async function handler(req, res) {
  const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;

  if (!accessToken) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json(error);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
}
