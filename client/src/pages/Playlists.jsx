import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { PlayContext } from "../context/PlayContext";

function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { playSong, setSongList, currentSong, isPlaying, togglePlay } = useContext(PlayContext);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async (selectId = null) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/playlists", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const list = res.data || [];
      setPlaylists(list);

      // Select active playlist: either the recently modified one, or the previously selected one, or the first in list
      if (list.length > 0) {
        const active = selectId 
          ? list.find(p => p._id === selectId) 
          : selectedPlaylist 
            ? list.find(p => p._id === selectedPlaylist._id) 
            : list[0];
        setSelectedPlaylist(active || list[0]);
      } else {
        setSelectedPlaylist(null);
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  };

  const createPlaylist = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/playlists", { name: name.trim() }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName("");
      // Fetch playlists and select the newly created one
      await fetchPlaylists(res.data._id);
    } catch (error) {
      console.error("Error creating playlist:", error);
      alert(error.response?.data?.message || "Failed to create playlist");
    }
  };

  const handleDeletePlaylist = async (playlistId, e) => {
    e.stopPropagation(); // Avoid selecting the playlist card
    if (!confirm("Are you sure you want to delete this playlist?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/playlists/${playlistId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // If deleted active playlist, clear selection
      if (selectedPlaylist && selectedPlaylist._id === playlistId) {
        setSelectedPlaylist(null);
      }
      fetchPlaylists();
    } catch (error) {
      console.error("Error deleting playlist:", error);
      alert(error.response?.data?.message || "Failed to delete playlist");
    }
  };

  const handleRemoveSong = async (songId) => {
    if (!selectedPlaylist) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/playlists/${selectedPlaylist._id}/remove-song/${songId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh playlists lists and keep the current one active
      fetchPlaylists(selectedPlaylist._id);
    } catch (error) {
      console.error("Error removing song from playlist:", error);
      alert(error.response?.data?.message || "Failed to remove song");
    }
  };

  const handlePlaySongInPlaylist = (song, idx) => {
    if (!selectedPlaylist) return;
    const isThisSong = currentSong?._id === song._id;
    if (isThisSong) {
      togglePlay(); // same song — just toggle pause/play
    } else {
      setSongList(selectedPlaylist.songs); // set queue to this playlist
      playSong(song, idx);               // start the new song
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">My Playlists 📂</h1>
        <p className="page-subtitle">Organize and listen to your custom sound mixes</p>
      </div>

      {loading && playlists.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📂</div>
          Loading playlists…
        </div>
      ) : (
        <div className="playlists-container">
          {/* Left panel: Playlist Sidebar Card */}
          <div className="playlists-sidebar-card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Create Playlist</h3>
            <form onSubmit={createPlaylist} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <input
                className="form-input"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ padding: "8px 12px", fontSize: 13 }}
              />
              <button 
                type="submit" 
                className="btn-submit" 
                style={{ width: "auto", margin: 0, padding: "8px 16px", fontSize: 13 }}
              >
                Create
              </button>
            </form>

            <h3 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
              All Playlists ({playlists.length})
            </h3>
            
            {playlists.length === 0 ? (
              <div style={{ fontSize: 12, color: "var(--text-muted)", padding: "10px 0" }}>
                No playlists created yet.
              </div>
            ) : (
              playlists.map((pl) => (
                <div
                  key={pl._id}
                  className={`playlist-list-item ${selectedPlaylist?._id === pl._id ? "active" : ""}`}
                  onClick={() => setSelectedPlaylist(pl)}
                >
                  <div>
                    <div className="playlist-list-item-name">{pl.name}</div>
                    <div className="playlist-list-item-count">{pl.songs?.length || 0} tracks</div>
                  </div>
                  <button 
                    className="btn-icon" 
                    title="Delete playlist"
                    onClick={(e) => handleDeletePlaylist(pl._id, e)}
                    style={{ width: 26, height: 26, fontSize: 10 }}
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Right panel: Playlist Content */}
          <div className="playlist-content-card">
            {selectedPlaylist ? (
              <div className="fade-in">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: 14 }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 800 }}>📂 {selectedPlaylist.name}</h2>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                      {selectedPlaylist.songs?.length || 0} tracks inside this playlist
                    </p>
                  </div>
                  {selectedPlaylist.songs?.length > 0 && (
                    <button 
                      className="btn-submit"
                      onClick={() => handlePlaySongInPlaylist(selectedPlaylist.songs[0], 0)}
                      style={{ width: "auto", margin: 0, padding: "10px 20px", borderRadius: 99, display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span>▶</span> Play Playlist
                    </button>
                  )}
                </div>

                {selectedPlaylist.songs?.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
                    <div style={{ fontSize: 42, marginBottom: 12 }}>🎶</div>
                    <div style={{ fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4 }}>
                      This playlist is empty
                    </div>
                    <div style={{ fontSize: 12 }}>
                      Go to the Home page and click ➕ on any song to add it here.
                    </div>
                  </div>
                ) : (
                  <div className="playlist-songs-list">
                    {selectedPlaylist.songs.map((song, idx) => (
                      <div key={song._id} className="playlist-song-row">
                        <span className="playlist-song-row-num">{idx + 1}</span>
                        <div className="playlist-song-row-cover">
                          {song.coverImage ? (
                            <img src={song.coverImage} alt={song.title} />
                          ) : (
                            "🎵"
                          )}
                        </div>
                        <div className="playlist-song-row-info">
                          <div className="playlist-song-row-title">{song.title}</div>
                          <div className="playlist-song-row-artist">{song.artist || "Unknown Artist"}</div>
                        </div>
                        <div className="playlist-song-row-actions">
                          <button
                            className={`btn-icon ${currentSong?._id === song._id && isPlaying ? "liked" : ""}`}
                            title={currentSong?._id === song._id && isPlaying ? "Pause" : "Play"}
                            onClick={() => handlePlaySongInPlaylist(song, idx)}
                            style={currentSong?._id === song._id ? { borderColor: "var(--border-accent)", color: "var(--accent-2)" } : {}}
                          >
                            {currentSong?._id === song._id && isPlaying ? "⏸" : "▶"}
                          </button>
                          <button
                            className="btn-icon"
                            title="Remove from playlist"
                            onClick={() => handleRemoveSong(song._id)}
                          >
                            ❌
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)", padding: "100px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
                <h3 style={{ color: "var(--text-secondary)", fontWeight: 600, marginBottom: 4 }}>No Playlist Selected</h3>
                <p style={{ fontSize: 12 }}>Select a playlist from the sidebar, or create a new one to begin.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Playlists;