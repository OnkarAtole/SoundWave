import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PlayContext } from '../context/PlayContext';
import api from '../services/api';

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function GlobalPlayer() {
  const {
    currentSong, songList, currentIndex, playSong,
    isPlaying, setIsPlaying, togglePlay, audioRef
  } = useContext(PlayContext);

  const location = useLocation();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]       = useState(0);
  const [volume, setVolume]           = useState(0.8);
  const [shuffle, setShuffle]         = useState(false);
  const [repeat, setRepeat]           = useState(false);

  const saveHistory = async (songId) => {
    const token = localStorage.getItem("token");
    try {
      await api.post("/history", { songId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (_) {}
  };

  // When currentSong changes → load + play
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
      saveHistory(currentSong._id);
    }
  }, [currentSong]);

  const nextSong = () => {
    if (shuffle) {
      const ri = Math.floor(Math.random() * songList.length);
      playSong(songList[ri], ri);
    } else if (currentIndex < songList.length - 1) {
      playSong(songList[currentIndex + 1], currentIndex + 1);
    }
  };

  const prevSong = () => {
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    if (currentIndex > 0) playSong(songList[currentIndex - 1], currentIndex - 1);
  };

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  const hidePlayerRoutes = ["/login", "/register", "/"];
  if (hidePlayerRoutes.includes(location.pathname)) return null;

  if (!currentSong) return null;

  return (
    <div className="global-player">
      {/* Left — Song Info */}
      <div className="player-song-info">
        <div className="player-cover">
          {currentSong.coverImage
            ? <img src={currentSong.coverImage} alt={currentSong.title} />
            : "🎵"}
        </div>
        <div>
          <div className="player-title">{currentSong.title}</div>
          <div className="player-artist">{currentSong.artist || "Unknown Artist"}</div>
        </div>
      </div>

      {/* Center — Controls + Progress */}
      <div className="player-center">
        <div className="player-controls">
          <button
            className={`player-btn ${shuffle ? "active" : ""}`}
            onClick={() => setShuffle(!shuffle)}
            title="Shuffle"
          >⇄</button>

          <button className="player-btn" onClick={prevSong} title="Previous">⏮</button>

          <button className="player-btn-play" onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? "⏸" : "▶"}
          </button>

          <button className="player-btn" onClick={nextSong} title="Next">⏭</button>

          <button
            className={`player-btn ${repeat ? "active" : ""}`}
            onClick={() => setRepeat(!repeat)}
            title="Repeat"
          >↺</button>
        </div>

        <div className="player-progress">
          <span className="player-time">{formatTime(currentTime)}</span>
          <input
            className="player-seek"
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            style={{
              background: `linear-gradient(to right, var(--accent) ${progressPct}%, var(--border) ${progressPct}%)`
            }}
            onChange={(e) => {
              const v = Number(e.target.value);
              audioRef.current.currentTime = v;
              setCurrentTime(v);
            }}
          />
          <span className="player-time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right — Volume */}
      <div className="player-right">
        <span className="player-vol-icon">🔊</span>
        <input
          className="player-volume"
          type="range"
          min="0" max="1" step="0.02"
          value={volume}
          style={{
            background: `linear-gradient(to right, var(--accent-2) ${volume * 100}%, var(--border) ${volume * 100}%)`
          }}
          onChange={(e) => {
            const v = Number(e.target.value);
            setVolume(v);
            if (audioRef.current) audioRef.current.volume = v;
          }}
        />
      </div>

      {/* Shared Audio Element */}
      <audio
        ref={audioRef}
        loop={repeat}
        onEnded={nextSong}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={currentSong.audioUrl} />
      </audio>
    </div>
  );
}

export default GlobalPlayer;
