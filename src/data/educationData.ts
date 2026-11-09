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
    diagramType?: 'hypocenter' | 'waves' | 'faults' | 'liquefaction' | 'layers';
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
  }
];

