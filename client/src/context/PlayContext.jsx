import { createContext, useState, useRef } from 'react';

export const PlayContext = createContext();

export const PlayProvider = ({ children }) => {
  const [currentSong, setCurrentSong]   = useState(null);
  const [songList, setSongList]         = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying]       = useState(false);

  // Shared audio ref so SongCard can call togglePlay without knowing about GlobalPlayer internals
  const audioRef = useRef(null);

  const playSong = (song, index) => {
    setCurrentSong(song);
    setCurrentIndex(index);
    setIsPlaying(true); // new song always starts playing
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <PlayContext.Provider value={{
      songList, setSongList,
      currentSong, playSong,
      currentIndex, setCurrentSong, setCurrentIndex,
      isPlaying, setIsPlaying,
      togglePlay,
      audioRef,
    }}>
      {children}
    </PlayContext.Provider>
  );
};