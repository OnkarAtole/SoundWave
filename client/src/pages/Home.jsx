import api from '../services/api';
import { useContext, useEffect, useState } from 'react';
import SongCard from '../components/SongCard';
import { PlayContext } from '../context/PlayContext';

function Home() {
  const [songs, setSongs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const { setSongList } = useContext(PlayContext);

  useEffect(() => { fetchSongs(); }, []);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch songs and user's favorites concurrently to resolve previously liked tracks
      const [songsRes, favsRes] = await Promise.all([
        api.get('/songs'),
        api.get('/favorites', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
      ]);

      const favIds = new Set(favsRes.data.map(fav => fav._id));
      setFavoriteIds(favIds);
      setSongs(songsRes.data);
      setSongList(songsRes.data);
    } catch (err) {
      console.error('Error fetching songs:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchSongs = async (kw) => {
    setKeyword(kw);
    if (!kw.trim()) { fetchSongs(); return; }
    try {
      const res = await api.get(`/songs/search?keyword=${kw}`);
      setSongs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Discover Music 🎧</h1>
        <p className="page-subtitle">{songs.length} songs in your library</p>
      </div>

      {/* Search */}
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          type="text"
          placeholder="Search songs, artists, albums…"
          value={keyword}
          onChange={(e) => searchSongs(e.target.value)}
        />
      </div>

      {/* Songs Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎵</div>
          Loading your library…
        </div>
      ) : songs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎶</div>
          <div style={{ fontWeight: 600, marginBottom: 6, color: "var(--text-secondary)" }}>No songs found</div>
          <div style={{ fontSize: 13 }}>Try a different search or upload new music</div>
        </div>
      ) : (
        <div className="songs-grid fade-in">
          {songs.map((song, index) => (
            <SongCard 
              key={song._id} 
              song={song} 
              index={index} 
              initialFavorited={favoriteIds.has(song._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;