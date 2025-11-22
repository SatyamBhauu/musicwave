// Mock data and UI interactions for Music Wve
const tracks = [];
for (let i=1;i<=12;i++){
  tracks.push({
    id:i,
    title:`Song ${i}`,
    artist:`Artist ${((i-1)%6)+1}`,
    duration: 180 + (i%5)*15,
    color: `hsl(${(i*35)%360} 60% 50%)`
  })
}

const grid = document.getElementById('grid');
const playlistList = document.getElementById('playlist-list');

let currentIndex = -1;
let isPlaying = false;
let progressInterval = null;
let currentPosition = 0; // seconds

function fmt(s){
  s = Math.max(0,Math.floor(s));
  return Math.floor(s/60)+":"+String(s%60).padStart(2,'0');
}

function renderGrid(){
  grid.innerHTML='';
  tracks.forEach((t,idx)=>{
    const card = document.createElement('div');
    card.className='card';
    card.onclick = ()=> setCurrent(idx);
    const art = document.createElement('div'); art.className='art'; art.style.background = `linear-gradient(135deg, ${t.color}, #222)`;
    const meta = document.createElement('div'); meta.className='meta';
    const title = document.createElement('div'); title.className='title'; title.textContent = t.title;
    const sub = document.createElement('div'); sub.className='subtitle'; sub.textContent = t.artist;
    meta.appendChild(title); meta.appendChild(sub);
    card.appendChild(art); card.appendChild(meta);
    grid.appendChild(card);
  })
}

function renderPlaylists(){
  const names = ['Favourites','Chill Vibes','Top Hits','Discover Weekly'];
  playlistList.innerHTML = '';
  names.forEach(n=>{
    const li = document.createElement('li'); li.textContent = n; playlistList.appendChild(li);
  })
}

function setCurrent(idx){
  currentIndex = idx;
  currentPosition = 0;
  updatePlayer();
  play();
}

function updatePlayer(){
  const cover = document.getElementById('cover');
  const title = document.getElementById('title');
  const artist = document.getElementById('artist');
  const duration = document.getElementById('duration');
  const progress = document.getElementById('progress');
  if (currentIndex<0){
    cover.style.background = '';
    title.textContent = 'Not Playing';
    artist.textContent = '—';
    duration.textContent = '0:00';
    progress.value = 0;
    document.getElementById('current-time').textContent = '0:00';
    return;
  }
  const t = tracks[currentIndex];
  cover.style.background = `linear-gradient(135deg, ${t.color}, #222)`;
  title.textContent = t.title;
  artist.textContent = t.artist;
  duration.textContent = fmt(t.duration);
  progress.max = t.duration;
  progress.value = currentPosition;
  document.getElementById('current-time').textContent = fmt(currentPosition);
}

function play(){
  if (currentIndex<0) setCurrent(0);
  isPlaying = true;
  document.getElementById('play').textContent = '❚❚';
  clearInterval(progressInterval);
  progressInterval = setInterval(()=>{
    currentPosition++;
    const t = tracks[currentIndex];
    if (currentPosition>=t.duration){ next(); return; }
    updatePlayer();
  },1000);
}

function pause(){
  isPlaying=false;
  document.getElementById('play').textContent = '►';
  clearInterval(progressInterval);
}

function togglePlay(){
  if (isPlaying) pause(); else play();
}

function next(){
  currentIndex = (currentIndex+1)%tracks.length;
  currentPosition = 0; updatePlayer(); if (isPlaying) play();
}

function prev(){
  currentIndex = (currentIndex-1+tracks.length)%tracks.length;
  currentPosition = 0; updatePlayer(); if (isPlaying) play();
}

document.getElementById('play').addEventListener('click',togglePlay);
document.getElementById('next').addEventListener('click',next);
document.getElementById('prev').addEventListener('click',prev);

document.getElementById('progress').addEventListener('input',(e)=>{
  currentPosition = Number(e.target.value);
  updatePlayer();
});

document.getElementById('volume').addEventListener('input',(e)=>{
  // volume is not connected to real audio here; placeholder
  document.documentElement.style.setProperty('--accent', `hsl(${Math.round(e.target.value*120)} 60% 45%)`);
});

renderGrid(); renderPlaylists(); updatePlayer();
