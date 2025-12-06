"use client";
import React, { createContext, useContext, useState, useRef } from 'react';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const audioRef = useRef(null);

    const playSong = (song) => {
        if (currentSong?.id === song.id) {
            togglePlay();
            return;
        }
        setCurrentSong(song);
        setIsPlaying(true);
        // Allow state to update
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play().catch(e => console.log("Play failed", e));
            }
        }, 50);
    };

    const togglePlay = () => {
        if (isPlaying) {
            if (audioRef.current) audioRef.current.pause();
            setIsPlaying(false);
        } else {
            if (audioRef.current) audioRef.current.play().catch(e => console.log("Play failed", e));
            setIsPlaying(true);
        }
    };

    return (
        <PlayerContext.Provider value={{ currentSong, isPlaying, playSong, togglePlay, audioRef }}>
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    return useContext(PlayerContext);
}
