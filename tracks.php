<?php
// tracks.php - list audio files under mysqladmin/uploads/
// Returns JSON array of tracks with URL, filename, title, artist, size, and modified time.
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$uploaddir = __DIR__ . '/uploads/';
if (!is_dir($uploaddir)) {
  // return empty list
  echo json_encode(['tracks' => []]);
  exit;
}

$files = scandir($uploaddir);
$allowed = ['mp3','m4a','wav','ogg','flac'];
$out = [];
foreach ($files as $f) {
  if ($f === '.' || $f === '..') continue;
  $path = $uploaddir . $f;
  if (!is_file($path)) continue;
  $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
  if (!in_array($ext, $allowed)) continue;
  $size = filesize($path);
  $mtime = filemtime($path);
  $name = basename($f);
  // derive title/artist from filename if formatted as "Artist - Title.ext"
  $title = preg_replace('/\.[^.]+$/','', $name);
  $artist = '';
  if (strpos($title, ' - ') !== false) {
    list($artist, $title) = explode(' - ', $title, 2);
  }
  // build public URL to the uploads file
  $host = $_SERVER['HTTP_HOST'] ?? ($_SERVER['SERVER_NAME'] ?? '');
  $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
  $port = isset($_SERVER['SERVER_PORT']) ? intval($_SERVER['SERVER_PORT']) : 0;
  $baseUrl = $scheme . '://' . $host;
  if ($port && $port !== 80 && $port !== 443) $baseUrl .= ':' . $port;
  $scriptDir = dirname($_SERVER['SCRIPT_NAME']);
  $url = $baseUrl . $scriptDir . '/uploads/' . rawurlencode($f);
  $out[] = [
    'filename' => $name,
    'title' => $title,
    'artist' => $artist,
    'url' => $url,
    'size' => $size,
    'modified' => $mtime,
  ];
}

echo json_encode(['tracks' => $out]);
