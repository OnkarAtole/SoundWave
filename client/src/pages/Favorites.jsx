import { useState, useEffect } from "react";
import api from "../services/api";
import SongCard from "../components/SongCard";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites(res.data || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (songId) => {
    // Optimistically update the UI when removed
    setFavorites(prev => prev.filter(song => song._id !== songId));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">My Favorites ❤️</h1>
        <p className="page-subtitle">Your personally curated collection of tracks</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎵</div>
          Loading your favorites…
        </div>
      ) : favorites.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>❤️</div>
          <div style={{ fontWeight: 600, marginBottom: 6, color: "var(--text-secondary)" }}>No favorites yet</div>
          <div style={{ fontSize: 13 }}>Click the heart icon on any song card to add it here</div>
        </div>
      ) : (
        <div className="songs-grid fade-in">
          {favorites.map((song, index) => (
            <SongCard 
              key={song._id} 
              song={song} 
              index={index} 
              onRemoveFavorite={handleRemoveFavorite}
              isFavoritedPage={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;