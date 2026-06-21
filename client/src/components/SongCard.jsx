import { useContext, useState, useEffect, useRef } from "react";
import { PlayContext } from "../context/PlayContext";
import api from "../services/api";

function SongCard({ song, index, isFavoritedPage, initialFavorited, onRemoveFavorite }) {
  const { playSong, currentSong, isPlaying, togglePlay } = useContext(PlayContext);
  const [isFavorited, setIsFavorited] = useState(isFavoritedPage || initialFavorited || false);

  // Is THIS card the active/playing song?
  const isThisSong = currentSong?._id === song._id;

  // Playlist dropdown states
  const [showDropdown, setShowDropdown] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setIsFavorited(isFavoritedPage || initialFavorited || false);
  }, [initialFavorited, isFavoritedPage]);

  // Click outside listener to close the playlist menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    
    try {
      if (isFavoritedPage) {
        await api.delete(`/favorites/${song._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (onRemoveFavorite) onRemoveFavorite(song._id);
      } else {
        if (isFavorited) {
          await api.delete(`/favorites/${song._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsFavorited(false);
        } else {
          await api.post(`/favorites/${song._id}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsFavorited(true);
        }
      }
    } catch (err) {
      console.error("Favorite action error:", err);
      alert(err.response?.data?.message || "Failed to update favorites");
    }
  };

  // Toggle dropdown and fetch playlists
  const handlePlaylistClick = async (e) => {
    e.stopPropagation();
    if (showDropdown) {
      setShowDropdown(false);
      return;
    }

    setShowDropdown(true);
    setLoadingPlaylists(true);
    const token = localStorage.getItem("token");
    try {
      const res = await api.get("/playlists", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlaylists(res.data || []);
    } catch (err) {
      console.error("Error fetching playlists:", err);
    } finally {
      setLoadingPlaylists(false);
    }
  };

  // Add song to selected playlist
  const handleAddToPlaylist = async (playlistId, playlistName) => {
    const token = localStorage.getItem("token");
    try {
      await api.post(`/playlists/${playlistId}/add-song`, { songId: song._id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Successfully added to playlist: ${playlistName}!`);
      setShowDropdown(false);
    } catch (err) {
      console.error("Playlist error:", err);
      alert(err.response?.data?.message || "Failed to add song to playlist");
    }
  };

  // Create new playlist and add song directly
  const handleCreateNewPlaylist = async () => {
    const name = prompt("Enter new playlist name:");
    if (!name || !name.trim()) return;

    const token = localStorage.getItem("token");
    try {
      // 1. Create playlist
      const createRes = await api.post("/playlists", { name: name.trim() }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newPlaylist = createRes.data;

      // 2. Add song to newly created playlist
      await api.post(`/playlists/${newPlaylist._id}/add-song`, { songId: song._id }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(`Created playlist "${name}" and added "${song.title}"!`);
      setShowDropdown(false);
    } catch (err) {
      console.error("Error creating playlist:", err);
      alert(err.response?.data?.message || "Failed to create playlist");
    }
  };

  return (
    <div className="song-card" style={{ position: "relative" }}>
      {/* Cover */}
      <div
        className="song-card-cover"
        onClick={() => {
          if (isThisSong) {
            togglePlay(); // already the active song — just toggle pause/play
          } else {
            playSong(song, index); // different song — start playing it
          }
        }}
      >
        {song.coverImage ? (
          <img src={song.coverImage} alt={song.title} />
        ) : (
          <div className="song-card-placeholder">🎵</div>
        )}
        {/* Overlay always visible when THIS song is playing */}
        <div
          className="song-card-play-overlay"
          style={isThisSong ? { opacity: 1 } : undefined}
        >
          <div
            className="song-card-play-btn"
            style={isThisSong && isPlaying ? { background: "var(--gradient)" } : undefined}
          >
            {isThisSong && isPlaying ? "⏸" : "▶"}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="song-card-title">{song.title || "Unknown Title"}</div>
      <div className="song-card-artist">{song.artist || "Unknown Artist"}</div>

      {/* Actions */}
      <div className="song-card-actions">
        <button
          className={`btn-icon ${isFavorited ? "liked" : ""}`}
          title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          onClick={handleFavoriteToggle}
        >
          ❤️
        </button>
        
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button
            className="btn-icon"
            title="Add to playlist"
            onClick={handlePlaylistClick}
          >
            ➕
          </button>

          {showDropdown && (
            <div className="playlist-dropdown">
              <button 
                className="playlist-dropdown-item playlist-dropdown-create"
                onClick={handleCreateNewPlaylist}
              >
                ✨ + Create Playlist
              </button>
              
              <div className="playlist-dropdown-divider"></div>

              {loadingPlaylists ? (
                <div style={{ fontSize: 11, padding: "8px 12px", color: "var(--text-muted)" }}>
                  Loading...
                </div>
              ) : playlists.length === 0 ? (
                <div style={{ fontSize: 11, padding: "8px 12px", color: "var(--text-muted)" }}>
                  No playlists found
                </div>
              ) : (
                playlists.map(pl => (
                  <button
                    key={pl._id}
                    className="playlist-dropdown-item"
                    onClick={() => handleAddToPlaylist(pl._id, pl.name)}
                    title={pl.name}
                  >
                    📂 {pl.name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SongCard;