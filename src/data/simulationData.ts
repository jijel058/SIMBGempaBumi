import { SimulationScenario } from '../types/mitigation';

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: 'sim-home',
    title: 'Simulasi 1: Gempa di Dalam Rumah',
    subtitle: 'Kekuatan M 6.4, Kedalaman 12 km (Dangkal)',
    locationType: 'home',
    magnitude: 6.4,
    depthKm: 12,
    shakingDurationSec: 25,
    description: 'Anda sedang berada di ruang tengah rumah satu lantai ketika getaran tanah pertama terasa dengan suara gemuruh menyeramkan.',
    initialSituation: 'Piring dan gelas di dapur berdenting keras. Lampu gantung berayun tak beraturan. Plafon gypsum mulai meneteskan serbuk debu putih.',
    phases: [
      {
        phase: 'warning',
        prompt: 'Detik ke-3: Guncangan awal (Gelombang P) terasa selama 3 detik pertama sebelum gelombang S destruktif tiba. Tindakan pertama Anda?',
        options: [
          {
            text: 'Langsung berlari kencang menerobos pintu utama tanpa alas kaki',
            isBest: false,
            consequence: 'Guncangan gelombang S seketika membuat Anda kehilangan keseimbangan dan terjatuh di lantai, berisiko tertimpa genteng yang rontok di ambang pintu.',
            points: 10
          },
          {
            text: 'Segera merunduk dan mencari meja makan kayu jati kokoh terdekat',
            isBest: true,
            consequence: 'Tindakan sempurna! Anda berada di posisi stabil sebelum gelombang geser keras menghempas.',
            points: 35
          },
          {
            text: 'Berdiri di dekat lemari kaca untuk menahan piala dan barang koleksi agar tidak jatuh',
            isBest: false,
            consequence: 'Sangat berbahaya! Kaca lemari pecah dan barang berat menimpa tubuh Anda.',
            points: 0
          }
        ]
      },
      {
        phase: 'shaking',
        prompt: 'Detik ke-12: Guncangan mencapai puncak amplitudo terkuat. Meja mulai bergeser ke kiri dan kanan. Apa yang Anda lakukan?',
        options: [
          {
            text: 'Lakukan HOLD ON: Pegang erat kaki meja dengan kedua tangan dan lindungi kepala',
            isBest: true,
            consequence: 'Pilihan luar biasa! Anda bergerak bersama meja pelindung sehingga tidak terpental keluar.',
            points: 40
          },
          {
            text: 'Keluar dari kolong meja untuk merekam video guncangan menggunakan smartphone',
            isBest: false,
            consequence: 'Plafon dan lampu gantung runtuh melukai bahu Anda. Jangan memprioritaskan media sosial di atas nyawa!',
            points: -20
          },
          {
            text: 'Menutup mata dan berteriak sekeras-kerasnya sambil melepaskan pegangan meja',
            isBest: false,
            consequence: 'Meja bergeser menjauh dan Anda kehilangan perlindungan utama.',
            points: 5
          }
        ]
      },
      {
        phase: 'post_quake',
        prompt: 'Detik ke-30: Guncangan berhenti. Suasana hening berdebu. Dinding rumah retak miring dan Anda mencium bau khas gas elpiji. Langkah selanjutnya?',
        options: [
          {
            text: 'Nyalakan lilin atau korek api untuk melihat keadaan dapur yang gelap',
            isBest: false,
            consequence: 'FATAL! Percikan api dari korek menyulut gas elpiji yang bocor!',
            points: -50
          },
          {
            text: 'Gunakan sepatu/sandal sol tebal, lepas regulator gas, ambil Tas Siaga Bencana, lalu keluar ke halaman lapang',
            isBest: true,
            consequence: 'Protokol keselamatan sempurna! Kaki terlindung dari beling kaca dan potensi kebakaran tereliminasi.',
            points: 35
          },
          {
            text: 'Langsung kembali ke kamar tidur untuk merapikan kasur',
            isBest: false,
            consequence: 'Berisiko tertimpa runtuhan akibat gempa susulan (aftershock).',
            points: 0
          }
        ]
      }
    ]
  },
  {
    id: 'sim-highrise',
    title: 'Simulasi 2: Gedung Bertingkat (Lantai 12)',
    subtitle: 'Kekuatan M 6.8, Bangunan Modern Perkantoran',
    locationType: 'highrise',
    magnitude: 6.8,
    depthKm: 25,
    shakingDurationSec: 40,
    description: 'Anda sedang berada di ruang rapat lantai 12 sebuah gedung perkantoran ketika alarm kebakaran berbunyi dan gedung berayun lambat namun lebar.',
    initialSituation: 'Kaca fasad luar berderit. Partisi kubikel bergoyang keras. Orang-orang di sekitar Anda mulai panik berlarian ke lorong.',
    phases: [
      {
        phase: 'warning',
        prompt: 'Kondisi awal di lantai 12 gedung bertingkat tinggi:',
        options: [
          {
            text: 'Segera merunduk di bawah meja kerja kokoh atau di samping pilar beton utama, jauhi dinding kaca luar',
            isBest: true,
            consequence: 'Sangat tepat! Fasad kaca dan jendela gedung bertingkat adalah titik paling rapuh saat gempa.',
            points: 35
          },
          {
            text: 'Berlari kencang menuju Lift dan menekan tombol panah turun',
            isBest: false,
            consequence: 'Sistem pengaman darurat gedung otomatis memutus daya listrik dan Anda terjebak di dalam lift macet!',
            points: -30
          },
          {
            text: 'Berdesakan di pintu darurat saat lantai masih berayun kencang',
            isBest: false,
            consequence: 'Orang-orang saling dorong dan menimbulkan kecelakaan terinjak-injak (stampede).',
            points: 5
          }
        ]
      },
      {
        phase: 'shaking',
        prompt: 'Gedung berayun dengan sudut simpangan yang menakutkan karena fleksibilitas struktur seismik. Sikap Anda?',
        options: [
          {
            text: 'Tetap tenang, lindungi kepala dan tengkuk leher, jangan panik melompat',
            isBest: true,
            consequence: 'Gedung tinggi dirancang fleksibel untuk meredam resonansi gempa. Bertahan di posisi aman adalah kunci.',
            points: 35
          },
          {
            text: 'Mencoba memecahkan kaca jendela untuk berteriak ke bawah',
            isBest: false,
            consequence: 'Tindakan membahayakan diri sendiri dan orang di jalan bawah gedung.',
            points: -25
          }
        ]
      },
      {
        phase: 'evacuation',
        prompt: 'Guncangan utama telah mereda. Petugas keselamatan lantai menginstruksikan evakuasi gedung. Jalur mana yang Anda pilih?',
        options: [
          {
            text: 'Menuruni TANGGA DARURAT darurat secara tertib bertahap, lepas sepatu hak tinggi jika memakai',
            isBest: true,
            consequence: 'Evakuasi berhasil dengan aman tanpa cedera!',
            points: 35
          },
          {
            text: 'Menggunakan lift logistik di bagian belakang gedung karena tangga darurat terlalu jauh',
            isBest: false,
            consequence: 'Lift logistik sewaktu-waktu mati total saat gempa susulan terjadi.',
            points: -20
          }
        ]
      }
    ]
  },
  {
    id: 'sim-school',
    title: 'Simulasi 3: Ruang Kelas Kampus / Sekolah',
    subtitle: 'Kekuatan M 5.9, Kedalaman 8 km',
    locationType: 'school',
    magnitude: 5.9,
    depthKm: 8,
    shakingDurationSec: 20,
    description: 'Anda sedang mengikuti ujian perkuliahan di lantai 2 gedung kampus berkapasitas 50 mahasiswa.',
    initialSituation: 'Papan tulis bergetar hebat. Proyektor LCD di langit-langit berguncang keras. Teman sekelas mulai histeris.',
    phases: [
      {
        phase: 'shaking',
        prompt: 'Proyektor LCD tampak kendur bautnya dan berisiko jatuh. Apa komando yang paling tepat?',
        options: [
          {
            text: 'Merunduk di bawah meja kuliah siswa, gunakan tas punggung tebal untuk menutupi kepala dan tengkuk',
            isBest: true,
            consequence: 'Buku di dalam tas ransel menjadi peredam benturan yang sangat baik terhadap puing jatuh!',
            points: 35
          },
          {
            text: 'Berdiri di atas kursi untuk menangkap proyektor yang hendak lepas',
            isBest: false,
            consequence: 'Proyektor jatuh menimpa wajah Anda. Keselamatan diri adalah prioritas nomor satu!',
            points: -30
          },
          {
            text: 'Berebut saling dorong di depan pintu keluar kelas yang sempit',
            isBest: false,
            consequence: 'Terjadi kemacetan parah di mulut pintu dan beberapa mahasiswa terjepit.',
            points: 0
          }
        ]
      },
      {
        phase: 'evacuation',
        prompt: 'Gempa reda. Dosen meminta seluruh mahasiswa mengevakuasi kelas:',
        options: [
          {
            text: 'Jalan cepat (jangan berlari), lindungi kepala dengan map/tas, menuju lapangan terbuka kampus',
            isBest: true,
            consequence: 'Seluruh kelas tiba di titik kumpul (assembly point) dengan selamat.',
            points: 35
          },
          {
            text: 'Tetap di dalam kelas menunggu teman merapikan catatan dan laptop',
            isBest: false,
            consequence: 'Risiko terkena runtuhan dinding bata akibat gempa susulan.',
            points: 10
          }
        ]
      }
    ]
  },
  {
    id: 'sim-outdoor',
    title: 'Simulasi 4: Ruang Terbuka & Jalan Raya',
    subtitle: 'Kekuatan M 6.5 di Kawasan Perkotaan',
    locationType: 'outdoor',
    magnitude: 6.5,
    depthKm: 15,
    shakingDurationSec: 30,
    description: 'Anda sedang berjalan kaki di trotoar kawasan pertokoan padat dengan gedung kaca tinggi dan kabel listrik semrawut.',
    initialSituation: 'Papan reklame toko berderak. Kabel tiang listrik bergoyang saling bergesekan menimbulkan percikan api.',
    phases: [
      {
        phase: 'shaking',
        prompt: 'Anda berada di trotoar terbuka saat getaran kuat menghantam tanah:',
        options: [
          {
            text: 'Segera merunduk dan jauhi fasad gedung, tiang listrik, papan baliho, dan pohon besar; lindungi kepala dengan tas',
            isBest: true,
            consequence: 'Tepat sekali! Bahaya terbesar di luar ruangan adalah pecahan kaca fasad dan kabel putus.',
            points: 40
          },
          {
            text: 'Segera lari masuk ke dalam minimarket untuk mencari tempat berteduh',
            isBest: false,
            consequence: 'Masuk ke dalam gedung yang sedang berguncang justru meningkatkan risiko tertimpa puing fasad kanopi!',
            points: -20
          },
          {
            text: 'Berpegangan erat pada tiang listrik bertegangan tinggi di trotoar',
            isBest: false,
            consequence: 'Sangat fatal! Tiang listrik bisa tumbang atau kabelnya terkelupas mengenai Anda.',
            points: -40
          }
        ]
      }
    ]
  },
  {
    id: 'sim-vehicle',
    title: 'Simulasi 5: Di Dalam Kendaraan / Mobil',
    subtitle: 'Kekuatan M 6.7 di Jalan Tol Luar Kota',
    locationType: 'vehicle',
    magnitude: 6.7,
    depthKm: 18,
    shakingDurationSec: 35,
    description: 'Anda sedang mengemudikan kendaraan roda empat pada kecepatan 70 km/jam saat gempa besar terjadi.',
    initialSituation: 'Kendaraan terasa berguncang liar seperti keempat ban kempes mendadak. Aspal jalan terlihat bergelombang.',
    phases: [
      {
        phase: 'shaking',
        prompt: 'Langkah pengemudi yang paling aman:',
        options: [
          {
            text: 'Nyalakan lampu hazard, kurangi kecepatan bertahap, tepikan mobil di area lapang bebas jembatan layang/tebing, dan tetap di dalam mobil',
            isBest: true,
            consequence: 'Pengendalian armada yang sempurna! Struktur bodi mobil melindungi Anda dari runtuhan ranting atau kabel.',
            points: 40
          },
          {
            text: 'Injak rem sekuat tenaga di lajur tengah lalu melompat keluar dari mobil',
            isBest: false,
            consequence: 'Memicu tabrakan beruntun dengan kendaraan di belakang Anda!',
            points: -30
          },
          {
            text: 'Berhenti tepat di bawah jembatan layang layang tol untuk berteduh',
            isBest: false,
            consequence: 'Struktur jembatan layang rawan ambruk atau jatuh lempengannya menimpa mobil Anda.',
            points: -35
          }
        ]
      }
    ]
  }
];

