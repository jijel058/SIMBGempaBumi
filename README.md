# SEISMORA — Immersive 3D Global Earthquake Experience & Monitoring

> **"Know the Earth. Understand the Risk. Be Prepared."**  
> *"Understand Earthquakes. Stay Prepared. Save Lives."*

SEISMORA telah didesain ulang menjadi **Immersive 3D Earthquake Experience & Monitoring Platform** — menghadirkan platform edukasi kebencanaan dan pemantauan gempa bumi global modern yang memadukan visualisasi bola bumi 3D fotorealistis (*Three.js*), latar belakang partikel atmosferik responsif (*Canvas WebGL*), sinkronisasi dua arah antara peta 2D dan globe 3D, serta permainan petualangan kesiapsiagaan gamifikasi.

---

## 🌍 1. Konsep Desain & Atmosfer Visual

- **Palet Warna Seismik**:
  - **Deep Emerald Green** (`#064e3b`, `#022c22`)
  - **Forest Green** (`#14532d`, `#166534`)
  - **Sage Green** (`#84a184`, `#a3b18a`)
  - **Mint Green** (`#34d399`, `#10b981`, `#6ee7b7`)
  - **Aksen Peringatan**: Oranye (`#f97316`) dan Merah (`#ef4444`) untuk magnitudo $M \ge 6.0$ atau potensi tsunami.
- **Background Interaktif & Responsif**:
  - Partikel debu kosmik dan bintang yang melayang lembut.
  - Gradien cahaya emerald dan aurora yang dinamis mengikuti pergerakan mouse/touch (*parallax spring physics*).
  - Garis koordinat lintang/bujur dekoratif dan *telemetry crosshairs*.
  - Gelombang seismik ripple yang menyebar saat layar diklik atau disentuh.
  - Ringan pada smartphone (jumlah partikel otomatis disesuaikan) dengan fallback CSS gradient bila WebGL tidak aktif.

---

## 🌐 2. Globe Bumi 3D Realistis (Three.js WebGL)

- **Fotorealistis**: Tekstur samudra biru alami, benua dengan gradasi vegetasi hijau dan gurun, relief pesisir, serta lapisan es kutub.
- **Lapisan Awan Dinamis (*Clouds Layer*)**: Lapisan awan semi-transparan berotasi mandiri mengelilingi permukaan bumi.
- **Atmosfer & Pencahayaan Luar Angkasa**: Efek *Fresnel atmospheric glow*, pencahayaan matahari langsung dengan refleksi spekular samudra, serta pencahayaan sisi gelap.
- **Titik Episentrum Nyata dari API**:
  - Diletakkan presisi berdasarkan koordinat lintang & bujur dari USGS dan BMKG.
  - Warna dan ukuran proporsional terhadap magnitudo gempa.
  - Animasi pulsa (*pulse waves*) gelombang seismik menyebar dari episentrum.
- **Kontrol Penuh**: Rotasi interaktif dengan inersia, zoom in/out mouse wheel & pinch, pause/play rotasi otomatis, dan mode potong irisan lapisan bumi (*Crust*, *Mantle*, *Outer Core*, *Inner Core*).
- **Animasi Kamera (*Fly-to*)**: Kamera berotasi mulus menuju koordinat gempa yang dipilih.

---

## 🗺️ 3. Integrasi Dua Arah: Peta 2D (Leaflet) & Globe 3D

Sinkronisasi langsung antara peta 2D dan globe 3D menggunakan dataset real-time yang sama:
- **"VIEW ON 3D GLOBE"** (pada popup marker peta 2D): Mengarahkan kamera globe 3D berputar dan fokus tepat ke koordinat gempa tersebut.
- **"VIEW ON MAP"** (pada kartu/tooltip globe 3D): Membuka peta 2D dan melakukan *smooth flyTo* ke titik episentrum yang sama.

---

## 🎮 4. Petualangan Game Edukasi (Disaster Gamification)

1. **Earthquake Survival Mission**: Misi petualangan dengan status *Health Points* (HP ❤️), keputusan darurat bercabang, dan konsekuensi langsung.
2. **Find the Safe Zone**: Eksplorasi visual ruangan untuk mengidentifikasi zona aman dari risiko runtuhan plafon/kaca.
3. **Emergency Bag Challenge**: Penyusunan Tas Siaga 72 jam dengan indikator beban maksimal 9 kg.
4. **Earthquake Quiz**: Uji wawasan geologi dan kegempaan bertingkat (Mudah, Sedang, Sulit) dengan timer dan pembahasan ilmiah.
5. **Plate Tectonic Puzzle**: Penyusunan lempeng litosfer pada zona subduksi dan sesar geser dunia.

---

## 📡 5. Sumber Data Resmi

- **USGS**: *Earthquake Hazards Program* (GeoJSON live feeds 24h, 7d, 30d).
- **BMKG**: *InaTEWS Open Data* (Autogempa, gempaterkini $M \ge 5.0$, dan gempadirasakan).
- *Fallback dataset* dan *caching localStorage* memastikan aplikasi tetap aktif dan informatif jika jaringan terganggu.

---

## 💻 6. Menjalankan Aplikasi

```bash
cd "d:\kuliah\semester 3\SIMB\projectAkhir"
npm run dev
```
Buka browser di: `http://localhost:5173`
