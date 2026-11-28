<?php
/**
 * REST API BACKEND EPICORA — MYSQL XAMPP (PUBLIC FEED + ADMIN AUTH & CRUD)
 * Lokasi di Proyek: database/api_gempa.php
 * Lokasi di XAMPP : C:\xampp\htdocs\seismora\api_gempa.php
 *
 * Fitur Keamanan:
 * - Password Admin di-hash menggunakan Bcrypt (password_hash / password_verify)
 * - Seluruh query SQL menggunakan Prepared Statements ($conn->prepare + bind_param)
 * - Autentikasi & Otorisasi Session berbasis database (admin_sessions) + PHP Session
 * - Proteksi CSRF Token (X-CSRF-Token) pada setiap operasi perubahan data (Create, Update, Delete)
 * - Validasi input menyeluruh di sisi backend
 */

mysqli_report(MYSQLI_REPORT_OFF);
error_reporting(0);

if (php_sapi_name() !== 'cli') {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token, X-Session-Token");
    header("Content-Type: application/json; charset=UTF-8");

    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

if (session_status() === PHP_SESSION_NONE && php_sapi_name() !== 'cli') {
    @session_start();
}

$host = "127.0.0.1";
$user = "root";
$pass = "";
$dbname = "seismora_db";
$port = 3306;

// Helper kirim response JSON
function sendJson($payload, $statusCode = 200) {
    if (php_sapi_name() !== 'cli') {
        http_response_code($statusCode);
    }
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// 1. Koneksi ke server MySQL XAMPP
$conn = @new mysqli($host, $user, $pass, "", $port);

if ($conn->connect_errno) {
    $action = isset($_GET['action']) ? $_GET['action'] : 'public';
    if ($action === 'public') {
        sendJson([
            "status" => "offline",
            "message" => "MySQL XAMPP belum aktif. Menggunakan data lokal.",
            "count" => 0,
            "earthquakes" => []
        ], 200);
    } else {
        sendJson([
            "status" => "error",
            "message" => "Gagal terhubung ke database MySQL XAMPP. Pastikan MySQL sudah di-Start di XAMPP Control Panel."
        ], 503);
    }
}

$conn->set_charset("utf8mb4");

// 2. Pastikan database & tabel sudah tersedia tanpa menghapus/mereset data yang sudah ada
$conn->query("CREATE DATABASE IF NOT EXISTS `$dbname` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
$conn->select_db($dbname);

$conn->query("CREATE TABLE IF NOT EXISTS `gempa_indonesia` (
  `id` VARCHAR(64) NOT NULL,
  `external_id` VARCHAR(64) NOT NULL,
  `source` VARCHAR(16) NOT NULL DEFAULT 'BMKG',
  `magnitude` DECIMAL(3,1) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `latitude` DECIMAL(8,4) NOT NULL,
  `longitude` DECIMAL(8,4) NOT NULL,
  `depth` INT NOT NULL,
  `hours_ago` INT NOT NULL DEFAULT 1,
  `tanggal_kejadian` VARCHAR(64) NOT NULL,
  `tsunami` TINYINT(1) NOT NULL DEFAULT 0,
  `status` VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED',
  `alert` VARCHAR(16) NOT NULL DEFAULT 'yellow',
  `felt` INT DEFAULT 500,
  `dirasakan` VARCHAR(255) DEFAULT NULL,
  `url` VARCHAR(255) DEFAULT 'https://data.bmkg.go.id/gempabumi/',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

$conn->query("CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(64) NOT NULL,
  `email` VARCHAR(128) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(128) NOT NULL,
  `role` VARCHAR(32) NOT NULL DEFAULT 'Super Admin',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_admin_username` (`username`),
  UNIQUE KEY `uniq_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

$conn->query("CREATE TABLE IF NOT EXISTS `admin_sessions` (
  `session_token` VARCHAR(128) NOT NULL,
  `admin_id` INT NOT NULL,
  `csrf_token` VARCHAR(128) NOT NULL,
  `expires_at` BIGINT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`session_token`),
  KEY `idx_admin_sessions_admin_id` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

// Pastikan akun admin default tersedia (INSERT IGNORE)
$defaultHash = '$2y$10$ngnQN8Y1YsInnlNVNUBSsuRe8yv07o74HYBJwyFz1QUCzcqMjGVYO'; // admin123
$seedAdminStmt = $conn->prepare("INSERT IGNORE INTO admins (id, username, email, password_hash, full_name, role) VALUES (1, 'admin', 'admin@epicora.id', ?, 'Administrator EPICORA', 'Super Admin')");
if ($seedAdminStmt) {
    $seedAdminStmt->bind_param("s", $defaultHash);
    $seedAdminStmt->execute();
    $seedAdminStmt->close();
}

// Jika tabel gempa_indonesia masih kosong sama sekali, jalankan seed awal dari seismora_db.sql
$countRes = $conn->query("SELECT COUNT(*) AS cnt FROM gempa_indonesia");
$rowCnt = $countRes ? (int)$countRes->fetch_assoc()['cnt'] : 0;
if ($rowCnt === 0) {
    $sqlFile = __DIR__ . DIRECTORY_SEPARATOR . "seismora_db.sql";
    if (file_exists($sqlFile)) {
        $sqlContent = file_get_contents($sqlFile);
        if ($sqlContent) {
            $conn->multi_query($sqlContent);
            while ($conn->more_results() && $conn->next_result()) {}
        }
    }
}

// Bersihkan session yang sudah expired
$nowSec = time();
$cleanStmt = $conn->prepare("DELETE FROM admin_sessions WHERE expires_at < ?");
if ($cleanStmt) {
    $cleanStmt->bind_param("i", $nowSec);
    $cleanStmt->execute();
    $cleanStmt->close();
}

// Helper membaca JSON body
function getJsonBody() {
    $raw = file_get_contents("php://input");
    if (!$raw) return [];
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

// Helper mengambil header HTTP
function getHeaderValue($name) {
    $serverKey = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
    if (isset($_SERVER[$serverKey])) {
        return trim($_SERVER[$serverKey]);
    }
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        foreach ($headers as $k => $v) {
            if (strcasecmp($k, $name) === 0) {
                return trim($v);
            }
        }
    }
    return '';
}

// Helper verifikasi session admin aktif
function verifyAdminSession($conn) {
    $token = getHeaderValue('X-Session-Token');
    if ($token === '' && isset($_SESSION['epicora_session_token'])) {
        $token = $_SESSION['epicora_session_token'];
    }
    if ($token === '') {
        return null;
    }

    $now = time();
    $stmt = $conn->prepare(
        "SELECT s.session_token, s.csrf_token, s.expires_at, a.id AS admin_id, a.username, a.email, a.full_name, a.role
         FROM admin_sessions s
         INNER JOIN admins a ON a.id = s.admin_id
         WHERE s.session_token = ? AND s.expires_at > ?
         LIMIT 1"
    );
    if (!$stmt) return null;
    $stmt->bind_param("si", $token, $now);
    $stmt->execute();
    $res = $stmt->get_result();
    $sessionRow = $res ? $res->fetch_assoc() : null;
    $stmt->close();

    return $sessionRow ?: null;
}

// Helper wajib login admin (+ verifikasi CSRF untuk aksi mutasi data)
function requireAdminAuth($conn, $requireCsrf = false) {
    $session = verifyAdminSession($conn);
    if (!$session) {
        sendJson([
            "status" => "error",
            "code" => "UNAUTHORIZED",
            "message" => "Akses ditolak. Sesi login admin tidak valid atau telah berakhir."
        ], 401);
    }

    if ($requireCsrf) {
        $csrfHeader = getHeaderValue('X-CSRF-Token');
        if ($csrfHeader === '' || !hash_equals($session['csrf_token'], $csrfHeader)) {
            sendJson([
                "status" => "error",
                "code" => "INVALID_CSRF",
                "message" => "Token keamanan CSRF tidak valid. Silakan muat ulang halaman."
            ], 403);
        }
    }

    return $session;
}

// Helper konversi baris DB menjadi format aplikasi publik & admin
function mapDbRowToRecord($row, $nowMs) {
    $hoursAgo = (int)$row['hours_ago'];
    $eventTimeMs = $nowMs - ($hoursAgo * 3600 * 1000);
    $rawLoc = $row['location'];
    $tanggal = $row['tanggal_kejadian'];
    $displayLoc = (strpos($rawLoc, $tanggal) !== false || $tanggal === '')
        ? $rawLoc
        : $rawLoc . " (" . $tanggal . ")";

    return [
        "id" => $row['id'],
        "externalId" => $row['external_id'],
        "source" => $row['source'],
        "magnitude" => (float)$row['magnitude'],
        "location" => $displayLoc,
        "rawLocation" => $rawLoc,
        "latitude" => (float)$row['latitude'],
        "longitude" => (float)$row['longitude'],
        "depth" => (int)$row['depth'],
        "hoursAgo" => $hoursAgo,
        "tanggalKejadian" => $tanggal,
        "time" => $eventTimeMs,
        "tsunami" => ((int)$row['tsunami']) === 1,
        "status" => $row['status'],
        "alert" => $row['alert'],
        "felt" => (int)$row['felt'],
        "dirasakan" => $row['dirasakan'] !== null ? $row['dirasakan'] : '',
        "url" => $row['url'] !== null ? $row['url'] : 'https://data.bmkg.go.id/gempabumi/'
    ];
}

// Helper validasi input data gempa di backend
function validateEarthquakeInput($input) {
    $errors = [];

    $location = isset($input['location']) ? trim((string)$input['location']) : '';
    if ($location === '' || strlen($location) < 3) {
        $errors[] = "Lokasi / wilayah gempa wajib diisi (minimal 3 karakter).";
    } elseif (strlen($location) > 255) {
        $errors[] = "Lokasi / wilayah gempa maksimal 255 karakter.";
    }

    $tanggal = isset($input['tanggalKejadian']) ? trim((string)$input['tanggalKejadian']) : '';
    if ($tanggal === '') {
        $errors[] = "Tanggal dan waktu kejadian wajib diisi.";
    } elseif (strlen($tanggal) > 64) {
        $errors[] = "Tanggal kejadian maksimal 64 karakter.";
    }

    if (!isset($input['magnitude']) || !is_numeric($input['magnitude'])) {
        $errors[] = "Magnitudo harus berupa angka.";
    } else {
        $mag = (float)$input['magnitude'];
        if ($mag < 0.1 || $mag > 10.0) {
            $errors[] = "Magnitudo harus berada di antara 0.1 hingga 10.0 SR.";
        }
    }

    if (!isset($input['depth']) || !is_numeric($input['depth'])) {
        $errors[] = "Kedalaman harus berupa angka (km).";
    } else {
        $depth = (int)$input['depth'];
        if ($depth < 1 || $depth > 1000) {
            $errors[] = "Kedalaman harus berada di antara 1 hingga 1000 km.";
        }
    }

    if (!isset($input['latitude']) || !is_numeric($input['latitude'])) {
        $errors[] = "Koordinat Latitude harus berupa angka.";
    } else {
        $lat = (float)$input['latitude'];
        if ($lat < -90.0 || $lat > 90.0) {
            $errors[] = "Latitude harus berada di antara -90.0 hingga 90.0.";
        }
    }

    if (!isset($input['longitude']) || !is_numeric($input['longitude'])) {
        $errors[] = "Koordinat Longitude harus berupa angka.";
    } else {
        $lon = (float)$input['longitude'];
        if ($lon < -180.0 || $lon > 180.0) {
            $errors[] = "Longitude harus berada di antara -180.0 hingga 180.0.";
        }
    }

    $hoursAgo = isset($input['hoursAgo']) && is_numeric($input['hoursAgo']) ? max(0, (int)$input['hoursAgo']) : 1;
    $source = isset($input['source']) && in_array($input['source'], ['BMKG', 'USGS'], true) ? $input['source'] : 'BMKG';
    $tsunami = !empty($input['tsunami']) ? 1 : 0;
    $status = isset($input['status']) && trim((string)$input['status']) !== '' ? substr(trim((string)$input['status']), 0, 32) : 'CONFIRMED';
    $felt = isset($input['felt']) && is_numeric($input['felt']) ? max(0, (int)$input['felt']) : 500;
    $dirasakan = isset($input['dirasakan']) ? substr(trim((string)$input['dirasakan']), 0, 255) : '';
    $url = isset($input['url']) && trim((string)$input['url']) !== '' ? substr(trim((string)$input['url']), 0, 255) : 'https://data.bmkg.go.id/gempabumi/';

    $magVal = isset($input['magnitude']) ? (float)$input['magnitude'] : 5.0;
    $defaultAlert = 'green';
    if ($magVal >= 7.0 || $tsunami === 1) $defaultAlert = 'red';
    elseif ($magVal >= 6.0) $defaultAlert = 'orange';
    elseif ($magVal >= 4.5) $defaultAlert = 'yellow';

    $alert = isset($input['alert']) && in_array($input['alert'], ['green', 'yellow', 'orange', 'red'], true)
        ? $input['alert']
        : $defaultAlert;

    return [
        "errors" => $errors,
        "sanitized" => [
            "source" => $source,
            "magnitude" => round($magVal, 1),
            "location" => $location,
            "latitude" => round((float)($input['latitude'] ?? 0), 4),
            "longitude" => round((float)($input['longitude'] ?? 0), 4),
            "depth" => (int)($input['depth'] ?? 10),
            "hours_ago" => $hoursAgo,
            "tanggal_kejadian" => $tanggal,
            "tsunami" => $tsunami,
            "status" => $status,
            "alert" => $alert,
            "felt" => $felt,
            "dirasakan" => $dirasakan,
            "url" => $url
        ]
    ];
}

$action = isset($_GET['action']) ? trim($_GET['action']) : 'public';

// ============================================================================
// ROUTE 1: POST ?action=login (Autentikasi Admin terhadap tabel `admins`)
// ============================================================================
if ($action === 'login') {
    $body = getJsonBody();
    $identifier = isset($body['identifier']) ? trim((string)$body['identifier']) : '';
    $password = isset($body['password']) ? (string)$body['password'] : '';

    if ($identifier === '' || $password === '') {
        sendJson([
            "status" => "error",
            "message" => "Username/email dan password wajib diisi."
        ], 400);
    }

    $stmt = $conn->prepare("SELECT id, username, email, password_hash, full_name, role FROM admins WHERE username = ? OR email = ? LIMIT 1");
    if (!$stmt) {
        sendJson(["status" => "error", "message" => "Kesalahan query server."], 500);
    }
    $stmt->bind_param("ss", $identifier, $identifier);
    $stmt->execute();
    $res = $stmt->get_result();
    $admin = $res ? $res->fetch_assoc() : null;
    $stmt->close();

    if (!$admin || !password_verify($password, $admin['password_hash'])) {
        sendJson([
            "status" => "error",
            "message" => "Username/email atau password salah. Silakan periksa kembali."
        ], 401);
    }

    // Buat session token & CSRF token aman
    $sessionToken = bin2hex(random_bytes(32));
    $csrfToken = bin2hex(random_bytes(32));
    $expiresAt = time() + (8 * 3600); // Berlaku 8 jam
    $adminId = (int)$admin['id'];

    $insStmt = $conn->prepare("INSERT INTO admin_sessions (session_token, admin_id, csrf_token, expires_at) VALUES (?, ?, ?, ?)");
    if (!$insStmt) {
        sendJson(["status" => "error", "message" => "Gagal membuat sesi login."], 500);
    }
    $insStmt->bind_param("sisi", $sessionToken, $adminId, $csrfToken, $expiresAt);
    $insStmt->execute();
    $insStmt->close();

    $_SESSION['epicora_session_token'] = $sessionToken;

    sendJson([
        "status" => "success",
        "message" => "Login berhasil. Selamat datang di Dashboard Admin EPICORA.",
        "sessionToken" => $sessionToken,
        "csrfToken" => $csrfToken,
        "expiresAt" => $expiresAt * 1000,
        "admin" => [
            "id" => $adminId,
            "username" => $admin['username'],
            "email" => $admin['email'],
            "fullName" => $admin['full_name'],
            "role" => $admin['role']
        ]
    ], 200);
}

// ============================================================================
// ROUTE 2: GET ?action=session (Validasi Session Admin Aktif)
// ============================================================================
if ($action === 'session') {
    $session = verifyAdminSession($conn);
    if (!$session) {
        sendJson([
            "status" => "unauthenticated",
            "message" => "Belum login."
        ], 401);
    }

    sendJson([
        "status" => "authenticated",
        "csrfToken" => $session['csrf_token'],
        "expiresAt" => ((int)$session['expires_at']) * 1000,
        "admin" => [
            "id" => (int)$session['admin_id'],
            "username" => $session['username'],
            "email" => $session['email'],
            "fullName" => $session['full_name'],
            "role" => $session['role']
        ]
    ], 200);
}

// ============================================================================
// ROUTE 3: POST ?action=logout (Akhiri Session Admin)
// ============================================================================
if ($action === 'logout') {
    $token = getHeaderValue('X-Session-Token');
    if ($token === '' && isset($_SESSION['epicora_session_token'])) {
        $token = $_SESSION['epicora_session_token'];
    }
    if ($token !== '') {
        $delStmt = $conn->prepare("DELETE FROM admin_sessions WHERE session_token = ?");
        if ($delStmt) {
            $delStmt->bind_param("s", $token);
            $delStmt->execute();
            $delStmt->close();
        }
    }
    $_SESSION = [];
    if (session_status() === PHP_SESSION_ACTIVE) {
        @session_destroy();
    }
    sendJson([
        "status" => "success",
        "message" => "Sesi admin telah diakhiri."
    ], 200);
}

// ============================================================================
// ROUTE 4: GET ?action=admin_list (Daftar Data Gempa & Statistik untuk Admin)
// ============================================================================
if ($action === 'admin_list') {
    requireAdminAuth($conn, false);

    $stmt = $conn->prepare("SELECT * FROM gempa_indonesia ORDER BY hours_ago ASC, id DESC");
    $stmt->execute();
    $result = $stmt->get_result();

    $records = [];
    $nowMs = round(microtime(true) * 1000);

    while ($row = $result->fetch_assoc()) {
        $records[] = mapDbRowToRecord($row, $nowMs);
    }
    $stmt->close();

    sendJson([
        "status" => "success",
        "count" => count($records),
        "records" => $records
    ], 200);
}

// ============================================================================
// ROUTE 5: POST ?action=create (Tambah Data Gempa Baru ke Database)
// ============================================================================
if ($action === 'create') {
    requireAdminAuth($conn, true);
    $body = getJsonBody();
    $validation = validateEarthquakeInput($body);

    if (count($validation['errors']) > 0) {
        sendJson([
            "status" => "error",
            "message" => implode(" ", $validation['errors']),
            "errors" => $validation['errors']
        ], 422);
    }

    $s = $validation['sanitized'];
    $id = isset($body['id']) && preg_match('/^[a-zA-Z0-9_-]{3,64}$/', trim((string)$body['id']))
        ? trim((string)$body['id'])
        : 'bmkg-db-' . time() . '-' . substr(bin2hex(random_bytes(2)), 0, 4);

    $externalId = isset($body['externalId']) && trim((string)$body['externalId']) !== ''
        ? substr(trim((string)$body['externalId']), 0, 64)
        : 'BMKG-ID-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));

    // Cek duplikasi ID
    $checkStmt = $conn->prepare("SELECT id FROM gempa_indonesia WHERE id = ? LIMIT 1");
    $checkStmt->bind_param("s", $id);
    $checkStmt->execute();
    $exists = $checkStmt->get_result()->num_rows > 0;
    $checkStmt->close();

    if ($exists) {
        sendJson([
            "status" => "error",
            "message" => "ID gempa '$id' sudah digunakan di database. Gunakan ID lain."
        ], 409);
    }

    $stmt = $conn->prepare(
        "INSERT INTO gempa_indonesia
         (id, external_id, source, magnitude, location, latitude, longitude, depth, hours_ago, tanggal_kejadian, tsunami, status, alert, felt, dirasakan, url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    if (!$stmt) {
        sendJson(["status" => "error", "message" => "Gagal menyiapkan query tambah data."], 500);
    }

    $stmt->bind_param(
        "sssdsddiisississ",
        $id,
        $externalId,
        $s['source'],
        $s['magnitude'],
        $s['location'],
        $s['latitude'],
        $s['longitude'],
        $s['depth'],
        $s['hours_ago'],
        $s['tanggal_kejadian'],
        $s['tsunami'],
        $s['status'],
        $s['alert'],
        $s['felt'],
        $s['dirasakan'],
        $s['url']
    );

    if (!$stmt->execute()) {
        $err = $stmt->error;
        $stmt->close();
        sendJson(["status" => "error", "message" => "Gagal menyimpan ke database: " . $err], 500);
    }
    $stmt->close();

    $nowMs = round(microtime(true) * 1000);
    $newRecord = mapDbRowToRecord(array_merge($s, [
        "id" => $id,
        "external_id" => $externalId
    ]), $nowMs);

    sendJson([
        "status" => "success",
        "message" => "Data gempa baru berhasil ditambahkan ke database MySQL.",
        "record" => $newRecord
    ], 201);
}

// ============================================================================
// ROUTE 6: POST ?action=update (Edit / Perbarui Data Gempa di Database)
// ============================================================================
if ($action === 'update') {
    requireAdminAuth($conn, true);
    $body = getJsonBody();
    $id = isset($body['id']) ? trim((string)$body['id']) : '';

    if ($id === '') {
        sendJson(["status" => "error", "message" => "ID gempa yang akan diedit tidak ditemukan."], 400);
    }

    $validation = validateEarthquakeInput($body);
    if (count($validation['errors']) > 0) {
        sendJson([
            "status" => "error",
            "message" => implode(" ", $validation['errors']),
            "errors" => $validation['errors']
        ], 422);
    }

    // Pastikan baris data ada
    $checkStmt = $conn->prepare("SELECT id, external_id FROM gempa_indonesia WHERE id = ? LIMIT 1");
    $checkStmt->bind_param("s", $id);
    $checkStmt->execute();
    $existing = $checkStmt->get_result()->fetch_assoc();
    $checkStmt->close();

    if (!$existing) {
        sendJson(["status" => "error", "message" => "Data gempa dengan ID '$id' tidak ditemukan di database."], 404);
    }

    $s = $validation['sanitized'];
    $externalId = isset($body['externalId']) && trim((string)$body['externalId']) !== ''
        ? substr(trim((string)$body['externalId']), 0, 64)
        : $existing['external_id'];

    $stmt = $conn->prepare(
        "UPDATE gempa_indonesia
         SET external_id = ?, source = ?, magnitude = ?, location = ?, latitude = ?, longitude = ?,
             depth = ?, hours_ago = ?, tanggal_kejadian = ?, tsunami = ?, status = ?, alert = ?,
             felt = ?, dirasakan = ?, url = ?
         WHERE id = ?"
    );
    if (!$stmt) {
        sendJson(["status" => "error", "message" => "Gagal menyiapkan query update."], 500);
    }

    $stmt->bind_param(
        "ssdsddiisississs",
        $externalId,
        $s['source'],
        $s['magnitude'],
        $s['location'],
        $s['latitude'],
        $s['longitude'],
        $s['depth'],
        $s['hours_ago'],
        $s['tanggal_kejadian'],
        $s['tsunami'],
        $s['status'],
        $s['alert'],
        $s['felt'],
        $s['dirasakan'],
        $s['url'],
        $id
    );

    if (!$stmt->execute()) {
        $err = $stmt->error;
        $stmt->close();
        sendJson(["status" => "error", "message" => "Gagal memperbarui data di database: " . $err], 500);
    }
    $stmt->close();

    $nowMs = round(microtime(true) * 1000);
    $updatedRecord = mapDbRowToRecord(array_merge($s, [
        "id" => $id,
        "external_id" => $externalId
    ]), $nowMs);

    sendJson([
        "status" => "success",
        "message" => "Data gempa '$id' berhasil diperbarui di database MySQL.",
        "record" => $updatedRecord
    ], 200);
}

// ============================================================================
// ROUTE 7: POST ?action=delete (Hapus Data Gempa dari Database)
// ============================================================================
if ($action === 'delete') {
    requireAdminAuth($conn, true);
    $body = getJsonBody();
    $id = isset($body['id']) ? trim((string)$body['id']) : '';

    if ($id === '') {
        sendJson(["status" => "error", "message" => "ID gempa yang akan dihapus wajib disertakan."], 400);
    }

    $stmt = $conn->prepare("DELETE FROM gempa_indonesia WHERE id = ?");
    if (!$stmt) {
        sendJson(["status" => "error", "message" => "Gagal menyiapkan query hapus data."], 500);
    }
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $affected = $stmt->affected_rows;
    $stmt->close();

    if ($affected <= 0) {
        sendJson(["status" => "error", "message" => "Data gempa dengan ID '$id' tidak ditemukan di database."], 404);
    }

    sendJson([
        "status" => "success",
        "message" => "Data gempa '$id' berhasil dihapus dari database MySQL.",
        "deletedId" => $id
    ], 200);
}

// ============================================================================
// ROUTE DEFAULT: GET ?action=public (Public Feed untuk Website Utama EPICORA)
// ============================================================================
$stmt = $conn->prepare("SELECT * FROM gempa_indonesia ORDER BY hours_ago ASC, id DESC");
$stmt->execute();
$result = $stmt->get_result();

$data = [];
$nowMs = round(microtime(true) * 1000);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = mapDbRowToRecord($row, $nowMs);
    }
}
$stmt->close();
$conn->close();

sendJson([
    "status" => "success",
    "source" => "MySQL XAMPP (seismora_db.gempa_indonesia)",
    "count" => count($data),
    "earthquakes" => $data
], 200);
