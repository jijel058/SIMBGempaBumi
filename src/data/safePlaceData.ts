import { SafePlaceRoom } from '../types/games';

export const SAFE_PLACE_ROOMS: SafePlaceRoom[] = [
  {
    id: 'room-living',
    title: 'Ruang Tamu & Keluarga (Living Room)',
    description: 'Temukan tempat teraman untuk berlindung dan kenali perabot berbahaya yang harus dijauhi saat gempa!',
    imageTheme: 'living-room',
    hotspots: [
      {
        id: 'spot-table',
        name: 'Kolong Meja Kayu Tebal Kokoh',
        x: 48,
        y: 68,
        isSafe: true,
        reason: 'TEMPAT TERBAIK! Meja kokoh menahan reruntuhan plafon dan pecahan genteng. Segera lakukan Drop, Cover, and Hold On di sini.',
        scoreImpact: 35
      },
      {
        id: 'spot-window',
        name: 'Dekat Jendela Kaca Besar',
        x: 82,
        y: 35,
        isSafe: false,
        reason: 'SANGAT BERBAHAYA! Tekanan getaran gempa membuat kaca pecah berkeping-keping dan dapat melukai tubuh secara fatal.',
        scoreImpact: -25
      },
      {
        id: 'spot-chandelier',
        name: 'Tepat di Bawah Lampu Gantung Kristal',
        x: 50,
        y: 20,
        isSafe: false,
        reason: 'SANGAT BERBAHAYA! Lampu gantung dan plafon dekoratif rawan putus dan jatuh menimpa kepala Anda.',
        scoreImpact: -30
      },
      {
        id: 'spot-bookshelf',
        name: 'Di Samping Rak Buku Tinggi Tanpa Baut Dinding',
        x: 18,
        y: 42,
        isSafe: false,
        reason: 'BERBAHAYA! Lemari buku tinggi akan roboh ke depan saat guncangan lateral kuat terjadi.',
        scoreImpact: -25
      },
      {
        id: 'spot-inner-corner',
        name: 'Sudut Dinding Struktural Bagian Dalam',
        x: 24,
        y: 65,
        isSafe: true,
        reason: 'AMAN! Jika meja kokoh tidak ada, merunduk di sudut dinding bagian dalam (jauh dari kaca) adalah alternatif pertahanan.',
        scoreImpact: 25
      }
    ]
  },
  {
    id: 'room-classroom',
    title: 'Ruang Kelas / Kampus (Classroom)',
    description: 'Identifikasi posisi perlindungan ketika gempa terjadi saat jam perkuliahan atau pelajaran berlangsung.',
    imageTheme: 'classroom',
    hotspots: [
      {
        id: 'spot-class-desk',
        name: 'Kolong Meja Belajar Siswa',
        x: 45,
        y: 72,
        isSafe: true,
        reason: 'AMAN & TEPAT! Segera merunduk di bawah meja belajar, lindungi kepala dengan tas atau tangan, lalu pegang kaki meja.',
        scoreImpact: 35
      },
      {
        id: 'spot-projector',
        name: 'Bawah Proyektor Gantung Langit-langit',
        x: 52,
        y: 26,
        isSafe: false,
        reason: 'BERBAHAYA! Braket proyektor sering kali lepas dari baut gypsum saat diguncang gelombang seismik.',
        scoreImpact: -25
      },
      {
        id: 'spot-doorway-rush',
        name: 'Berdesakan Berebut Pintu Keluar',
        x: 88,
        y: 58,
        isSafe: false,
        reason: 'BERBAHAYA! Berdesakan di pintu keluar saat gempa masih berlangsung berisiko tinggi terinjak-injak (stampede) dan tertimpa puing kusen.',
        scoreImpact: -30
      },
      {
        id: 'spot-pillar',
        name: 'Sisi Kolom Beton Bertulang Utama',
        x: 16,
        y: 55,
        isSafe: true,
        reason: 'AMAN! Kolom beton utama merupakan elemen struktural terkuat dalam menahan beban vertikal gedung.',
        scoreImpact: 25
      }
    ]
  }
];

