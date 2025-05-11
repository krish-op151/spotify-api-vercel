import fetch from 'node-fetch';

export default async function handler(req, res) {
  const token = process.env.ACCESS_TOKEN;

  const headers = { Authorization: `Bearer ${token}` };

  try {
    const [top, playing, artists] = await Promise.all([
      fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', { headers }).then(r => r.json()),
      fetch('https://api.spotify.com/v1/me/player/currently-playing', { headers }).then(r => r.json()),
      fetch('https://api.spotify.com/v1/me/following?type=artist', { headers }).then(r => r.json()),
    ]);

    res.status(200).json({
      topTracks: top.items?.map(t => ({
        name: t.name,
        uri: t.uri,
        artists: t.artists.map(a => a.name),
      })),
      nowPlaying: playing?.item?.name || 'Nothing is playing',
      followedArtists: artists.artists?.items.map(a => a.name),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data', details: err.message });
  }
}
