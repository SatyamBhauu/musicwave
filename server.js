// Minimal Express server to list /uploads and serve files with proper range headers
const express = require('express');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

// Adjust this path if you place files elsewhere in Termux
const UPLOADS = path.join(process.env.HOME, 'storage/shared/MusicWave/mysqladmin/uploads');
const app = express();
const PORT = process.env.PORT || 3000;

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// list tracks
app.get('/tracks', (req,res) => {
  fs.readdir(UPLOADS, (err, files) => {
    if (err) return res.json({tracks: []});
    const allowedExt = ['.mp3','.m4a','.wav','.ogg','.flac'];
    const out = files.filter(f => allowedExt.includes(path.extname(f).toLowerCase())).map(f => {
      const p = path.join(UPLOADS,f);
      let stat;
      try { stat = fs.statSync(p); } catch(e) { return null; }
      let title = f.replace(/\.[^.]+$/,'');
      let artist = '';
      if (title.indexOf(' - ') !== -1) { const parts = title.split(' - '); artist = parts[0]; title = parts.slice(1).join(' - '); }
      return {
        filename: f,
        title,
        artist,
        url: `/uploads/${encodeURIComponent(f)}`,
        size: stat.size,
        modified: stat.mtimeMs
      };
    }).filter(Boolean);
    res.json({tracks: out});
  });
});

// serve files with range support
app.get('/uploads/:file', (req,res) => {
  const fileName = req.params.file;
  const filePath = path.join(UPLOADS, fileName);
  if (!fs.existsSync(filePath)) return res.sendStatus(404);
  const stat = fs.statSync(filePath);
  const total = stat.size;
  const range = req.headers.range;
  const contentType = mime.lookup(filePath) || 'application/octet-stream';
  if (range) {
    const parts = range.replace(/bytes=/,'').split('-');
    const start = parseInt(parts[0],10);
    const end = parts[1] ? parseInt(parts[1],10) : total - 1;
    if (start >= total || end >= total) { res.status(416).set('Content-Range', `bytes */${total}`).end(); return; }
    res.status(206);
    res.set({
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': (end - start) + 1,
      'Content-Type': contentType
    });
    const stream = fs.createReadStream(filePath, {start, end});
    stream.pipe(res);
  } else {
    res.set({
      'Content-Length': total,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes'
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Serving uploads from ${UPLOADS}`);
});
