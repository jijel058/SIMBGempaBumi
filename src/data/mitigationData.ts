import { MitigationItem } from '../types/mitigation';

export const MITIGATION_CHECKLIST_DATA: MitigationItem[] = [
  // SEBELUM GEMPA (Prabencana)
  {
    id: 'check-1',
    category: 'before',
    title: 'Kencangkan Perabotan Berat ke Dinding',
    description: 'Pasang siku L (bracket) dan dynabolt pada lemari pakaian, rak buku tinggi, dispenser, dan pemanas air.',
    priority: 'high',
    icon: 'Hammer'
  },
  {
    id: 'check-2',
    category: 'before',
    title: 'Siapkan Tas Siaga Bencana (TSB) untuk Setiap Anggota Keluarga',
    description: 'Isi dengan air mineral, biskuit darurat, kotak P3K, senter, peluit, dan salinan identitas diri dalam wadah kedap air.',
    priority: 'high',
    icon: 'Backpack'
  },
  {
    id: 'check-3',
    category: 'before',
    title: 'Kenali Lokasi Katup Gas Utama dan Panel Listrik (MCB)',
    description: 'Pastikan seluruh anggota keluarga yang dewasa dapat mematikan aliran listrik dan regulator tabung elpiji dengan cepat.',
    priority: 'high',
    icon: 'Power'
  },
  {
    id: 'check-4',
    category: 'before',
    title: 'Tentukan Titik Kumpul Aman (Assembly Point)',
    description: 'Sepakati lapangan terbuka atau taman terdekat yang bebas dari jangkauan kabel tegangan tinggi dan pohon rindang.',
    priority: 'medium',
    icon: 'MapPin'
  },
  {
    id: 'check-5',
    category: 'before',
    title: 'Simpan Kontak Darurat di Ponsel & Catatan Fisik',
    description: 'Simpan hotline BMKG (196), BNPB (117), Basarnas (115), dan nomor tetangga terdekat.',
    priority: 'medium',
    icon: 'PhoneCall'
  },
  {
    id: 'check-6',
    category: 'before',
    title: 'Lakukan Latihan Simulasi Mandiri (Drill) Setiap 6 Bulan',
    description: 'Latih respon refleks Drop, Cover, and Hold On bersama keluarga atau rekan kerja di kantor.',
    priority: 'low',
    icon: 'Sparkles'
  },

  // SAAT GEMPA (Tanggap Darurat)
  {
    id: 'check-7',
    category: 'during',
    title: 'Lakukan Teknik "Drop, Cover, and Hold On"',
    description: 'Merunduk, lindungi kepala dan leher di bawah meja kokoh, lalu pegang erat kaki meja hingga guncangan mereda.',
    priority: 'high',
    icon: 'ShieldCheck'
  },
  {
    id: 'check-8',
    category: 'during',
    title: 'Jauhi Kaca Jendela, Cermin, dan Dinding Luar',
    description: 'Pecahan kaca akibat regangan struktur bangunan adalah penyebab cedera luka robek terbanyak saat gempa.',
    priority: 'high',
    icon: 'AlertTriangle'
  },
  {
    id: 'check-9',
    category: 'during',
    title: 'JANGAN Pernah Menggunakan Lift!',
    description: 'Gunakan tangga darurat. Jika sedang berada di dalam lift saat gempa, tekan semua tombol lantai dan segera keluar begitu pintu terbuka.',
    priority: 'high',
    icon: 'Ban'
  },
  {
    id: 'check-10',
    category: 'during',
    title: 'Bila Sedang Mengemudi: Tepikan Mobil di Tempat Lapang',
    description: 'Pasang lampu hazard, jauhi jembatan layang, papan baliho reklame, dan jaringan kabel listrik.',
    priority: 'medium',
    icon: 'Car'
  },

  // SETELAH GEMPA (Pascabencana)
  {
    id: 'check-11',
    category: 'after',
    title: 'Periksa Kebocoran Gas & Korsleting Listrik',
    description: 'Gunakan senter baterai, JANGAN gunakan korek api lilin atau menyalakan saklar bila tercium bau gas menyengat.',
    priority: 'high',
    icon: 'Flame'
  },
  {
    id: 'check-12',
    category: 'after',
    title: 'Waspadai Bahaya Gempa Susulan (Aftershocks)',
    description: 'Bangunan yang sudah retak bisa roboh pada gempa susulan berkekuatan lebih rendah. Tetap berada di luar hingga dinyatakan aman.',
    priority: 'high',
    icon: 'Radio'
  },
  {
    id: 'check-13',
    category: 'after',
    title: 'Prinsip 20-20-20 di Kawasan Pesisir Pantai (Evakuasi Mandiri)',
    description: 'Jika merasakan gempa lebih dari 20 detik di daerah pantai, segera evakuasi ke ketinggian minimal 20 meter tanpa menunggu sirine!',
    priority: 'high',
    icon: 'Waves'
  },
  {
    id: 'check-14',
    category: 'after',
    title: 'Cek Kondisi Fisik Diri Sendiri & Orang Sekitar',
    description: 'Berikan pertolongan pertama pada luka pendarahan sebelum meninggalkan bangunan secara tertib.',
    priority: 'medium',
    icon: 'HeartHandshake'
  }
];

