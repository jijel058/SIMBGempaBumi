import { MissionStep } from '../types/games';

export const EMERGENCY_MISSION_STEPS: MissionStep[] = [
  {
    id: 'step-home-1',
    scenarioTitle: 'Skenario 1: Gempa Tiba-tiba di Rumah (M 6.2)',
    environment: 'home',
    situation: 'Anda sedang berada di ruang keluarga di rumah lantai dua. Tiba-tiba lampu berkedip mati dan terdengar suara gemuruh keras diikuti guncangan hebat. Lemari pajangan mulai bergoyang miring. Apa tindakan Anda dalam 5 detik ini?',
    timerSeconds: 15,
    choices: [
      {
        id: 'c1',
        text: 'Segera lari kencang menuruni tangga menuju pintu depan rumah',
        isCorrect: false,
        feedback: 'BERBAHAYA! Berlari menuruni tangga saat lantai berguncang hebat hampir pasti membuat Anda jatuh tergelincir atau tertimpa plafon.',
        points: -15,
        nextStepId: 'step-home-2'
      },
      {
        id: 'c2',
        text: 'Lakukan Drop, Cover, and Hold On di bawah meja makan kayu kokoh',
        isCorrect: true,
        feedback: 'KEPUTUSAN SEMPURNA! Tubuh terlindung dari puing atap dan lampu yang rontok. Anda memegang kaki meja agar meja tidak bergeser.',
        points: 40,
        nextStepId: 'step-home-2'
      },
      {
        id: 'c3',
        text: 'Berdiri di dekat jendela kaca besar untuk meminta tolong tetangga',
        isCorrect: false,
        feedback: 'FATAL! Kaca jendela rentan pecah meledak ke arah dalam akibat regangan dinding dan melukai Anda parah.',
        points: -25,
        nextStepId: 'step-home-2'
      }
    ]
  },
  {
    id: 'step-home-2',
    scenarioTitle: 'Skenario 1 - Fase Pasca Guncangan',
    environment: 'home',
    situation: 'Guncangan utama berhenti setelah 35 detik. Anda mencium aroma gas elpiji yang samar dari arah dapur dan melihat dinding retak rambut. Apa yang Anda lakukan berikutnya?',
    timerSeconds: 20,
    choices: [
      {
        id: 'c4',
        text: 'Menyalakan saklar lampu dapur untuk melihat tabung gas dengan jelas',
        isCorrect: false,
        feedback: 'FATAL! Percikan api dari kontak saklar listrik dapat memicu ledakan gas seketika!',
        points: -35,
        nextStepId: 'step-highrise-1'
      },
      {
        id: 'c5',
        text: 'Tutup regulator tabung gas, ambil Tas Siaga Bencana, gunakan sepatu bersol tebal, lalu evakuasi ke titik kumpul terbuka',
        isCorrect: true,
        feedback: 'LUAR BIASA! Anda mengeliminasi risiko kebakaran, melindungi kaki dari beling kaca, dan membawa bekal bertahan hidup.',
        points: 45,
        nextStepId: 'step-highrise-1'
      },
      {
        id: 'c6',
        text: 'Duduk santai di sofa menunggu status gempa di medsos tanpa memeriksa kompor',
        isCorrect: false,
        feedback: 'RISKAN! Potensi bahaya kebakaran sekunder dan gempa susulan (aftershock) mengancam rumah yang sudah retak.',
        points: -10,
        nextStepId: 'step-highrise-1'
      }
    ]
  },
  {
    id: 'step-highrise-1',
    scenarioTitle: 'Skenario 2: Gempa Kuat di Gedung Bertingkat Lantai 14',
    environment: 'highrise',
    situation: 'Alarm gedung berbunyi histeris. Gedung berayun dengan amplitudo terasa cukup lebar. Semua orang panik. Seseorang berteriak menekan tombol Lift darurat. Bagaimana sikap Anda?',
    timerSeconds: 15,
    choices: [
      {
        id: 'c7',
        text: 'Ikut masuk ke dalam Lift karena lantai 14 terlalu lelah jika jalan kaki',
        isCorrect: false,
        feedback: 'SANGAT FATAL! Kabel lift dan pemutus daya gedung berisiko macet seketika, mengurung Anda di lorong lift tanpa ventilasi!',
        points: -40,
        nextStepId: 'step-vehicle-1'
      },
      {
        id: 'c8',
        text: 'Merunduk di dekat pilar penopang gedung menjauhi fasad kaca, tunggu guncangan reda, lalu evakuasi via TANGGA DARURAT darurat',
        isCorrect: true,
        feedback: 'SANGAT TEPAT! Tangga darurat dirancang memiliki ketahanan struktural dan proteksi asap khusus.',
        points: 45,
        nextStepId: 'step-vehicle-1'
      },
      {
        id: 'c9',
        text: 'Membuka jendela kaca darurat dan melompat',
        isCorrect: false,
        feedback: 'FATAL! Jangan pernah panik secara ekstrem.',
        points: -50,
        nextStepId: 'step-vehicle-1'
      }
    ]
  },
  {
    id: 'step-vehicle-1',
    scenarioTitle: 'Skenario 3: Sedang Mengemudikan Mobil di Jalan Raya',
    environment: 'vehicle',
    situation: 'Setir mobil mendadak terasa oleng seolah ban kempes di keempat sisi. Anda melihat tiang listrik dan pohon bergoyang liar ke kanan dan kiri. Gempa sedang berlangsung. Apa tindakan mengemudi Anda?',
    timerSeconds: 15,
    choices: [
      {
        id: 'c10',
        text: 'Injak pedal gas sedalam-dalamnya untuk melewati jembatan layang secepat mungkin',
        isCorrect: false,
        feedback: 'BERBAHAYA! Jembatan layang dan flyover rawan mengalami dislokasi sambungan ekspansi saat gempa.',
        points: -30
      },
      {
        id: 'c11',
        text: 'Kurangi kecepatan perlahan, pasang lampu hazard, tepikan kendaraan di bahu jalan jauh dari tiang/baliho/jembatan layang, dan tetap di dalam mobil hingga reda',
        isCorrect: true,
        feedback: 'SEMPURNA! Mobil adalah pelindung benturan yang baik dari runtuhan ringan, selama dijauhkan dari obyek tinggi yang bisa tumbang.',
        points: 45
      },
      {
        id: 'c12',
        text: 'Mengerem mendadak di tengah jalur cepat lalu keluar mobil meninggalkan kunci di dalam',
        isCorrect: false,
        feedback: 'RISKAN TABRAKAN BERUNTUN! Pengereman mendadak di tengah lajur membahayakan pengemudi di belakang Anda.',
        points: -20
      }
    ]
  }
];

