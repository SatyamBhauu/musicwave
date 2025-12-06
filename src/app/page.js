"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePlayer } from '@/context/PlayerContext';
import { songs, playlists } from '@/lib/data';

export default function Home() {
  const { user } = useAuth();
  const { playSong, currentSong, isPlaying } = usePlayer();
  const [greeting, setGreeting] = useState("Good day"); // Hydration match init

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div style={{ color: 'white', paddingBottom: '100px' }}>
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold' }}>{greeting}{user ? `, ${user.name}` : ''}</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '50%', width: '30px', height: '30px', border: 'none', color: 'white', cursor: 'pointer' }}>&lt;</button>
          <button style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '50%', width: '30px', height: '30px', border: 'none', color: 'white', cursor: 'pointer' }}>&gt;</button>
        </div>
      </header>

      {/* Hero / Featured if needed, but going straight to content */}

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Your Playlists</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '24px' }}>
          {playlists.map(playlist => (
            <div key={playlist.id} className="card group">
              <div style={{ position: 'relative' }}>
                <img src={playlist.cover} alt={playlist.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '4px', marginBottom: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }} />
              </div>
              <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '16px' }}>{playlist.name}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>By Music Wave</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>Trending Hits</h3>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)', cursor: 'pointer', letterSpacing: '1px' }}>SEE ALL</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '24px' }}>
          {songs.map(song => {
            const isCurrent = currentSong && currentSong.id === song.id;
            return (
              <div key={song.id} className="card" onClick={() => playSong(song)}
                style={{ background: isCurrent ? 'var(--bg-card-hover)' : 'var(--bg-card)' }}>
                <div style={{ position: 'relative' }}>
                  <img src={song.cover} alt={song.title} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '4px', marginBottom: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }} />
                  {isCurrent && isPlaying && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', borderRadius: '4px' }}>
                      <span style={{ fontSize: '32px' }}>📊</span>
                    </div>
                  )}
                </div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: isCurrent ? 'var(--accent)' : 'white' }}>{song.title}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{song.artist}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
