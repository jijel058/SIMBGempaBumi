import { BagItem } from '../types/games';

export const BAG_CHALLENGE_ITEMS: BagItem[] = [
  // ESSENTIALS
  {
    id: 'bag-water',
    name: 'Air Mineral Botol (3 Liter)',
    category: 'hydration_food',
    isEssential: true,
    weightKg: 3.0,
    explanation: 'Mutlak diperlukan. Dehidrasi dapat mengancam nyawa dalam waktu kurang dari 3 hari.',
    iconName: 'Droplets'
  },
  {
    id: 'bag-food',
    name: 'Makanan Kaleng & Biskuit Kalori',
    category: 'hydration_food',
    isEssential: true,
    weightKg: 1.5,
    explanation: 'Makanan siap santap tanpa perlu dimasak atau disimpan di lemari es untuk 72 jam pertama.',
    iconName: 'UtensilsCrossed'
  },
  {
    id: 'bag-p3k',
    name: 'Kotak P3K Lengkap & Obat Pribadi',
    category: 'first_aid',
    isEssential: true,
    weightKg: 0.8,
    explanation: 'Untuk merawat luka robek, antiseptik, perban kompres, dan obat rutin penyakit kronis.',
    iconName: 'HeartPulse'
  },
  {
    id: 'bag-flashlight',
    name: 'Senter LED & Baterai Cadangan',
    category: 'safety_tools',
    isEssential: true,
    weightKg: 0.4,
    explanation: 'Jaringan listrik hampir selalu padam saat gempa kuat. Hindari penggunaan lilin/api karena risiko kebocoran gas.',
    iconName: 'Flashlight'
  },
  {
    id: 'bag-whistle',
    name: 'Peluit Darurat (High-Decibel)',
    category: 'safety_tools',
    isEssential: true,
    weightKg: 0.05,
    explanation: 'Suara peluit merambat lebih jauh daripada teriakan dan menghemat energi bila Anda tertimbun reruntuhan.',
    iconName: 'Megaphone'
  },
  {
    id: 'bag-radio',
    name: 'Radio Baterai / Dinamo Portabel',
    category: 'safety_tools',
    isEssential: true,
    weightKg: 0.6,
    explanation: 'Sinyal seluler dan internet sering lumpuh. Gelombang radio AM/FM adalah kanal siaran darurat resmi BMKG/RRI.',
    iconName: 'Radio'
  },
  {
    id: 'bag-powerbank',
    name: 'Powerbank & Kabel Charger',
    category: 'safety_tools',
    isEssential: true,
    weightKg: 0.4,
    explanation: 'Menjaga baterai ponsel tetap menyala untuk mengirim koordinat SOS GPS saat sinyal pulih.',
    iconName: 'BatteryCharging'
  },
  {
    id: 'bag-mask',
    name: 'Masker Respirator (N95 / Debu)',
    category: 'first_aid',
    isEssential: true,
    weightKg: 0.1,
    explanation: 'Runtuhan bangunan menghasilkan debu silika dan semen pekat yang sangat berbahaya bagi paru-paru.',
    iconName: 'ShieldAlert'
  },
  {
    id: 'bag-docs',
    name: 'Fotokopi Dokumen Penting (Kedap Air)',
    category: 'documents',
    isEssential: true,
    weightKg: 0.3,
    explanation: 'KTP, KK, akta lahir, sertifikat tanah, dan polis asuransi dalam kantong ziplock tahan air.',
    iconName: 'FileCheck'
  },
  {
    id: 'bag-cash',
    name: 'Uang Tunai Pecahan Kecil',
    category: 'documents',
    isEssential: true,
    weightKg: 0.1,
    explanation: 'Mesin ATM dan pembayaran digital QRIS/kartu tidak berfungsi ketika listrik dan jaringan telekomunikasi mati.',
    iconName: 'Coins'
  },
  {
    id: 'bag-multitool',
    name: 'Pisau Lipat Multi-Fungsi / Multitool',
    category: 'safety_tools',
    isEssential: true,
    weightKg: 0.3,
    explanation: 'Alat serbaguna untuk memotong tali, membuka kaleng, memperbaiki perabot darurat.',
    iconName: 'Wrench'
  },
  {
    id: 'bag-blanket',
    name: 'Selimut Foil Termal Darurat',
    category: 'safety_tools',
    isEssential: true,
    weightKg: 0.15,
    explanation: 'Sangat ringan dan mampu memantulkan 90% panas tubuh untuk mencegah hipotermia di malam hari.',
    iconName: 'Flame'
  },

  // NON-ESSENTIALS (TRAPS)
  {
    id: 'bag-playstation',
    name: 'Konsol Game / Video Game Pad',
    category: 'non_essential',
    isEssential: false,
    weightKg: 2.2,
    explanation: 'Bukan prioritas evakuasi! Menambah beban berat dan membuang ruang tas berharga.',
    iconName: 'Gamepad2'
  },
  {
    id: 'bag-iron',
    name: 'Setrika Pakaian',
    category: 'non_essential',
    isEssential: false,
    weightKg: 1.8,
    explanation: 'Sama sekali tidak berguna dalam keadaan darurat tanpa pasokan listrik rumah tangga.',
    iconName: 'Shirt'
  },
  {
    id: 'bag-album',
    name: 'Album Foto Keluarga Tebal (10 kg)',
    category: 'non_essential',
    isEssential: false,
    weightKg: 4.5,
    explanation: 'Memori berharga sebaiknya di-scan digital ke cloud sebelumnya. Membawa fisik yang berat memperlambat evakuasi.',
    iconName: 'Image'
  },
  {
    id: 'bag-heels',
    name: 'Sepatu Hak Tinggi / High Heels',
    category: 'non_essential',
    isEssential: false,
    weightKg: 1.0,
    explanation: 'Sangat berbahaya di area reruntuhan penuh pecahan kaca dan puing tajam. Gunakan sepatu sneakers/safety sol tebal.',
    iconName: 'Footprints'
  },
  {
    id: 'bag-frying-pan',
    name: 'Wajan Penggorengan Besi Cor',
    category: 'non_essential',
    isEssential: false,
    weightKg: 3.5,
    explanation: 'Terlalu berat dan tidak praktis untuk pergerakan evakuasi jalan kaki.',
    iconName: 'Flame'
  },
  {
    id: 'bag-hairdryer',
    name: 'Pengering Rambut (Hairdryer)',
    category: 'non_essential',
    isEssential: false,
    weightKg: 1.2,
    explanation: 'Memerlukan daya listrik watt tinggi dan tidak memiliki fungsi keselamatan darurat.',
    iconName: 'Wind'
  }
];

