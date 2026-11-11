export interface EducationalArticle {
  id: string;
  category: 'Mitigasi' | 'Teknologi' | 'Geologi' | 'Evakuasi' | 'Kesiapsiagaan';
  title: string;
  excerpt: string;
  author: string;
  source: string;
  readTime: string;
  date: string;
  badgeColor: string;
  imageUrl?: string;
  content: {
    lead: string;
    sections: {
      title: string;
      body: string;
      highlights?: string[];
      tipBox?: {
        title: string;
        text: string;
      };
    }[];
  };
}

export const EDUCATIONAL_ARTICLES: EducationalArticle[] = [
  {
    id: 'artikel-ring-of-fire',
    category: 'Geologi',
    title: 'Mengapa Indonesia Terus Berguncang? Menyingkap Rahasia Cincin Api & Zona Megathrust',
    excerpt: 'Indonesia terletak di pertemuan 4 lempeng tektonik aktif dunia. Pahami mengapa tanah air kita kaya akan energi seismik dan bagaimana kita beradaptasi hidup damai dengannya.',
    author: 'Tim Geologi SEISMORA & BMKG',
    source: 'Pusat Seismologi Teknik BMKG',
    readTime: '6 menit baca',
    date: '11 November 2026',
    badgeColor: 'emerald',
    content: {
      lead: 'Secara geografis dan geologis, Indonesia merupakan laboratorium alam paling aktif di muka bumi. Terjepit di antara tumbukan lempeng Indo-Australia, Eurasia, Pasifik, dan Laut Filipina, bumi nusantara senantiasa melepaskan energinya dalam bentuk gempa tektonik dan aktivitas vulkanik.',
      sections: [
        {
          title: '1. Pertemuan Raksasa Lempeng Tektonik',
          body: 'Lempeng Indo-Australia bergerak ke arah timur laut dengan kecepatan sekitar 6-7 cm per tahun, menunjam ke bawah Lempeng Eurasia di sepanjang busur barat Sumatra, selatan Jawa, Bali, hingga Nusa Tenggara. Gesekan tak henti ini menciptakan akumulasi tegangan geser pada zona kontak antarlempeng.',
          highlights: [
            'Kecepatan geser: 6-7 cm/tahun (setara kecepatan pertumbuhan kuku manusia).',
            'Zona kontak tektonik ini dikenal sebagai Zona Subduksi (Subduction Zone).',
            'Bagian dangkal antarlempeng dinamakan Zona Megathrust yang mampu mengunci energi puluhan hingga ratusan tahun.'
          ],
          tipBox: {
            title: 'Fakta Ilmiah',
            text: 'Gempa Megathrust bukanlah sesuatu yang harus ditakuti secara berlebihan dengan kepanikan buta, melainkan sebuah kepastian geologis yang harus diantisipasi dengan tata ruang tangguh bencana dan edukasi mitigasi dini.'
          }
        },
        {
          title: '2. Sesar Darat Aktif yang Tersebar di Seluruh Pulau',
          body: 'Bahaya gempa bukan hanya bersumber dari palung laut. Di daratan, Indonesia dipotong oleh ratusan patahan kerak bumi aktif (sesar darat). Contohnya Sesar Besar Sumatra (Great Sumatran Fault) yang membentang dari Aceh hingga Lampung, Sesar Lembang di Jawa Barat, Sesar Opak di Yogyakarta, serta Sesar Palu-Koro di Sulawesi.',
          highlights: [
            'Sesar darat umumnya berkedalaman dangkal (0-20 km), sehingga energi getarannya sangat merusak bangunan di atasnya.',
            'Banyak pemukiman padat berdiri di atas atau berdekatan dengan jalur patahan aktif ini tanpa disadari.'
          ]
        },
        {
          title: '3. Hidup Berdampingan dengan Bencana Melalui Mitigasi Kultural',
          body: 'Nenek moyang nusantara telah membuktikan kearifan lokal dalam membangun hunian tradisional tahan gempa—seperti Rumah Omo Hada di Nias dan Rumah Gadang di Minangkabau yang menggunakan sambungan pasak kayu fleksibel tanpa paku. Kini teknologi modern mereplikasi prinsip kelenturan ini melalui standardisasi SNI Bangunan Tahan Gempa.'
        }
      ]
    }
  },
  {
    id: 'artikel-drop-cover-holdon',
    category: 'Mitigasi',
    title: 'Drop, Cover, Hold On: Langkah Emas 60 Detik Pertama Menyelamatkan Diri Saat Gempa',
    excerpt: 'Jangan panik berlari keluar gedung saat guncangan masih berlangsung. Pelajari teknik bertahan hidup yang diakui secara internasional oleh FEMA, USGS, dan BNPB.',
    author: 'Instruktur Tanggap Darurat SEISMORA',
    source: 'BNPB & USGS Earthquake Hazards Program',
    readTime: '5 menit baca',
    date: '10 November 2026',
    badgeColor: 'amber',
    content: {
      lead: 'Statistik membuktikan bahwa mayoritas korban luka dan jiwa dalam peristiwa gempa bumi bukan disebabkan oleh tanah yang merekah menelan manusia, melainkan akibat tertimpa puing plafon, kaca jendela pecah, dan barang berat yang terlempar saat orang panik berusaha berlari.',
      sections: [
        {
          title: 'Langkah 1: DROP (Merunduk / Berlutut)',
          body: 'Segera rendahkan posisi tubuh Anda ke lantai dengan berlutut di atas kedua tangan dan lutut. Posisi ini menjaga Anda agar tidak terlempar jatuh oleh hentakan gempa yang tiba-tiba, serta memungkinkan Anda tetap dapat merayap jika diperlukan perlindungan.',
          highlights: [
            'Jangan berdiri mematung atau mencoba berlari keluar ruangan saat tanah masih berayun kencang.',
            'Lantai adalah posisi paling stabil saat inersia gedung bergerak bolak-balik.'
          ]
        },
        {
          title: 'Langkah 2: COVER (Lindungi Kepala & Leher)',
          body: 'Gunakan satu tangan untuk melindungi bagian belakang kepala dan leher. Jika memungkinkan, merayaplah ke bawah meja kerja atau meja makan yang kokoh. Jika tidak ada meja di dekat Anda, merapatlah ke dinding bagian dalam ruangan yang jauh dari kaca dan jendela.',
          tipBox: {
            title: 'Perhatian Khusus Di Tempat Tidur',
            text: 'Jika gempa terjadi saat Anda tidur, tetaplah di atas ranjang! Balikkan badan tengkurap dan tutupi kepala serta leher dengan bantal tebal. Bergerak di kegelapan kamar tidur berisiko tinggi menginjak pecahan kaca atau tertimpa lemari pakaian.'
          }
        },
        {
          title: 'Langkah 3: HOLD ON (Pegang Erat Kaki Meja)',
          body: 'Pegang erat kaki meja dengan satu tangan, sementara tangan yang lain tetap melindungi kepala. Ikuti pergerakan meja jika meja bergeser akibat getaran, hingga guncangan benar-benar reda dan aman untuk bergerak keluar.',
          highlights: [
            'Tunggu hingga getaran benar-benar berhenti selama minimal 60 detik sebelum mengevakuasi diri.',
            'Waspadai gempa susulan (aftershocks) yang sering kali menyusul dalam selang beberapa menit.'
          ]
        }
      ]
    }
  },
  {
    id: 'artikel-tas-siaga',
    category: 'Kesiapsiagaan',
    title: 'Anatomi Tas Siaga Bencana (72-Hour Survival Grab Bag): Apa Saja yang Wajib Dimiliki?',
    excerpt: '72 jam pertama pascabencana adalah periode krusial sebelum bantuan logistik menjangkau lokasi Anda. Pastikan setiap rumah tangga memiliki tas darurat siap bawa.',
    author: 'Tim Logistik Kemanusiaan SEISMORA',
    source: 'Pedoman Siaga Bencana BNPB 2026',
    readTime: '7 menit baca',
    date: '9 November 2026',
    badgeColor: 'blue',
    content: {
      lead: 'Tas Siaga Bencana (Emergency Grab Bag) adalah ransel tahan air yang berisi perbekalan darurat esensial untuk bertahan mandiri selama minimal 3 hari (72 jam) ketika fasilitas listrik, air bersih, perbankan, dan supermarket terputus.',
      sections: [
        {
          title: '1. Kebutuhan Hidup Dasar (Air & Nutrisi)',
          body: 'Manusia dapat bertahan berminggu-minggu tanpa makanan, tetapi hanya 3 hari tanpa air. Bawa botol air mineral bersegel minimal 3 liter per anggota keluarga, serta makanan berkalori tinggi yang tahan lama dan tidak memerlukan proses memasak rumit.',
          highlights: [
            'Biskuit energi / energi bar militer (MRE).',
            'Makanan kaleng dengan bukaan putar (ring-pull) tanpa memerlukan pembuka kaleng.',
            'Tablet pemurni air (chlorine dioxide) untuk sterilisasi sumber air darurat.'
          ]
        },
        {
          title: '2. Pertolongan Pertama (First Aid Kit) & Obat Khusus',
          body: 'Kotak P3K standar wajib memuat perban kasa steril, antiseptik povidone iodine, plester luka, gunting lipat, sarung tangan lateks, serta obat-obatan rutin bagi anggota keluarga dengan riwayat penyakit kronis (asma, diabetes, hipertensi).',
          tipBox: {
            title: 'Tips Penempatan Tas',
            text: 'Letakkan Tas Siaga di dekat pintu keluar utama rumah atau di garasi kendaraan. Jangan simpan di dalam lemari kamar yang terkunci atau di bawah tumpukan barang lain!'
          }
        },
        {
          title: '3. Peralatan Taktis & Komunikasi Darurat',
          body: 'Saat jaringan BTS seluler tumbang dan pemadaman listrik total melanda, alat komunikasi analog menjadi satu-satunya penghubung Anda dengan instruksi resmi pemerintah.',
          highlights: [
            'Radio saku transistor FM/AM baterai untuk mendengarkan siaran darurat BMKG & RRI.',
            'Senter LED bertenaga baterai atau dynamo engkol tangan (hand-crank).',
            'Peluit darurat berdaya suara nyaring (120 desibel) untuk memberi sinyal posisi Anda kepada tim SAR jika terperangkap.',
            'Salinan berkas penting (KTP, sertifikat tanah, polis asuransi) yang disimpan dalam kantung ziplock plastik kedap air.'
          ]
        }
      ]
    }
  },
  {
    id: 'artikel-p-wave-detection',
    category: 'Teknologi',
    title: 'Bagaimana Sistem Deteksi Dini Bekerja? Membedah Keajaiban Gelombang P-Wave & S-Wave',
    excerpt: 'Bagaimana BMKG dan sensor seismik global dapat membunyikan sirine peringatan sebelum tanah berguncang keras? Pahami hukum fisika di balik kecepatan rambat gelombang bumi.',
    author: 'Divisi Instrumentasi & Sensor SEISMORA',
    source: 'Japan Meteorological Agency (JMA) & BMKG Inatews',
    readTime: '6 menit baca',
    date: '8 November 2026',
    badgeColor: 'emerald',
    content: {
      lead: 'Banyak orang mengira peringatan dini gempa adalah alat peramal masa depan. Faktanya, teknologi ini tidak memprediksi kapan gempa terjadi, melainkan memanfaatkan selisih kecepatan rambat antara dua gelombang mekanik yang tercipta bersamaan di hiposentrum.',
      sections: [
        {
          title: '1. Gelombang Primer (P-Wave) yang Cepat Namun Lembut',
          body: 'Ketika patahan batuan pecah di kedalaman, energi dilepaskan secara serentak. Gelombang pertama yang tiba di sensor adalah Gelombang Primer (P-Wave) yang merambat dengan kecepatan fantastis antara 5 hingga 8 kilometer per detik. Gelombang kompresi ini hanya menimbulkan getaran ringan yang sering kali tidak disadari manusia.',
          highlights: [
            'Kecepatan rambat P-Wave: ~6.000 m/detik.',
            'Sifat gelombang: Longitudinal (maju-mundur searah rambatan).',
            'Sensor akselerograf BMKG mendeteksi gelombang ini dalam hitungan pecahan detik.'
          ]
        },
        {
          title: '2. Gelombang Sekunder (S-Wave) yang Lambat Namun Merusak',
          body: 'Di belakang P-Wave, merambat Gelombang Sekunder (S-Wave) dengan kecepatan lebih santai: 3.5 hingga 4.5 kilometer per detik. Gelombang geser transversal ini mengguncang struktur tanah ke kiri-kanan dan atas-bawah dengan amplitudo besar. Inilah gelombang yang meruntuhkan dinding gedung dan membelah aspal jalan.',
          highlights: [
            'Kecepatan rambat S-Wave: ~3.800 m/detik.',
            'Selisih kecepatan rambat menciptakan rentang waktu emas (golden window) antara 10 hingga 60 detik!'
          ],
          tipBox: {
            title: 'Jendela Emas Penyelamatan',
            text: 'Karena sinyal transmisi radio dan internet berkecepatan cahaya (300.000 km/s), data deteksi P-Wave dapat dikirimkan ke ponsel Anda jauh lebih cepat daripada kedatangan gelombang S-Wave yang merambat lewat batuan bumi!'
          }
        },
        {
          title: '3. Tindakan Otomatis Sistem Cerdas Modern',
          body: 'Dalam waktu 15 detik peringatan dini, sistem otomasi pintar kota dapat: memutus aliran gas kota untuk mencegah kebakaran masal, menghentikan kereta cepat secara otomatis, membuka pintu gerbang otomatis, serta memposisikan lift ke lantai terdekat dengan pintu terbuka.'
        }
      ]
    }
  },
  {
    id: 'artikel-rute-evakuasi',
    category: 'Evakuasi',
    title: 'Navigasi Zona Aman: Cara Menentukan Rute Evakuasi & Menghindari Titik Runtuhan Kota',
    excerpt: 'Evakuasi bukan sekadar berlari keluar pintu. Ketahui bahaya tak kasat mata di jalanan kota—kabel listrik putus, jembatan retak, dinding fasad kaca—dan pilih titik kumpul aman.',
    author: 'Perencana Tata Ruang Bencana SEISMORA',
    source: 'FEMA Safe Assembly Guidelines & BPBD',
    readTime: '5 menit baca',
    date: '7 November 2026',
    badgeColor: 'emerald',
    content: {
      lead: 'Saat gempa besar mengguncang kawasan perkotaan, bahaya terbesar di luar ruangan justru berasal dari lingkungan binaan buatan manusia: pecahan kaca gedung bertingkat, papan reklame yang roboh, tiang trafo listrik, dan retakan sesar jalan raya.',
      sections: [
        {
          title: '1. Kriteria Titik Kumpul (Assembly Point) yang Sebenarnya',
          body: 'Titik kumpul yang aman bukanlah sembarang lapangan parkir. Lapangan terbuka harus memiliki jarak aman (buffer zone) minimal 1.5 kali tinggi bangunan tertinggi di sekitarnya. Ini untuk menjamin jika gedung roboh ke samping, materialnya tidak mencapai kerumunan warga.',
          highlights: [
            'Stadion olahraga terbuka, alun-alun kota, dan taman rekreasi hijau.',
            'Hindari area yang berdekatan dengan SPBU, pipa transmisi gas, atau tangki kimia industri.',
            'Pastikan akses masuk dan keluar memiliki sedikitnya dua pintu bebas hambatan.'
          ]
        },
        {
          title: '2. Bahaya Mematikan Saat Berjalan di Koridor Kota',
          body: 'Banyak korban berjatuhan di jalan raya akibat bahaya sekunder yang luput dari perhitungan:',
          highlights: [
            'Kabel Listrik Tegangan Tinggi: Getaran gempa sering memutuskan kabel PLN. Jangan pernah mendekati genangan air atau kabel yang menjuntai di tanah.',
            'Patahan Jalan & Lubang Sinkhole: Struktur jalan di atas tanah timbunan rentan amblas. Berjalanlah dengan memperhatikan permukaan aspal secara saksama.',
            'Jembatan Penyeberangan & Flyover: Hindari berteduh di bawah jembatan layang atau overpass karena rawan kegagalan sambungan ekspansi.'
          ],
          tipBox: {
            title: 'Prinsip Evakuasi Menggunakan Kaki',
            text: 'Evakuasi gempa BUMI WAJIB DILAKUKAN DENGAN BERJALAN KAKI CEPAT! Penggunaan mobil atau sepeda motor hanya akan memicu kemacetan total (gridlock) di persimpangan jalan dan menghalangi laju armada pemadam kebakaran serta ambulans gawat darurat.'
          }
        }
      ]
    }
  }
];
