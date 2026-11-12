export interface EducationModule {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  readTime: string;
  sections: {
    heading: string;
    content: string;
    bulletPoints?: string[];
    callout?: {
      type: 'tip' | 'warning' | 'info';
      title: string;
      text: string;
    };
    diagramType?: 'hypocenter' | 'waves' | 'faults' | 'liquefaction' | 'layers' | 'mmi';
  }[];
}

export const EDUCATION_MODULES: EducationModule[] = [
  {
    id: 'pengertian',
    badge: 'Modul A',
    title: 'Pengertian & Anatomi Gempa Bumi',
    subtitle: 'Memahami bagaimana gelombang energi elastis merambat dari perut bumi hingga ke permukaan.',
    readTime: '6 menit baca',
    sections: [
      {
        heading: '1. Apa itu Gempa Bumi?',
        content: 'Gempa bumi (earthquake) adalah getaran atau guncangan yang terjadi di permukaan bumi akibat pelepasan energi secara tiba-tiba dari dalam litosfer yang menciptakan gelombang seismik. Sebagian besar gempa bumi dipicu oleh patahnya batuan di bawah tekanan tektonik lempeng bumi yang terus bergerak secara konstan beberapa sentimeter setiap tahunnya.',
        diagramType: 'hypocenter',
        callout: {
          type: 'info',
          title: 'Fakta Seismik',
          text: 'Setiap hari bumi mengalami ribuan getaran seismik mikro yang tidak dirasakan manusia, namun jaringan seismograf global mendeteksinya tanpa henti.'
        }
      },
      {
        heading: '2. Hiposentrum vs Episentrum',
        content: 'Dua istilah ini sangat penting dalam membaca laporan BMKG dan USGS:',
        bulletPoints: [
          'Hiposentrum (Focus): Titik atau zona di dalam kerak bumi tempat batuan pertama kali patah dan energi mulai dilepaskan.',
          'Episentrum (Epicenter): Titik di permukaan bumi yang berada tepat vertikal di atas hiposentrum. Lokasi inilah yang biasanya diumumkan dalam nama geografis (misal: "84 km Barat Daya Bayah-Banten").'
        ]
      },
      {
        heading: '3. Gelombang Seismik: Pembawa Energi Goncangan',
        content: 'Energi gempa merambat dalam bentuk gelombang mekanik elastis yang dibagi menjadi dua kelompok besar:',
        diagramType: 'waves',
        bulletPoints: [
          'Gelombang Primer (P-Wave): Gelombang longitudinal (kompresional) tercepat (5-8 km/s). Merambat melalui zat padat, cair, dan gas. Mengakibatkan partikel terdorong maju-mundur searah rambatan.',
          'Gelombang Sekunder (S-Wave): Gelombang transversal yang merambat lebih lambat (3-4.5 km/s). Hanya merambat pada batuan padat. Mengguncang partikel tegak lurus arah rambat dan memicu kerusakan struktur.',
          'Gelombang Permukaan (Love & Rayleigh Wave): Merambat di permukaan tanah dengan amplitudo besar dan frekuensi rendah, menimbulkan efek gelombang bergulung yang merusak pondasi bangunan.'
        ]
      },
      {
        heading: '4. Cara Mengukur: Magnitudo vs Skala Intensitas MMI',
        content: 'Banyak orang salah mengira skala magnitudo sama dengan dampak kerusakan:',
        bulletPoints: [
          'Magnitudo (Mw / M): Mengukur besaran total energi yang dilepaskan pada sumber gempa. Bersifat mutlak (hanya satu nilai untuk satu peristiwa gempa, contoh: M 6.5). Skala ini bersifat logaritmik, di mana kenaikan 1 angka berarti energi naik sekitar 32 kali lipat!',
          'Intensitas MMI (Modified Mercalli Intensity): Mengukur derajat getaran dan kerusakan di lokasi tertentu yang dirasakan orang atau infrastruktur. Nilainya bervariasi tergantung jarak dari episentrum dan kondisi tanah lokal (misal: Skala II MMI di Jakarta, Skala VI MMI di episentrum).'
        ]
      }
    ]
  },
  {
    id: 'penyebab',
    badge: 'Modul B',
    title: 'Penyebab Terjadinya Gempa Bumi',
    subtitle: 'Menelusuri dinamika lempeng tektonik, sesar aktif, aktivitas magma, dan pemicu buatan manusia.',
    readTime: '7 menit baca',
    sections: [
      {
        heading: '1. Teori Tektonika Lempeng (Plate Tectonics)',
        content: 'Kerak bumi tidak berupa cangkang utuh melainkan terpecah menjadi lempeng-lempeng litosfer raksasa yang mengapung di atas astenosfer yang plastis. Gerakan konveksi panas di dalam mantel bumi menggerakkan lempeng ini secara perlahan (2-10 cm per tahun). Ketika tepi lempeng saling bertumbukan atau tertahan akibat gesekan, tegangan elastis terus terakumulasi hingga melampaui kekuatan geser batuan, lalu pecah menghasilkan gempa bumi.',
        diagramType: 'layers'
      },
      {
        heading: '2. Tiga Jenis Batas Lempeng dan Sesar (Faults)',
        content: 'Patahan batuan bumi (sesar) terbagi menjadi:',
        diagramType: 'faults',
        bulletPoints: [
          'Batas Konvergen / Sesar Naik (Thrust / Reverse Fault): Lempeng saling menekan dan menunjam (subduksi). Menghasilkan gempa-gempa terdahsyat di dunia (Megathrust, seperti Gempa Aceh 2004 dan Tohoku 2011).',
          'Batas Divergen / Sesar Turun (Normal Fault): Lempeng saling menjauh, membuka kerak dan membentuk pematang tengah samudra (Mid-Ocean Ridge).',
          'Batas Transform / Sesar Mendatar (Strike-Slip Fault): Dua blok batuan bergeser secara horisontal bersebelahan. Contoh nyata: Sesar Palu-Koro di Sulawesi dan Sesar San Andreas di California.'
        ]
      },
      {
        heading: '3. Penyebab Non-Tektonik',
        content: 'Selain tektonik utama, gempa juga dapat bersumber dari:',
        bulletPoints: [
          'Aktivitas Vulkanik: Pergerakan magma cair dan gas bertekanan tinggi di dalam pipa kawah gunung api sebelum atau saat erupsi (gempa vulkanik).',
          'Runtuhan (Collapse Earthquake): Runtuhnya atap gua kapur bawah tanah atau terowongan tambang yang runtuh.',
          'Gempa Terinduksi Manusia (Induced Seismicity): Aktivitas injeksi air bertekanan tinggi untuk fracking migas, pengisian waduk raksasa (reservoir-induced), atau peledakan uji coba nuklir bawah tanah.'
        ]
      }
    ]
  },
  {
    id: 'jenis',
    badge: 'Modul C',
    title: 'Klasifikasi & Jenis-Jenis Gempa Bumi',
    subtitle: 'Klasifikasi mendalam berdasarkan mekanisme pemicu, kedalaman hiposentrum, dan lokasinya.',
    readTime: '5 menit baca',
    sections: [
      {
        heading: '1. Berdasarkan Kedalaman Hiposentrum',
        content: 'Kedalaman sumber gempa sangat menentukan seberapa keras getaran terasa di permukaan tanah:',
        bulletPoints: [
          'Gempa Dangkal (Kedalaman 0 - 60 km): Sangat berbahaya dan paling sering menimbulkan kerusakan parah karena energi seismik mencapai pemukiman dengan sedikit redaman batuan.',
          'Gempa Menengah (Kedalaman 60 - 300 km): Menimbulkan guncangan yang dirasakan di wilayah cukup luas, dengan tingkat kerusakan yang relatif lebih moderat.',
          'Gempa Dalam (Kedalaman > 300 km hingga 700 km): Terjadi di dalam lempeng subduksi yang menembus mantel dalam. Umumnya getaran di permukaan terasa halus mengayun dan jarang merusak bangunan.'
        ]
      },
      {
        heading: '2. Berdasarkan Lokasi Kejadian (Darat vs Bawah Laut)',
        content: 'Lokasi episentrum menentukan jenis bahaya ikutan:',
        bulletPoints: [
          'Gempa Darat: Rentan memicu retakan permukaan (surface rupture), tanah longsor di perbukitan, serta kerusakan langsung pada pemukiman dan infrastruktur jalan.',
          'Gempa Bawah Laut (Submarine Earthquake): Jika magnitudonya besar (M >= 7.0), berkedalaman dangkal (< 50 km), dan memiliki mekanisme sesar naik/turun vertikal, gempa ini dapat mendisposisi volume air laut raksasa dan memicu gelombang TSUNAMI.'
        ]
      }
    ]
  },
  {
    id: 'dampak',
    badge: 'Modul D',
    title: 'Dampak & Bahaya Ikutan Gempa Bumi',
    subtitle: 'Memahami spektrum bahaya primer dan sekunder: dari likuefaksi, longsor, hingga dampak sosio-ekonomi.',
    readTime: '6 menit baca',
    sections: [
      {
        heading: '1. Kerusakan Struktural & Korban Jiwa',
        content: 'Bukan gempa bumi yang membunuh manusia, melainkan bangunan yang runtuh menimpa penghuninya. Kegagalan struktur akibat tidak diterapkannya standar rumah tahan gempa (non-engineered building) merupakan penyebab utama jatuhnya korban jiwa dalam bencana gempa bumi di negara berkembang.'
      },
      {
        heading: '2. Fenomena Likuefaksi (Pencairan Tanah)',
        content: 'Likuefaksi adalah fenomena hilangnya daya dukung tanah berpasir jenuh air saat menerima beban getaran seismik berulang. Tanah berubah menjadi seperti cairan kental, menenggelamkan pondasi gedung, memuntahkan semburan pasir dan lumpur ke permukaan, serta menggeser pemukiman layaknya perahu di atas air, seperti yang terjadi pada Gempa Palu 2018.',
        diagramType: 'liquefaction'
      },
      {
        heading: '3. Bahaya Sekunder: Longsor, Tsunami & Kebakaran',
        content: 'Gempa bumi sering kali menjadi pemantik rentetan bahaya ikutan (chain of hazards):',
        bulletPoints: [
          'Tanah Longsor: Getaran gempa merusak kestabilan lereng bukit curam, mengubur pemukiman di lembah bawahnya.',
          'Tsunami: Gelombang laut raksasa dengan kecepatan rambat ratusan km/jam di laut dalam yang menghantam pesisir.',
          'Kebakaran Kota: Patahnya pipa gas dan kabel listrik tegangan tinggi bersamaan dengan rusaknya hidran air pemadam.',
          'Trauma Psikologis & Disrupsi Sosial: Gangguan stres pascatrauma (PTSD) pada anak-anak, dislokasi tempat tinggal, dan kerugian ekonomi senilai miliaran rupiah.'
        ]
      }
    ]
  },
  {
    id: 'megathrust-indonesia',
    badge: 'Modul E',
    title: 'Peta Tektonik, Megathrust & Sesar Aktif Indonesia',
    subtitle: 'Memetakan jalur subduksi lempeng samudra dan jaringan patahan darat yang melintasi kepulauan Nusantara.',
    readTime: '8 menit baca',
    sections: [
      {
        heading: '1. Mengapa Indonesia Memiliki Aktivitas Gempa Sangat Tinggi?',
        content: 'Kepulauan Indonesia berada tepat di pertemuan empat lempeng tektonik besar dunia: Lempeng Indo-Australia di selatan, Lempeng Eurasia di barat dan utara, Lempeng Pasifik di timur, serta Lempeng Laut Filipina di timur laut. Interaksi konvergen dan transform antarlempeng ini menjadikan Indonesia bagian paling aktif dari Cincin Api Pasifik (Pacific Ring of Fire).',
        callout: {
          type: 'info',
          title: 'Data Seismisitas Nasional BMKG',
          text: 'Jaringan sensor BMKG mencatat rata-rata 8.000 hingga 11.000 kejadian gempa bumi setiap tahunnya di wilayah Indonesia, di mana sekitar 200–300 di antaranya merupakan gempa yang dirasakan masyarakat.'
        }
      },
      {
        heading: '2. Mengenal Zona Megathrust di Busur Kepulauan',
        content: 'Megathrust adalah bidang kontak subduksi dangkal (kedalaman kurang dari 50 km) tempat lempeng samudra menunjam ke bawah lempeng benua. Ketika bidang kontak ini terkunci (locked zone) selama puluhan hingga ratusan tahun, akumulasi regangan elastisnya dapat memicu gempa bermagnitudo M ≥ 8.0:',
        bulletPoints: [
          'Segmen Barat Sumatra: Meliputi Megathrust Aceh-Andaman, Nias-Simeulue, Batu, Mentawai-Siberut, Mentawai-Pagai, hingga Enggano.',
          'Segmen Selat Sunda & Selatan Jawa: Meliputi Megathrust Selat Sunda-Banten, Jawa Barat-Jawa Tengah, dan Jawa Timur yang berhadapan langsung dengan Samudra Hindia.',
          'Segmen Timur Nusantara: Meliputi busur Sumba, Banda, Sulawesi Utara, Halmahera, hingga Utara Papua.'
        ]
      },
      {
        heading: '3. Jaringan Sesar Darat Aktif yang Wajib Diwaspadai',
        content: 'Selain subduksi di laut, daratan Indonesia dibelah oleh ratusan segmen sesar aktif dangkal yang dekat dengan pusat kota dan pemukiman padat:',
        bulletPoints: [
          'Pulau Sumatra: Sesar Besar Sumatra (Great Sumatran Fault / Sesar Semangko) sepanjang 1.900 km dari Aceh hingga Teluk Semangko Lampung.',
          'Pulau Jawa: Sesar Cimandiri, Sesar Lembang, Sesar Cugenang, dan Sesar Baribis di Jawa Barat; Sesar Merapi-Merbabu dan Sesar Opak di DIY-Jawa Tengah; serta Sesar Kendeng di Jawa Timur.',
          'Sulawesi, Maluku & Papua: Sesar Palu-Koro dan Sesar Matano di Sulawesi (pergerakan sangat cepat ~40 mm/tahun), Sesar Sorong, Sesar Yapen, dan Sesar Tarera-Aiduna di Papua.'
        ]
      }
    ]
  },
  {
    id: 'peringatan-dini-bmkg',
    badge: 'Modul F',
    title: 'Cara Membaca Parameter BMKG, Skala MMI & Tsunami',
    subtitle: 'Panduan praktis menafsirkan informasi resmi gempa bumi dan peringatan dini tsunami dari BMKG.',
    readTime: '7 menit baca',
    sections: [
      {
        heading: '1. Bedah Format Laporan Gempa Resmi BMKG',
        content: 'Setiap kali gempa terjadi, sistem InaTEWS (Indonesia Tsunami Early Warning System) BMKG mempublikasikan parameter gempa dalam waktu kurang dari 3–5 menit:',
        bulletPoints: [
          'Waktu Kejadian (OT / Origin Time): Waktu persis saat batuan pertama kali patah di hiposentrum (dalam WIB/WITA/WIT atau UTC).',
          'Magnitudo (M): Ukuran kekuatan energi gempa pada sumbernya. Nilai ini dapat diperbarui (dimutakhirkan) setelah gelombang terekam lengkap oleh stasiun seismograf yang lebih jauh.',
          'Kedalaman (Depth): Jarak vertikal dari permukaan bumi ke hiposentrum. Semakin dangkal (< 20 km) pada magnitudo yang sama, guncangan di dekat episentrum akan semakin menyentak kuat.',
          'Peta Guncangan (Shakemap): Peta kontur warna yang memvisualisasikan distribusi guncangan permukaan dalam skala intensitas MMI.'
        ]
      },
      {
        heading: '2. Memahami Skala Intensitas MMI (I hingga XII)',
        content: 'BMKG membagi skala dampak guncangan menggunakan Skala Intensitas Modified Mercalli (MMI) dan SIG-BMKG:',
        diagramType: 'mmi',
        bulletPoints: [
          'I – II MMI (Tidak Dirasakan / Dirasakan Ringan): Hanya tercatat oleh alat atau dirasakan oleh sedikit orang yang sedang diam di lantai atas gedung.',
          'III – IV MMI (Dirasakan Nyata di Dalam Rumah): Terasa seperti truk berat melintas, lampu gantung berayun, jendela dan pintu berderik.',
          'V – VI MMI (Getaran Kuat & Kerusakan Ringan): Semua warga terbangun dan berlari keluar, plester dinding retak, barang-barang di rak berjatuhan.',
          'VII – VIII MMI (Kerusakan Sedang hingga Berat): Bangunan dengan konstruksi lemah mengalami keruntuhan dinding, cerobong dan monumen tumbang.',
          'IX – XII MMI (Kerusakan Masif / Katastropik): Bangunan rangka beton mengalami kerusakan struktur berat, jembatan bergeser, dan permukaan tanah terbelah.'
        ]
      },
      {
        heading: '3. Syarat Fisis Gempa Pemicu Tsunami & Tanda Alam',
        content: 'Tidak semua gempa di laut menimbulkan tsunami. Tsunami umumnya terbentuk apabila memenuhi empat kriteria utama secara bersamaan:',
        bulletPoints: [
          'Episentrum berada di bawah dasar laut.',
          'Magnitudo besar (umumnya M ≥ 7.0, atau M ≥ 6.5 jika memicu longsoran bawah laut).',
          'Kedalaman hiposentrum dangkal (kurang dari 70 km).',
          'Mekanisme patahan berupa sesar naik (thrust) atau sesar turun (normal) yang menggerakkan kolom air laut secara vertikal.',
          'Tanda Alam Pesisir: Jika setelah gempa terasa kuat Anda melihat air laut surut secara tiba-tiba dan terdengar suara gemuruh dari arah laut, JANGAN tunggu sirine—segera lari ke dataran tinggi!'
        ]
      }
    ]
  },
  {
    id: 'bangunan-tahan-gempa',
    badge: 'Modul G',
    title: 'Prinsip Struktur & Rumah Tahan Gempa (SNI)',
    subtitle: 'Mengenal rekayasa struktur beton bertulang, teknologi isolator seismik, dan arsitektur vernakular Nusantara.',
    readTime: '6 menit baca',
    sections: [
      {
        heading: '1. Tiga Filosofi Utama Bangunan Tahan Gempa',
        content: 'Menurut standar rekayasa kegempaan (SNI 1726), bangunan tahan gempa bukan berarti bangunan yang tidak bisa rusak sama sekali, melainkan dirancang dengan tiga prinsip keselamatan:',
        bulletPoints: [
          'Gempa Ringan: Bangunan tidak boleh mengalami kerusakan baik pada elemen struktural maupun non-struktural.',
          'Gempa Sedang: Elemen non-struktural (dinding bata plesteran) boleh mengalami retak ringan yang dapat diperbaiki, namun struktur utama (kolom dan balok) tetap utuh.',
          'Gempa Kuat / Besar: Bangunan boleh mengalami kerusakan struktural demi menyerap energi gempa (daktilitas), tetapi TIDAK BOLEH RUNTUH MENDADAK agar penghuni punya waktu keluar dengan selamat.'
        ]
      },
      {
        heading: '2. Syarat Konstruksi Rumah Sederhana Tahan Gempa',
        content: 'Untuk rumah tinggal 1–2 lantai, kekuatan utama terletak pada sistem pengikat rangka beton bertulang yang menyatu (kesatuan struktur):',
        bulletPoints: [
          'Pondasi menerus di atas tanah keras yang terikat kuat dengan balok Sloof beton bertulang.',
          'Kolom praktis dan kolom utama dengan tulangan besi berstandar serta sengkang (begel) yang rapat pada ujung-ujung sambungan.',
          'Balok keliling atas (Ringbalk) yang mengikat seluruh ujung atas kolom dan kuda-kuda atap menjadi satu kesatuan kaku.',
          'Angkur besi setiap 6 lapis pasangan bata antara kolom dengan dinding agar tembok tidak roboh keluar saat terguncang.'
        ],
        callout: {
          type: 'warning',
          title: 'Waspada Bahaya Soft-Story (Lantai Dasar Lemah)',
          text: 'Hindari membuat lantai dasar yang terlalu terbuka tanpa dinding geser atau kolom memadai (seperti ruko dengan parkiran terbuka di lantai 1 dan beban berat di lantai 2–3), karena sangat rawan patah dan amblas saat gempa!'
        }
      },
      {
        heading: '3. Teknologi Peredam Gempa Modern',
        content: 'Pada gedung pencakar langit, rumah sakit, dan jembatan strategis, insinyur sipil menerapkan teknologi kontrol respons seismik:',
        bulletPoints: [
          'Base Isolation (Isolator Dasar): Bantalan karet berlapis baja dan inti timbal (Lead Rubber Bearing) yang dipasang di antara pondasi dan kolom bawah gedung untuk memisahkan gedung dari guncangan tanah.',
          'Tuned Mass Damper (Bandul Peredam): Bola baja raksasa ratusan ton di puncak gedung tinggi yang bergerak berlawanan arah ayunan gedung untuk menstabilkan struktur.',
          'Viscous Wall & Brace Damper: Peredam hidrolik diagonal pada rangka gedung yang menyerap energi kinetik guncangan layaknya shockbreaker kendaraan.'
        ]
      }
    ]
  },
  {
    id: 'mitigasi-evakuasi',
    badge: 'Modul H',
    title: 'Protokol Tanggap Darurat: Sebelum, Saat & Sesudah Gempa',
    subtitle: 'Langkah-langkah praktis penyelamatan nyawa di berbagai situasi: rumah, gedung bertingkat, sekolah, dan jalan raya.',
    readTime: '7 menit baca',
    sections: [
      {
        heading: '1. Fase Pra-Bencana (Kesiapsiagaan Keluarga)',
        content: 'Kesiapsiagaan sebelum bencana terjadi dapat memangkas risiko cedera hingga lebih dari 70%:',
        bulletPoints: [
          'Amankan Perabot Tinggi: Pasang siku L (wall bracket) untuk mengikat lemari pakaian, rak buku, dan pemanas air ke dinding.',
          'Pindahkan Benda Berat ke Bawah: Jangan menaruh barang pecah belah atau koper berat di atas lemari atau di atas kepala tempat tidur.',
          'Kenali Utilitas Rumah: Pastikan seluruh anggota keluarga tahu cara mematikan sakelar listrik utama (MCB) dan mencabut regulator tabung gas LPG.',
          'Siapkan Tas Siaga 72 Jam: Sediakan air minum, makanan tahan lama, kotak P3K, senter, peluit, powerbank, dan salinan dokumen penting di dekat pintu keluar.'
        ]
      },
      {
        heading: '2. Fase Saat Gempa Terjadi (60 Detik Krusial)',
        content: 'Tindakan Anda dalam 60 detik pertama saat tanah berguncang menentukan keselamatan Anda:',
        bulletPoints: [
          'Di Dalam Ruangan: Lakukan DROP (merunduk), COVER (lindungi kepala di kolong meja kokoh), dan HOLD ON (pegang kaki meja). Jauhi jendela kaca dan lampu gantung.',
          'Di Gedung Tinggi / Mall: JANGAN PERNAH menggunakan Lift/Elevator! Tetap berlindung di dekat kolom struktur dalam ruangan hingga guncangan berhenti, lalu turun melalui tangga darurat.',
          'Di Luar Ruangan: Jauhi gedung kaca, tiang listrik, pohon besar, dan papan reklame. Cari area lapangan terbuka.',
          'Saat Mengemudi: Kurangi kecepatan secara bertahap, nyalakan lampu hazard, dan menepi di tempat terbuka yang jauh dari jembatan layang (flyover), terowongan, atau lereng tebing.'
        ]
      },
      {
        heading: '3. Fase Pascagempa (Pemeriksaan & Pemulihan Awal)',
        content: 'Setelah guncangan utama berhenti, bahaya belum sepenuhnya berlalu:',
        bulletPoints: [
          'Waspadai Gempa Susulan (Aftershocks): Gempa susulan dapat meruntuhkan struktur dinding yang sudah retak akibat gempa utama.',
          'Periksa Kebocoran Gas & Korsleting: Jika tercium bau gas, segera buka jendela dan keluar tanpa menyalakan korek api atau sakelar lampu.',
          'Pantau Informasi Resmi: Hanya ikuti pengumuman resmi dari kanal terverifikasi BMKG, BNPB, dan BPBD setempat; jangan menyebarkan kabar bohong (hoaks) prediksi waktu gempa.'
        ]
      }
    ]
  }
];

