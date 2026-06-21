import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { PlayContext } from "../context/PlayContext";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const { playSong, setSongList, currentSong, isPlaying, togglePlay } = useContext(PlayContext);

  const [stats, setStats] = useState(null);
  const [topSongs, setTopSongs] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, topSongsRes, topArtistsRes, recentSongsRes] = await Promise.all([
        api.get("/dashboard/stats", { headers }),
        api.get("/dashboard/top-songs", { headers }),
        api.get("/dashboard/top-artists", { headers }),
        api.get("/dashboard/recent-songs", { headers }),
      ]);

      setStats(statsRes.data);
      setTopSongs(topSongsRes.data || []);
      setTopArtists(topArtistsRes.data || []);
      setRecentSongs(recentSongsRes.data || []);
    } catch (err) {
      console.error("Error fetching dashboard details:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySongInDashboard = (song, idx, songsQueue) => {
    setSongList(songsQueue);
    playSong(song, idx);
  };

  if (loading) {
    return (
      <div className="page" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "var(--text-muted)" }}>
        <div style={{ fontSize: 40, marginBottom: 16, animation: "spin 2s linear infinite" }}>💿</div>
        <div>Loading dashboard analytics…</div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Non-admin restricted access view
  if (!isAdmin) {
    return (
      <div className="page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "75vh" }}>
        <div className="dashboard-restricted-card">
          <div className="restricted-icon">🔒</div>
          <h2 className="restricted-title">Admin Access Restricted</h2>
          <p className="restricted-text">
            This dashboard displays platform-wide analytics and administration controls. 
            Your current account role (<strong>{user?.role || "user"}</strong>) does not have authorization.
          </p>
          <Link to="/home" className="restricted-btn">
            Return to Discover
          </Link>
        </div>

        <style>{`
          .dashboard-restricted-card {
            background: var(--bg-glass);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 40px;
            text-align: center;
            max-width: 500px;
            box-shadow: var(--shadow-card);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            animation: fadeIn 0.4s ease-out;
          }
          .restricted-icon {
            font-size: 56px;
            margin-bottom: 20px;
            display: inline-block;
            filter: drop-shadow(0 0 15px var(--accent-glow));
            animation: pulse 2s infinite ease-in-out;
          }
          .restricted-title {
            font-size: 22px;
            font-weight: 800;
            background: var(--gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 12px;
          }
          .restricted-text {
            color: var(--text-secondary);
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 24px;
          }
          .restricted-btn {
            display: inline-block;
            background: var(--gradient);
            color: white;
            text-decoration: none;
            padding: 11px 24px;
            border-radius: 99px;
            font-size: 13.5px;
            font-weight: 600;
            box-shadow: 0 4px 16px var(--accent-glow);
            transition: var(--transition);
          }
          .restricted-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(139,92,246,0.5);
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // Admin Dashboard main view
  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">Platform Dashboard 📊</h1>
        <p className="page-subtitle">Real-time usage analytics and platform summary</p>
      </div>

      {error && <div className="dashboard-error-banner">{error}</div>}

      {/* Stats Cards Grid */}
      <div className="dashboard-grid-4">
        <div className="dashboard-stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Users</span>
            <span className="stat-icon">👥</span>
          </div>
          <div className="stat-value">{stats?.totalUsers ?? 0}</div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Tracks</span>
            <span className="stat-icon">🎵</span>
          </div>
          <div className="stat-value">{stats?.totalSongs ?? 0}</div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-header">
            <span className="stat-label">Playlists Created</span>
            <span className="stat-icon">📂</span>
          </div>
          <div className="stat-value">{stats?.totalPlaylists ?? 0}</div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-header">
            <span className="stat-label">Streams / Plays</span>
            <span className="stat-icon">📈</span>
          </div>
          <div className="stat-value">{stats?.totalPlays ?? 0}</div>
        </div>
      </div>

      {/* Tables and detail sections */}
      <div className="dashboard-layout-split">
        {/* Left column */}
        <div className="dashboard-column">
          {/* Top Songs */}
          <div className="dashboard-card">
            <h2 className="dashboard-card-title">Top 5 Played Songs 🔥</h2>
            <div className="dashboard-list">
              {topSongs.length === 0 ? (
                <div className="dashboard-empty-msg">No playback data logged yet</div>
              ) : (
                topSongs.map((item, idx) => {
                  const song = item.song;
                  if (!song) return null;
                  const isThisSong = currentSong?._id === song._id;
                  const showPlaying = isThisSong && isPlaying;
                  const songsQueue = topSongs.map(ts => ts.song).filter(Boolean);

                  return (
                    <div key={`${song._id}-${idx}`} className={`dashboard-row ${isThisSong ? "active" : ""}`}>
                      <div className="row-prefix">
                        <span className="rank-number">#{idx + 1}</span>
                      </div>
                      <div className="row-cover">
                        {song.coverImage ? (
                          <img src={song.coverImage} alt={song.title} />
                        ) : (
                          "🎵"
                        )}
                        <button
                          className="row-play-btn"
                          onClick={() => {
                            if (isThisSong) {
                              togglePlay();
                            } else {
                              handlePlaySongInDashboard(song, songsQueue.findIndex(s => s._id === song._id), songsQueue);
                            }
                          }}
                        >
                          {showPlaying ? "⏸" : "▶"}
                        </button>
                      </div>
                      <div className="row-info">
                        <div className="row-title">{song.title}</div>
                        <div className="row-subtitle">{song.artist || "Unknown Artist"}</div>
                      </div>
                      <div className="row-metric">
                        <span className="badge-plays">{item.playCount} plays</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Top Artists */}
          <div className="dashboard-card" style={{ marginTop: "24px" }}>
            <h2 className="dashboard-card-title">Top Artists 🎤</h2>
            <div className="dashboard-list">
              {topArtists.length === 0 ? (
                <div className="dashboard-empty-msg">No artist statistics yet</div>
              ) : (
                topArtists.map((artist, idx) => (
                  <div key={`${artist._id}-${idx}`} className="dashboard-row">
                    <div className="row-prefix">
                      <span className="rank-badge">★</span>
                    </div>
                    <div className="row-info">
                      <div className="row-title" style={{ fontSize: "14px", fontWeight: 600 }}>{artist._id || "Unknown Artist"}</div>
                    </div>
                    <div className="row-metric">
                      <span className="badge-plays">{artist.playCount} streams</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="dashboard-column">
          {/* Recently Uploaded */}
          <div className="dashboard-card">
            <h2 className="dashboard-card-title">Recently Uploaded Tracks 🆕</h2>
            <div className="dashboard-list">
              {recentSongs.length === 0 ? (
                <div className="dashboard-empty-msg">No tracks uploaded yet</div>
              ) : (
                recentSongs.map((song, idx) => {
                  const isThisSong = currentSong?._id === song._id;
                  const showPlaying = isThisSong && isPlaying;

                  return (
                    <div key={`${song._id}-${idx}`} className={`dashboard-row ${isThisSong ? "active" : ""}`}>
                      <div className="row-cover">
                        {song.coverImage ? (
                          <img src={song.coverImage} alt={song.title} />
                        ) : (
                          "🎵"
                        )}
                        <button
                          className="row-play-btn"
                          onClick={() => {
                            if (isThisSong) {
                              togglePlay();
                            } else {
                              handlePlaySongInDashboard(song, idx, recentSongs);
                            }
                          }}
                        >
                          {showPlaying ? "⏸" : "▶"}
                        </button>
                      </div>
                      <div className="row-info">
                        <div className="row-title">{song.title}</div>
                        <div className="row-subtitle">{song.artist || "Unknown Artist"}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-error-banner {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          font-size: 13.5px;
          margin-bottom: 24px;
        }
        .dashboard-grid-4 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 28px;
        }
        .dashboard-stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px;
          transition: var(--transition);
        }
        .dashboard-stat-card:hover {
          background: var(--bg-card-hover);
          border-color: var(--border-accent);
          transform: translateY(-2px);
          box-shadow: var(--shadow-glow);
        }
        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .stat-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-secondary);
        }
        .stat-icon {
          font-size: 20px;
        }
        .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.5px;
        }
        .dashboard-layout-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 900px) {
          .dashboard-layout-split {
            grid-template-columns: 1fr;
          }
        }
        .dashboard-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 24px;
        }
        .dashboard-card-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 16px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 10px;
        }
        .dashboard-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .dashboard-empty-msg {
          text-align: center;
          color: var(--text-muted);
          font-size: 13px;
          padding: 30px 0;
        }
        .dashboard-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 12px;
          background: rgba(255,255,255,0.01);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          transition: var(--transition);
        }
        .dashboard-row:hover, .dashboard-row.active {
          background: var(--bg-card-hover);
          border-color: var(--border-accent);
        }
        .row-prefix {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
        }
        .rank-number {
          font-size: 13px;
          font-weight: 700;
          color: var(--accent-2);
        }
        .rank-badge {
          color: #f59e0b;
          font-size: 14px;
        }
        .row-cover {
          width: 38px;
          height: 38px;
          border-radius: 6px;
          background: var(--gradient-soft);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .row-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 6px;
        }
        .row-play-btn {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.5);
          border: none;
          color: white;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: var(--transition);
        }
        .row-cover:hover .row-play-btn, .dashboard-row.active .row-play-btn {
          opacity: 1;
        }
        .row-info {
          flex: 1;
          min-width: 0;
        }
        .row-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .row-subtitle {
          font-size: 11px;
          color: var(--text-secondary);
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .row-metric {
          flex-shrink: 0;
        }
        .badge-plays {
          font-size: 11px;
          font-weight: 500;
          background: var(--accent-dim);
          color: var(--accent-2);
          padding: 4px 8px;
          border-radius: 99px;
          border: 1px solid rgba(139,92,246,0.25);
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
