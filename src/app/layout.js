import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { PlayerProvider } from '@/context/PlayerContext';
import Sidebar from '@/components/Sidebar';
import Player from '@/components/Player';

export const metadata = {
  title: "Music Wave",
  description: "Listen to music your way",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <PlayerProvider>
            <div className="app-layout">
              <Sidebar />
              <main className="main-content">
                {children}
              </main>
              <Player />
            </div>
          </PlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
