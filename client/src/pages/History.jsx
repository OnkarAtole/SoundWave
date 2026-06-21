import { useState, useEffect, useContext } from "react";
import api from "../services/api";
import SongCard from "../components/SongCard";
import { PlayContext } from "../context/PlayContext";

function History() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const { setSongList } = useContext(PlayContext);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch history and favorites concurrently
      const [historyRes, favsRes] = await Promise.all([
        api.get("/history", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({ data: [] })),
      ]);

      // Extract songs from history objects
      const historySongs = (historyRes.data || [])
        .filter((item) => item && item.songId)
        .map((item) => item.songId);

      const favIds = new Set((favsRes.data || []).map((fav) => fav._id));

      setFavoriteIds(favIds);
      setSongs(historySongs);
      setSongList(historySongs);
    } catch (error) {
      console.error("Error fetching playback history:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Recently Played 🕐</h1>
        <p className="page-subtitle">Your recently played tracks on SoundWave</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎵</div>
          Loading your history…
        </div>
      ) : songs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🕐</div>
          <div style={{ fontWeight: 600, marginBottom: 6, color: "var(--text-secondary)" }}>No recently played songs</div>
          <div style={{ fontSize: 13 }}>Songs you play will show up here automatically</div>
        </div>
      ) : (
        <div className="songs-grid fade-in">
          {songs.map((song, index) => (
            <SongCard
              key={`${song._id}-${index}`}
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

export default History;
