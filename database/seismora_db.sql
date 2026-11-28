-- ============================================================================
-- DATABASE MYSQL XAMPP: EPICORA (DATA GEMPA BUMI INDONESIA & ADMIN AUTH)
-- Database: seismora_db
-- Tabel 1 : gempa_indonesia (Data gempa bumi Indonesia)
-- Tabel 2 : admins (Akun administrator dengan password hash bcrypt)
-- Tabel 3 : admin_sessions (Session login & token CSRF admin)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `seismora_db`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `seismora_db`;

-- 1. Tabel Data Gempa Bumi Indonesia (Tanpa DROP TABLE agar data tidak terhapus)
CREATE TABLE IF NOT EXISTS `gempa_indonesia` (
  `id` VARCHAR(64) NOT NULL,
  `external_id` VARCHAR(64) NOT NULL,
  `source` VARCHAR(16) NOT NULL DEFAULT 'BMKG',
  `magnitude` DECIMAL(3,1) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `latitude` DECIMAL(8,4) NOT NULL,
  `longitude` DECIMAL(8,4) NOT NULL,
  `depth` INT NOT NULL COMMENT 'Kedalaman dalam km',
  `hours_ago` INT NOT NULL DEFAULT 1 COMMENT 'Offset jam relatif untuk filter rentang waktu',
  `tanggal_kejadian` VARCHAR(64) NOT NULL,
  `tsunami` TINYINT(1) NOT NULL DEFAULT 0,
  `status` VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED',
  `alert` VARCHAR(16) NOT NULL DEFAULT 'yellow',
  `felt` INT DEFAULT 500,
  `dirasakan` VARCHAR(255) DEFAULT NULL,
  `url` VARCHAR(255) DEFAULT 'https://data.bmkg.go.id/gempabumi/',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabel Akun Admin (Password disimpan dalam bentuk Bcrypt Hash)
-- Default Login:
-- Username : admin
-- Email    : admin@epicora.id
-- Password : admin123
CREATE TABLE IF NOT EXISTS `admins` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabel Session & CSRF Token Admin
CREATE TABLE IF NOT EXISTS `admin_sessions` (
  `session_token` VARCHAR(128) NOT NULL,
  `admin_id` INT NOT NULL,
  `csrf_token` VARCHAR(128) NOT NULL,
  `expires_at` BIGINT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`session_token`),
  KEY `idx_admin_sessions_admin_id` (`admin_id`),
  CONSTRAINT `fk_admin_sessions_admin` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Akun Admin Default (INSERT IGNORE agar tidak menimpa data yang sudah ada)
INSERT IGNORE INTO `admins` (`id`, `username`, `email`, `password_hash`, `full_name`, `role`) VALUES
(1, 'admin', 'admin@epicora.id', '$2y$10$ngnQN8Y1YsInnlNVNUBSsuRe8yv07o74HYBJwyFz1QUCzcqMjGVYO', 'Administrator EPICORA', 'Super Admin');

-- Seed Data Awal Gempa Bumi Indonesia (INSERT IGNORE agar tidak mereset data yang sudah diedit/ditambah)
INSERT IGNORE INTO `gempa_indonesia` (
  `id`, `external_id`, `source`, `magnitude`, `location`,
  `latitude`, `longitude`, `depth`, `hours_ago`, `tanggal_kejadian`,
  `tsunami`, `status`, `alert`, `felt`, `dirasakan`, `url`
) VALUES
('bmkg-db-01', 'BMKG-ID-20221121-CIANJUR', 'BMKG', 5.6, '10 km BaratDaya KAB-CIANJUR-JABAR (Sesar Cugenang)', -6.8400, 107.0500, 10, 1, '21 Nov 2022', 0, 'CONFIRMED', 'orange', 4200, 'V-VI Cianjur, IV-V Garut, IV Sukabumi, III Cimahi, III Bogor, II-III Jakarta', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-02', 'BMKG-ID-20240322-BAWEAN', 'BMKG', 6.5, '130 km TimurLaut TUBAN-JATIM (Laut Jawa - Pulau Bawean)', -5.7600, 112.3300, 10, 2, '22 Mar 2024', 0, 'CONFIRMED', 'orange', 3500, 'V-VI Bawean, IV-V Tuban, IV Surabaya, III-IV Gresik, III Semarang', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-03', 'BMKG-ID-20240427-GARUT', 'BMKG', 6.2, '151 km BaratDaya KAB-GARUT-JABAR', -8.4200, 107.2600, 70, 4, '27 Apr 2024', 0, 'CONFIRMED', 'orange', 2890, 'IV Garut, IV Sukabumi, III-IV Bandung, III Tasikmalaya, III Tangerang', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-04', 'BMKG-ID-20240101-SUMEDANG', 'BMKG', 4.8, '2 km TimurLaut KAB-SUMEDANG-JABAR', -6.8500, 107.9400, 5, 6, '01 Jan 2024', 0, 'CONFIRMED', 'yellow', 1450, 'IV Sumedang, III Bandung, II-III Subang', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-05', 'BMKG-ID-20230630-BANTUL', 'BMKG', 6.0, '86 km BaratDaya BANTUL-DIY', -8.6300, 110.0800, 25, 9, '30 Jun 2023', 0, 'CONFIRMED', 'orange', 3100, 'IV Kulonprogo, IV Bantul, III-IV Yogyakarta, III Gunungkidul, III Solo', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-06', 'BMKG-ID-20261104-BAYAH', 'BMKG', 5.6, '84 km BaratDaya BAYAH-BANTEN', -7.6200, 106.1200, 18, 12, '14 Mar 2023', 0, 'CONFIRMED', 'yellow', 1650, 'IV Pelabuhan Ratu, III Bayah, III Sukabumi, II-III Jakarta, II Depok', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-07', 'BMKG-ID-20230209-JAYAPURA', 'BMKG', 5.4, '9 km BaratDaya KOTA-JAYAPURA-PAPUA', -2.6000, 140.6600, 10, 15, '09 Feb 2023', 0, 'CONFIRMED', 'yellow', 1980, 'V Kota Jayapura, III-IV Kabupaten Jayapura, III Keerom', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-08', 'BMKG-ID-20240918-BANDUNG', 'BMKG', 5.0, '24 km Tenggara KAB-BANDUNG-JABAR (Kertasari - Sesar Garsela)', -7.1900, 107.6700, 10, 18, '18 Sep 2024', 0, 'CONFIRMED', 'yellow', 2100, 'IV-V Kertasari, IV Majalaya, III-IV Garut, III Banjaran, II-III Kota Bandung', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-09', 'BMKG-ID-20240707-BATANG', 'BMKG', 4.4, '5 km TimurLaut BATANG-JATENG', -6.8700, 109.7500, 6, 21, '07 Jul 2024', 0, 'CONFIRMED', 'yellow', 1200, 'IV Batang, III-IV Pekalongan, II Kendal', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-10', 'BMKG-ID-20220225-PASAMAN', 'BMKG', 6.2, '17 km TimurLaut PASAMANBARAT-SUMBAR (Sesar Talamau)', 0.1500, 99.9800, 10, 36, '25 Feb 2022', 0, 'CONFIRMED', 'orange', 3400, 'V-VI Pasaman Barat, V Pasaman, IV Agam, III-IV Bukittinggi, III Padang', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-11', 'BMKG-ID-20210115-MAJENE', 'BMKG', 6.2, '6 km TimurLaut MAJENE-SULBAR', -2.9800, 118.9400, 10, 52, '15 Jan 2021', 0, 'CONFIRMED', 'orange', 2950, 'V-VI Majene, V Mamuju, IV Polewali Mandar, III Parepare, II Makassar', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-12', 'BMKG-ID-20210410-MALANG', 'BMKG', 6.1, '96 km Selatan KEPANJEN-MALANG-JATIM', -8.8300, 112.5000, 80, 74, '10 Apr 2021', 0, 'CONFIRMED', 'orange', 3800, 'V Malang, IV-V Lumajang, IV Blitar, III-IV Kediri, III Surabaya, III Yogyakarta', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-13', 'BMKG-ID-20230425-MENTAWAI', 'BMKG', 7.3, '177 km BaratLaut KEP-MENTAWAI-SUMBAR', -0.9300, 98.3900, 84, 96, '25 Apr 2023', 1, 'CONFIRMED', 'red', 2700, 'VI Siberut Mentawai, V Pasaman Barat, V Padang Pariaman, IV-V Padang', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-14', 'BMKG-ID-20221213-KARANGASEM', 'BMKG', 5.2, '23 km TimurLaut KARANGASEM-BALI', -8.2900, 115.6200, 10, 115, '13 Des 2022', 0, 'CONFIRMED', 'yellow', 1750, 'IV Karangasem, III-IV Denpasar, III Mataram, III Lombok Barat', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-15', 'BMKG-ID-20230829-TANAHBUMBU', 'BMKG', 7.1, '180 km Tenggara TANAHBUMBU-KALSEL (Laut Jawa)', -6.9400, 116.5700, 525, 134, '29 Agu 2023', 0, 'CONFIRMED', 'orange', 2400, 'IV Kuta, IV Gianyar, IV Denpasar, III-IV Mataram, III Lombok Tengah, III Makassar', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-16', 'BMKG-ID-20231001-SUKABUMI', 'BMKG', 5.4, '30 km Tenggara KAB-SUKABUMI-JABAR', -7.2600, 106.6000, 88, 150, '01 Okt 2023', 0, 'CONFIRMED', 'yellow', 1520, 'IV Sukabumi, III Cianjur, III Sawarna, III Garut, II-III Bandung', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-17', 'BMKG-ID-20231102-KUPANG', 'BMKG', 6.3, '15 km Tenggara KUPANG-NTT', -10.2600, 123.7200, 10, 162, '02 Nov 2023', 0, 'CONFIRMED', 'orange', 1840, 'V-VI Kupang, IV-V Kabupaten Timor Tengah Selatan, III Rote Ndao', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-18', 'BMKG-ID-20180928-PALU', 'BMKG', 7.4, '26 km Utara DONGGALA-SULTENG (Sesar Palu-Koro)', -0.1800, 119.8500, 10, 210, '28 Sep 2018', 1, 'CONFIRMED', 'red', 9500, 'VII-VIII Palu, VII Donggala, VI-VII Sigi, V Parigi Moutong, IV Poso', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-19', 'BMKG-ID-20180805-LOMBOK', 'BMKG', 7.0, '18 km BaratLaut LOMBOKTIMUR-NTB (Flores Back-Arc Thrust)', -8.3500, 116.4700, 15, 260, '05 Agu 2018', 1, 'CONFIRMED', 'red', 8200, 'VII Lombok Utara, VI-VII Lombok Timur, VI Mataram, V Denpasar, IV Sumbawa', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-20', 'BMKG-ID-20060527-YOGYAKARTA', 'BMKG', 6.3, '25 km Selatan YOGYAKARTA-DIY (Sesar Opak - Bantul)', -8.0300, 110.3200, 12, 320, '27 Mei 2006', 0, 'CONFIRMED', 'red', 12000, 'VII-VIII Bantul, VII Yogyakarta, VI-VII Klaten, V Sleman, V Gunungkidul', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-21', 'BMKG-ID-20090930-PADANG', 'BMKG', 7.6, '57 km BaratLaut PARIAMAN-SUMBAR', -0.8400, 99.6500, 71, 380, '30 Sep 2009', 0, 'CONFIRMED', 'red', 8900, 'VII-VIII Padang, VII Pariaman, VI Padang Panjang, V Bukittinggi, IV Pekanbaru', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-22', 'BMKG-ID-20161207-PIDIEJAYA', 'BMKG', 6.5, '18 km TimurLaut PIDIEJAYA-ACEH', 5.2500, 96.2400, 15, 440, '07 Des 2016', 0, 'CONFIRMED', 'red', 5400, 'VII Pidie Jaya, VI Bireuen, V Banda Aceh, IV Lhokseumawe', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-23', 'BMKG-ID-20041226-ACEH', 'BMKG', 9.1, '160 km Barat ACEH-SAMUDRA HINDIA (Megathrust Sumatra-Andaman)', 3.3160, 95.8540, 30, 520, '26 Des 2004', 1, 'CONFIRMED', 'red', 25000, 'IX Banda Aceh, VIII-IX Meulaboh, VIII Simeulue, VII Nias, VI Medan', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-24', 'BMKG-ID-20190926-AMBON', 'BMKG', 6.5, '40 km TimurLaut AMBON-MALUKU (Sesar Kairatu)', -3.3800, 128.4300, 10, 580, '26 Sep 2019', 0, 'CONFIRMED', 'orange', 4100, 'VI Ambon, VI Kairatu, V Haruku, IV Saparua', 'https://data.bmkg.go.id/gempabumi/'),
('bmkg-db-25', 'BMKG-ID-20230109-MALUKUTENGGARA', 'BMKG', 7.5, '136 km BaratLaut MALUKUTENGGARABRT (Laut Banda)', -7.2500, 130.1800, 130, 640, '09 Jan 2023', 1, 'CONFIRMED', 'red', 3300, 'V Saumlaki, IV-V Dobo, IV Tiakur, III-IV Tual, III Kupang', 'https://data.bmkg.go.id/gempabumi/');
