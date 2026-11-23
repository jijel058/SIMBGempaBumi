<?php
/**
 * REST API KONEKSI DATABASE MYSQL XAMPP -> SEISMORA REACT APP
 * Lokasi di Proyek: database/api_gempa.php
 * Lokasi di XAMPP : C:\xampp\htdocs\seismora\api_gempa.php
 */

// Matikan exception otomatis mysqli pada PHP 8.1+ (XAMPP terbaru) agar tidak muncul Fatal Error
mysqli_report(MYSQLI_REPORT_OFF);
error_reporting(0);

if (php_sapi_name() !== 'cli') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json; charset=UTF-8");

    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

$host = "127.0.0.1";
$user = "root";
$pass = "";
$dbname = "seismora_db";
$port = 3306;

// 1. Koneksi ke server MySQL XAMPP
$conn = @new mysqli($host, $user, $pass, "", $port);

if ($conn->connect_errno) {
    // Jika MySQL XAMPP belum dinyalakan, kembalikan JSON valid (HTTP 200) agar frontend tidak error
    echo json_encode([
        "status" => "offline",
        "message" => "MySQL XAMPP belum aktif. Menggunakan data lokal.",
        "count" => 0,
        "earthquakes" => []
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$conn->set_charset("utf8mb4");

// 2. Pastikan database `seismora_db` dan tabel `gempa_indonesia` sudah ada (Auto-Import jika belum)
$conn->query("CREATE DATABASE IF NOT EXISTS `$dbname` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
$conn->select_db($dbname);

$checkTable = $conn->query("SHOW TABLES LIKE 'gempa_indonesia'");
if (!$checkTable || $checkTable->num_rows === 0) {
    $sqlFile = __DIR__ . DIRECTORY_SEPARATOR . "seismora_db.sql";
    if (file_exists($sqlFile)) {
        $sqlContent = file_get_contents($sqlFile);
        if ($sqlContent) {
            $conn->multi_query($sqlContent);
            while ($conn->more_results() && $conn->next_result()) {
                // Bersihkan buffer multi_query
            }
        }
    }
}

// 3. Ambil seluruh data gempa Indonesia dari tabel `gempa_indonesia`
$sql = "SELECT * FROM gempa_indonesia ORDER BY hours_ago ASC";
$result = $conn->query($sql);

$data = [];
$nowMs = round(microtime(true) * 1000);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $hoursAgo = (int)$row['hours_ago'];
        $eventTimeMs = $nowMs - ($hoursAgo * 3600 * 1000);

        $data[] = [
            "id" => $row['id'],
            "externalId" => $row['external_id'],
            "source" => $row['source'],
            "magnitude" => (float)$row['magnitude'],
            "location" => $row['location'] . " (" . $row['tanggal_kejadian'] . ")",
            "latitude" => (float)$row['latitude'],
            "longitude" => (float)$row['longitude'],
            "depth" => (int)$row['depth'],
            "time" => $eventTimeMs,
            "tsunami" => ((int)$row['tsunami']) === 1,
            "status" => $row['status'],
            "alert" => $row['alert'],
            "felt" => (int)$row['felt'],
            "dirasakan" => $row['dirasakan'],
            "url" => $row['url']
        ];
    }
}

$conn->close();

echo json_encode([
    "status" => "success",
    "source" => "MySQL XAMPP (seismora_db.gempa_indonesia)",
    "count" => count($data),
    "earthquakes" => $data
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
