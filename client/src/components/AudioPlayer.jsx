import {useRef} from 'react';
function AudioPlayer({url}){
    const audioRef=useRef();
    const playSong=()=>{
        audioRef.current.play();
    }
    const pauseSong=()=>{
        audioRef.current.pause();
    }
    return(
        <div>
            <audio ref={audioRef} src={url} />
            <button onClick={playSong}>Play</button>
            <button onClick={pauseSong}>Pause</button>
        </div>
    )
}

export default AudioPlayer;