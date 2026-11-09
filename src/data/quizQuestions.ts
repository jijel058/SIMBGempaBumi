import { QuizQuestion } from '../types/games';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // EASY
  {
    id: 'q1',
    question: 'Apa tindakan utama yang paling direkomendasikan saat terjadi gempa bumi di dalam ruangan?',
    category: 'mitigation',
    difficulty: 'easy',
    options: [
      'Segera berlari keluar menuju tangga lift secepatnya',
      'Lakukan Drop, Cover, and Hold On (Merunduk, Berlindung, dan Bertahan)',
      'Berdiri tepat di samping jendela kaca besar untuk melihat situasi luar',
      'Menaiki meja dan berteriak meminta pertolongan'
    ],
    correctIndex: 1,
    explanation: 'Drop, Cover, and Hold On adalah standar protokol keselamatan global untuk melindungi kepala dan organ vital dari runtuhan puing.',
    points: 20
  },
  {
    id: 'q2',
    question: 'Titik pusat gempa bumi yang berada di bawah permukaan bumi disebut...',
    category: 'geology',
    difficulty: 'easy',
    options: [
      'Episentrum',
      'Hiposentrum (Fokus)',
      'Kawah Seismik',
      'Sesar Lempeng'
    ],
    correctIndex: 1,
    explanation: 'Hiposentrum adalah titik asal terjadinya pelepasan energi gempa di dalam kerak bumi, sedangkan episentrum adalah proyeksi tegak lurusnya di permukaan bumi.',
    points: 20
  },
  {
    id: 'q3',
    question: 'Lembaga resmi di Indonesia yang bertugas memantau dan menyebarkan informasi gempa bumi secara real-time adalah...',
    category: 'seismology',
    difficulty: 'easy',
    options: [
      'BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)',
      'Kementerian Keuangan',
      'Dinas Lingkungan Hidup',
      'Badan POM'
    ],
    correctIndex: 0,
    explanation: 'BMKG mengoperasikan sistem deteksi seismik InaTEWS di seluruh wilayah Indonesia 24 jam sehari.',
    points: 20
  },
  {
    id: 'q4',
    question: 'Benda apa yang paling esensial dan mutlak harus ada di dalam Tas Siaga Bencana (TSB)?',
    category: 'mitigation',
    difficulty: 'easy',
    options: [
      'Kamera DSLR dan tripod',
      'Air minum kemasan dan makanan tahan lama',
      'Peralatan make-up dan setrika',
      'Buku ensiklopedia tebal'
    ],
    correctIndex: 1,
    explanation: 'Kebutuhan hidrasi minimal (air minum) dan kalori darurat (biskuit/makanan kaleng) adalah penentu bertahan hidup dalam 72 jam pertama pascabencana.',
    points: 20
  },

  // MEDIUM
  {
    id: 'q5',
    question: 'Apakah ilmuwan atau teknologi saat ini dapat memprediksi secara pasti tanggal, jam, dan menit terjadinya gempa bumi?',
    category: 'seismology',
    difficulty: 'medium',
    options: [
      'Ya, menggunakan satelit radar inframerah canggih',
      'Ya, BMKG dapat memprediksi 3 hari sebelumnya',
      'Tidak, hingga saat ini belum ada teknologi yang dapat memprediksi waktu pasti gempa bumi',
      'Ya, berdasarkan pergerakan hewan peliharaan'
    ],
    correctIndex: 2,
    explanation: 'Hingga saat ini tidak ada teknologi ilmiah di dunia yang mampu memprediksi waktu pasti terjadinya gempa bumi. Sistem yang ada adalah Early Warning System (peringatan beberapa detik setelah gelombang terdeteksi sensor).',
    points: 30
  },
  {
    id: 'q6',
    question: 'Fenomena hilangnya kekuatan tanah akibat guncangan gempa sehingga tanah berubah menjadi seperti lumpur cair disebut...',
    category: 'geology',
    difficulty: 'medium',
    options: [
      'Subduksi',
      'Likuefaksi (Liquefaction)',
      'Erosi Glasial',
      'Intrusi Magma'
    ],
    correctIndex: 1,
    explanation: 'Likuefaksi terjadi pada lapisan tanah berpasir jenuh air saat menerima tegangan siklik dari gelombang seismik, menyebabkan air pori naik dan tanah kehilangan daya dukung beban.',
    points: 30
  },
  {
    id: 'q7',
    question: 'Skala MMI (Modified Mercalli Intensity) mengukur gempa bumi berdasarkan...',
    category: 'seismology',
    difficulty: 'medium',
    options: [
      'Total energi yang dilepaskan di hiposentrum',
      'Dampak getaran dan kerusakan yang dirasakan manusia serta bangunan di suatu lokasi',
      'Kecepatan gelombang tsunami di laut dalam',
      'Kedalaman palung laut'
    ],
    correctIndex: 1,
    explanation: 'Skala Magnitudo (seperti Mw) mengukur besaran energi sumber gempa, sedangkan Skala MMI mengukur intensitas efek/goncangan di lokasi spesifik.',
    points: 30
  },
  {
    id: 'q8',
    question: 'Jika Anda sedang berada di pantai dan merasakan gempa bumi kuat atau lama (>20 detik), tindakan paling tepat adalah...',
    category: 'mitigation',
    difficulty: 'medium',
    options: [
      'Menunggu rilis pesan SMS atau sirine resmi sebelum mengambil keputusan',
      'Segera berlari ke perahu nelayan untuk berlayar ke tengah laut',
      'Segera lari menjauhi pantai menuju tempat tinggi (bukit/bangunan evakuasi tsunami)',
      'Mengambil foto kondisi air laut yang mulai surut untuk diunggah ke medsos'
    ],
    correctIndex: 2,
    explanation: 'Prinsip 20-20-20: Jika gempa terasa 20 detik atau lebih, Anda hanya punya waktu sekitar 20 menit menuju tempat berketinggian minimal 20 meter.',
    points: 30
  },

  // HARD
  {
    id: 'q9',
    question: 'Gelombang seismik apakah yang merambat paling cepat dan pertama kali terekam oleh stasiun seismograf?',
    category: 'seismology',
    difficulty: 'hard',
    options: [
      'Gelombang Primer (P-Wave / Kompresional)',
      'Gelombang Sekunder (S-Wave / Transversal)',
      'Gelombang Rayleigh (Ground Roll)',
      'Gelombang Love'
    ],
    correctIndex: 0,
    explanation: 'Gelombang P adalah gelombang longitudinal kompresional tercepat (sekitar 5-8 km/s di kerak bumi) yang merambat melalui zat padat, cair, dan gas.',
    points: 40
  },
  {
    id: 'q10',
    question: 'Zona Megathrust Sunda terbentuk akibat proses tektonik apa?',
    category: 'tectonics',
    difficulty: 'hard',
    options: [
      'Pemisahan lempeng benua (divergen) di Laut Jawa',
      'Subduksi (penunjaman) Lempeng Indo-Australia ke bawah Lempeng Eurasia (Sunda)',
      'Pergeseran mendatar murni (transform) di sepanjang Selat Sunda',
      'Aktivitas patahan lokal kerak dangkal di daratan pulau Jawa'
    ],
    correctIndex: 1,
    explanation: 'Zona Megathrust Sunda adalah bidang kontak antar lempeng di mana kerak samudra Indo-Australia menunjam ke bawah paparan Sunda (Eurasia) dengan laju gerak sekitar 6-7 cm/tahun.',
    points: 40
  },
  {
    id: 'q11',
    question: 'Mengapa gempa bumi dangkal (kedalaman < 60 km) umumnya jauh lebih destruktif dibanding gempa dalam meski magnitudonya sama?',
    category: 'geology',
    difficulty: 'hard',
    options: [
      'Karena energi gelombang seismik belum banyak mengalami atenuasi (pelemahan) saat mencapai permukaan',
      'Karena gempa dangkal selalu disertai pelepasan lava cair',
      'Karena gempa dangkal memicu medan magnet bumi yang mematikan',
      'Karena gempa dangkal hanya terjadi di pemukiman padat penduduk'
    ],
    correctIndex: 0,
    explanation: 'Semakin dekat hiposentrum ke permukaan tanah, semakin sedikit energi seismik yang hilang dalam penyerapan massa batuan kerak, sehingga amplitudo percepatan tanah (PGA) di permukaan jauh lebih tinggi.',
    points: 40
  },
  {
    id: 'q12',
    question: 'Apa perbedaan mendasar antara batas lempeng Konvergen, Divergen, dan Transform?',
    category: 'tectonics',
    difficulty: 'hard',
    options: [
      'Konvergen saling bertumbukan, Divergen saling menjauh, Transform saling bergesekan mendatar',
      'Konvergen saling menjauh, Divergen saling mendekat, Transform memutar vertikal',
      'Ketiganya merupakan istilah gempa vulkanik di gunung berapi yang sama',
      'Transform hanya terjadi di inti luar bumi yang cair'
    ],
    correctIndex: 0,
    explanation: 'Batas lempeng konvergen saling menekan/menunjam (membentuk palung & gunung), divergen saling membuka (pematang tengah samudra), dan transform saling bergesekan horisontal (misal Sesar San Andreas).',
    points: 40
  }
];

