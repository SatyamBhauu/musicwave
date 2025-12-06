"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Sidebar() {
    const { user, login, logout } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const [username, setUsername] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        if (username.trim()) login(username);
        setShowLogin(false);
    };

    return (
        <aside className="sidebar">
            <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent)' }}>🌊 Music Wave</h1>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Link href="/" className="hover:text-white" style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>🏠</span> Home
                </Link>
                <Link href="#" style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>🔍</span> Search
                </Link>
                <Link href="#" style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>📚</span> Your Library
                </Link>
            </nav>

            <div style={{ marginTop: '40px' }}>
                <div style={{ marginBottom: '16px', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)', letterSpacing: '2px' }}>
                    PLAYLISTS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)' }}>
                    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ background: 'var(--text-secondary)', color: 'black', padding: '2px 6px', borderRadius: '2px' }}>+</span> Create Playlist
                    </div>
                    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ background: 'linear-gradient(135deg, #450af5, #c4efd9)', color: 'white', padding: '2px 6px', borderRadius: '2px' }}>❤️</span> Liked Songs
                    </div>
                </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold' }}>
                                {user.name[0].toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 'bold' }}>{user.name}</span>
                        </div>
                        <button onClick={logout} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px' }}>LOGOUT</button>
                    </div>
                ) : (
                    !showLogin ? (
                        <button onClick={() => setShowLogin(true)} className="btn-primary" style={{ width: '100%', fontSize: '14px' }}>Login / Signup</button>
                    ) : (
                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Enter name..."
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{ padding: '8px', borderRadius: '4px', border: 'none', background: '#333', color: 'white' }}
                                autoFocus
                            />
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <button type="submit" style={{ flex: 1, padding: '5px', borderRadius: '15px', border: 'none', background: 'var(--accent)', cursor: 'pointer' }}>Go</button>
                                <button type="button" onClick={() => setShowLogin(false)} style={{ flex: 1, padding: '5px', borderRadius: '15px', border: '1px solid #555', background: 'transparent', color: 'white', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </form>
                    )
                )}
            </div>
        </aside>
    );
}
