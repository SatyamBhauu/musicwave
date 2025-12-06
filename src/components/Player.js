"use client";
import { usePlayer } from '@/context/PlayerContext';
import { useEffect, useState } from 'react';

export default function Player() {
    const { currentSong, isPlaying, togglePlay, audioRef } = usePlayer();
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setProgress(audio.currentTime);
            setDuration(audio.duration || 0);
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', updateProgress); // Ensure duration is set
        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', updateProgress);
        }
    }, [audioRef]);

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleSeek = (e) => {
        const newTime = e.target.value;
        if (audioRef.current) audioRef.current.currentTime = newTime;
        setProgress(newTime);
    };

    if (!currentSong) return (
        <div className="player-bar" style={{ justifyContent: 'center', color: 'var(--text-secondary)' }}>
            <audio ref={audioRef} />
            <div>Select a song to play music</div>
        </div>
    );

    return (
        <div className="player-bar">
            <audio ref={audioRef} src={currentSong.url} />

            <div style={{ display: 'flex', alignItems: 'center', width: '30%' }}>
                <img src={currentSong.cover} alt="cover" style={{ width: '56px', height: '56px', borderRadius: '4px', marginRight: '16px', objectFit: 'cover' }} />
                <div style={{ overflow: 'hidden' }}>
                    <div style={{ color: 'white', fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentSong.title}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{currentSong.artist}</div>
                </div>
                <div style={{ marginLeft: '16px', color: 'var(--accent)', cursor: 'pointer' }}>❤️</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '8px' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '16px', cursor: 'pointer' }}>⏮️</button>
                    <button onClick={togglePlay} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'black' }}>
                        {isPlaying ? '⏸️' : '▶️'}
                    </button>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '16px', cursor: 'pointer' }}>⏭️</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '10px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <span>{formatTime(progress)}</span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={progress}
                        onChange={handleSeek}
                        style={{ flex: 1, accentColor: 'var(--text-primary)', height: '4px' }}
                    />
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', color: 'var(--text-secondary)' }}>
                🔊 <input type="range" style={{ width: '80px', marginLeft: '10px', accentColor: 'var(--text-primary)', height: '4px' }} />
            </div>
        </div>
    );
}
