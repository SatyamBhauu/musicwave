<script>
        const state = {
            currentSong: null,
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            volume: 0.5,
            isMuted: false,
        };

        const songs = [
            { id: 1, title: "Cosmic Drift", artist: "Stellar Waves", duration: "3:45", initials: "CD", color: "bg-indigo-600" },
            { id: 2, title: "Urban Echoes", artist: "City Beat", duration: "2:59", initials: "UE", color: "bg-green-600" },
            { id: 3, title: "Forest Retreat", artist: "Ambient Flow", duration: "4:12", initials: "FR", color: "bg-orange-600" },
            { id: 4, title: "Neon Pulse", artist: "City Beat", duration: "3:20", initials: "NP", color: "bg-purple-600" },
            { id: 5, title: "Midnight Drive", artist: "Synth Rider", duration: "3:55", initials: "MD", color: "bg-blue-600" },
            { id: 6, title: "Rainy Day Loop", artist: "Lofi Dreamer", duration: "2:40", initials: "RL", color: "bg-red-600" },
        ];

        // --- Utility Functions for Firebase and LLM API ---
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
        const apiKey = ""; // API Key for Gemini

        async function fetchLlmResponse(userPrompt) {
            // Note: This function is a placeholder. You would implement the actual 
            // fetch call here for Gemini if you wanted to use an LLM for features 
            // like generating a personalized playlist description or a song summary.
            console.log("LLM API called with prompt:", userPrompt);

            // Mock API response for demonstration
            return new Promise(resolve => setTimeout(() => {
                resolve("The LLM (Gemini) says: Your prompt was about music, which is awesome! I can help you find new tracks or write album reviews.");
            }, 1000));
        }

        // --- Core UI Update Functions ---
        function renderSidebar() {
            const navItems = [
                { icon: 'home', label: 'Home', active: true },
                { icon: 'search', label: 'Search', active: false },
                { icon: 'library', label: 'Your Library', active: false },
            ];
            
            const sidebar = document.getElementById('sidebar-nav');
            sidebar.innerHTML = navItems.map(item => `
                <a href="#" 
                   class="flex items-center p-3 rounded-xl cursor-pointer interactive-item ${item.active ? 'bg-[#1ed760] bg-opacity-10 text-[#1ed760]' : 'text-gray-400 hover:text-white'}" 
                   onclick="handleNavigation('${item.label}')"
                >
                    <i data-lucide="${item.icon}" class="w-6 h-6 mr-4"></i>
                    <span class="font-semibold text-lg">${item.label}</span>
                </a>
            `).join('');

            // Replace lucide icons
            lucide.createIcons(); 
        }

        function renderSongs() {
            const list = document.getElementById('trending-list');
            list.innerHTML = songs.map((song, index) => `
                <div id="song-${song.id}" 
                     class="song-item flex items-center p-2 rounded-xl cursor-pointer ${state.currentSong?.id === song.id ? 'active' : ''}" 
                     onclick="playSong(${song.id})">
                    <!-- Rank -->
                    <div class="w-8 text-center font-bold text-lg text-gray-400 mr-4">${index + 1}</div>
                    
                    <!-- Initials/Artwork Placeholder -->
                    <div class="w-10 h-10 ${song.color} rounded-md flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">
                        ${song.initials}
                    </div>

                    <!-- Song Info -->
                    <div class="flex-grow min-w-0">
                        <div class="text-white font-semibold truncate">${song.title}</div>
                        <div class="text-sm text-gray-400 truncate">${song.artist}</div>
                    </div>

                    <!-- Duration -->
                    <div class="text-sm text-gray-400 ml-4 flex-shrink-0">${song.duration}</div>
                </div>
            `).join('');
        }

        function updatePlayerUI() {
            const playerStatus = document.getElementById('player-status');
            const playPauseIcon = document.getElementById('play-pause-icon');
            const timeCurrent = document.getElementById('time-current');
            const timeDuration = document.getElementById('time-duration');
            const progressBarFill = document.getElementById('progress-bar-fill');
            const volumeIcon = document.getElementById('volume-icon');

            if (state.currentSong) {
                playerStatus.innerHTML = `
                    <div class="text-white font-semibold">${state.currentSong.title}</div>
                    <div class="text-xs text-gray-400">${state.currentSong.artist}</div>
                `;
                document.getElementById('select-song-message').classList.add('hidden');
            } else {
                playerStatus.innerHTML = '';
                document.getElementById('select-song-message').classList.remove('hidden');
            }
            
            // Update Play/Pause Icon
            playPauseIcon.setAttribute('data-lucide', state.isPlaying ? 'pause' : 'play');
            lucide.createIcons();

            // Update Time
            const formatTime = (seconds) => {
                const minutes = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
            };

            timeCurrent.textContent = formatTime(state.currentTime);
            timeDuration.textContent = formatTime(state.duration);

            // Update Progress Bar
            if (state.duration > 0) {
                const progress = (state.currentTime / state.duration) * 100;
                progressBarFill.style.width = `${progress}%`;
            } else {
                progressBarFill.style.width = '0%';
            }

            // Update Volume Icon
            let volIcon = 'volume-2'; // Default
            if (state.isMuted || state.volume === 0) {
                volIcon = 'volume-x';
            } else if (state.volume > 0.6) {
                volIcon = 'volume-2';
            } else if (state.volume > 0) {
                volIcon = 'volume-1';
            } else {
                volIcon = 'volume-x';
            }
            volumeIcon.setAttribute('data-lucide', volIcon);
            lucide.createIcons();

            // Rerender song list to update 'active' class
            renderSongs();
        }

        // --- Event Handlers and Logic ---

        function playSong(songId) {
            const song = songs.find(s => s.id === songId);
            if (!song) return;

            // Remove active class from previously playing song
            if (state.currentSong) {
                document.getElementById(`song-${state.currentSong.id}`)?.classList.remove('active');
            }

            state.currentSong = song;
            state.duration = parseDuration(song.duration);
            state.currentTime = 0;
            state.isPlaying = true;

            // Add active class to the new song
            document.getElementById(`song-${song.id}`)?.classList.add('active');

            // Start "playback" simulation
            if (state.interval) clearInterval(state.interval);
            state.interval = setInterval(simulatePlayback, 1000);

            updatePlayerUI();
        }

        function parseDuration(durationStr) {
            const [minutes, seconds] = durationStr.split(':').map(Number);
            return minutes * 60 + seconds;
        }

        function simulatePlayback() {
            if (!state.isPlaying || !state.currentSong) return;

            if (state.currentTime < state.duration) {
                state.currentTime += 1;
            } else {
                // Song finished
                state.currentTime = state.duration;
                state.isPlaying = false;
                clearInterval(state.interval);
            }
            updatePlayerUI();
        }

        function togglePlayPause() {
            if (!state.currentSong) return;

            state.isPlaying = !state.isPlaying;
            if (state.isPlaying) {
                if (!state.interval) {
                    state.interval = setInterval(simulatePlayback, 1000);
                }
            } else {
                if (state.interval) {
                    clearInterval(state.interval);
                    state.interval = null;
                }
            }
            updatePlayerUI();
        }

        function seek(event) {
            if (!state.currentSong || state.duration === 0) return;

            const progressBar = document.getElementById('progress-bar-container');
            const rect = progressBar.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const percentage = clickX / rect.width;
            
            state.currentTime = Math.round(state.duration * percentage);
            updatePlayerUI();
        }

        function handleVolumeChange(value) {
            state.volume = value / 100;
            state.isMuted = state.volume === 0;
            updatePlayerUI();
        }

        function toggleMute() {
            state.isMuted = !state.isMuted;
            document.getElementById('volume-slider').value = state.isMuted ? 0 : (state.volume * 100);
            updatePlayerUI();
        }

        function handleNavigation(label) {
            // Placeholder for navigation logic
            document.getElementById('content-title').textContent = label === 'Home' ? 'Trending Now' : label;
        }


        // --- Initialization ---
        document.addEventListener('DOMContentLoaded', () => {
            renderSidebar();
            renderSongs();
            updatePlayerUI();
            
            // Set initial volume slider position
            document.getElementById('volume-slider').value = state.volume * 100;
        });
