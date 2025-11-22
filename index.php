<?php
// Simple demo API for AWebServer — stores users in users.json
// Endpoints:
// POST   /users            -> create user (body JSON: { username, hash, display, avatar, playlists })
// POST   /login            -> login (body JSON: { username, hash }) returns user on success
// GET    /users/{username} -> get user object
// PUT    /users/{username} -> update user object (body JSON)

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // preflight
    http_response_code(200);
    echo json_encode(["ok" => true]);
    exit;
}

$scriptBase = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
$uri = $_SERVER['REQUEST_URI'];
$path = substr($uri, strlen($scriptBase));
$path = trim($path, '/');
$method = $_SERVER['REQUEST_METHOD'];

$storage = __DIR__ . '/users.json';
$users = [];
if (file_exists($storage)){
    $txt = file_get_contents($storage);
    $data = json_decode($txt, true);
    if (is_array($data)) $users = $data;
}

function save_users($users, $storage){
    file_put_contents($storage, json_encode($users, JSON_PRETTY_PRINT));
}

function json_input(){
    $txt = file_get_contents('php://input');
    $d = json_decode($txt, true);
    return is_array($d) ? $d : [];
}

// Route: POST /users
if ($method === 'POST' && $path === 'users'){
    $d = json_input();
    if (empty($d['username']) || empty($d['hash'])){
        http_response_code(400);
        echo json_encode(["error"=>"username and hash required"]);
        exit;
    }
    $u = $d['username'];
    if (isset($users[$u])){
        http_response_code(409);
        echo json_encode(["error"=>"user exists"]);
        exit;
    }
    // store minimal fields
    $users[$u] = [
        'hash' => $d['hash'],
        'display' => isset($d['display']) ? $d['display'] : $u,
        'avatar' => isset($d['avatar']) ? $d['avatar'] : null,
        'playlists' => isset($d['playlists']) ? $d['playlists'] : []
    ];
    save_users($users, $storage);
    http_response_code(201);
    echo json_encode([ 'username' => $u, 'display' => $users[$u]['display'], 'avatar' => $users[$u]['avatar'], 'playlists' => $users[$u]['playlists'], 'hash' => $users[$u]['hash'] ]);
    exit;
}

// Route: POST /login
if ($method === 'POST' && $path === 'login'){
    $d = json_input();
    if (empty($d['username']) || empty($d['hash'])){
        http_response_code(400);
        echo json_encode(["error"=>"username and hash required"]);
        exit;
    }
    $u = $d['username'];
    if (!isset($users[$u])){ http_response_code(404); echo json_encode(["error"=>"no such user"]); exit; }
    if ($users[$u]['hash'] !== $d['hash']){ http_response_code(403); echo json_encode(["error"=>"incorrect password"]); exit; }
    echo json_encode(array_merge(['username'=>$u], $users[$u]));
    exit;
}

// GET /users/{username}
if ($method === 'GET' && preg_match('#^users/([^/]+)$#', $path, $m)){
    $u = urldecode($m[1]);
    if (!isset($users[$u])){ http_response_code(404); echo json_encode(["error"=>"no such user"]); exit; }
    echo json_encode(array_merge(['username'=>$u], $users[$u]));
    exit;
}

// PUT /users/{username}
if ($method === 'PUT' && preg_match('#^users/([^/]+)$#', $path, $m)){
    $u = urldecode($m[1]);
    $d = json_input();
    if (!isset($users[$u])){ http_response_code(404); echo json_encode(["error"=>"no such user"]); exit; }
    // replace allowed fields
    foreach (['hash','display','avatar','playlists'] as $k) if (isset($d[$k])) $users[$u][$k] = $d[$k];
    save_users($users, $storage);
    echo json_encode(array_merge(['username'=>$u], $users[$u]));
    exit;
}

// default: not found
http_response_code(404);
echo json_encode(["error"=>"not found","path"=>$path]);

?>
