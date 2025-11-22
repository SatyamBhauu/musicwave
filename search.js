// search.js — client-side search and discover UI for Music Wve
// Depends on `tracks` and `setCurrent` from app.js (app.js must be included first)

const searchInput = document.getElementById('search-input');
const resultsEl = document.getElementById('results');
const discoverEl = document.getElementById('discover');

function renderCards(container, list){
  container.innerHTML = '';
  if (!list || list.length === 0){
    container.innerHTML = `<div style="color:var(--muted);padding:8px">No results</div>`;
    return;
  }
  list.forEach((t, idx)=>{
    const card = document.createElement('div');
    card.className='card';
    const art = document.createElement('div'); art.className='art'; art.style.background = `linear-gradient(135deg, ${t.color}, #222)`;
    const meta = document.createElement('div'); meta.className='meta';
    const title = document.createElement('div'); title.className='title'; title.textContent = t.title;
    const sub = document.createElement('div'); sub.className='subtitle'; sub.textContent = t.artist;
    meta.appendChild(title); meta.appendChild(sub);
    card.appendChild(art); card.appendChild(meta);
    card.onclick = ()=>{
      // find index in global tracks and play
      const i = tracks.findIndex(x=>x.id===t.id);
      if (typeof setCurrent === 'function') setCurrent(i);
      else alert('Playback not available on this page (app.js not loaded).');
    };
    container.appendChild(card);
  });
}

function doSearch(q){
  q = (q||'').trim().toLowerCase();
  if (!q) {
    resultsEl.innerHTML = '<div style="color:var(--muted);padding:8px">Type to search songs or artists</div>';
    return;
  }
  const out = tracks.filter(t=> t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q));
  renderCards(resultsEl, out);
}

function renderDiscover(){
  // show a few curated/discover cards (slice of mock tracks)
  const sample = [];
  // interleave to look varied
  for (let i=0;i<8;i++) sample.push(tracks[(i*3)%tracks.length]);
  renderCards(discoverEl, sample);
}

searchInput.addEventListener('input',(e)=>doSearch(e.target.value));
searchInput.addEventListener('keydown',(e)=>{
  if (e.key === 'Enter') doSearch(e.target.value);
});

// initial render
renderDiscover();
resultsEl.innerHTML = '<div style="color:var(--muted);padding:8px">Type to search songs or artists</div>';
