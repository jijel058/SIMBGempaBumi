import { jsPDF } from 'jspdf';

export function generateMitigationGuidePDF(): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Background Banner (Emerald green)
  doc.setFillColor(5, 150, 105); // #059669
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('SEISMORA', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Buku Panduan Kesiapsiagaan & Mitigasi Gempa Bumi', 14, 26);
  doc.setFontSize(9);
  doc.text('Sesuai Standar BNPB & BMKG | www.seismora.org', 14, 33);

  // Section 1: SEBELUM GEMPA (Preparedness)
  let y = 52;
  doc.setTextColor(4, 120, 87); // #047857
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('1. FASE SEBELUM GEMPA (PRABENCANA)', 14, y);

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  y += 7;
  const beforePoints = [
    '• Periksa Struktur Bangunan: Pastikan plafon, dinding, dan pondasi rumah dalam kondisi kokoh.',
    '• Kencangkan Perabotan Berat: Lemari, rak buku, dan pemanas air wajib dibaut ke dinding.',
    '• Kenali Jalur Evakuasi: Tentukan rute keluar teraman dari rumah, sekolah, atau gedung kerja.',
    '• Siapkan Tas Siaga Bencana (TSB): Tempatkan di area yang mudah diraih dekat pintu keluar.',
    '• Kuasai Titik Aman: Identifikasi meja kokoh di setiap ruangan untuk berlindung.',
    '• Matikan Utilitas: Ketahui cara mematikan keran utama gas dan panel pemutus listrik (MCB).'
  ];
  beforePoints.forEach(pt => {
    doc.text(pt, 16, y);
    y += 6;
  });

  // Section 2: SAAT GEMPA (Drop, Cover, Hold On)
  y += 6;
  doc.setTextColor(220, 38, 38); // Warning Red
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('2. FASE SAAT GEMPA TERJADI (TANGGAP DARURAT)', 14, y);

  y += 7;
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(14, y - 4, pageWidth - 28, 38, 3, 3, 'F');
  doc.setTextColor(185, 28, 28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TIGA LANGKAH EMAS: DROP, COVER, HOLD ON!', 18, y + 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(75, 85, 99);
  doc.text('1. DROP: Segera merunduk dan jatuhkan tubuh ke lantai sebelum gempa menjatuhkan Anda.', 18, y + 9);
  doc.text('2. COVER: Lindungi kepala & leher dengan lengan atau berlindung di bawah meja yang kuat.', 18, y + 16);
  doc.text('3. HOLD ON: Pegang kaki meja erat-erat hingga guncangan benar-benar reda.', 18, y + 23);
  doc.text('PENTING: JANGAN gunakan lift! Jauhi jendela kaca, cermin, dan perabot yang bisa tumbang.', 18, y + 30);

  y += 44;

  // Section 3: SETELAH GEMPA (Post-Disaster)
  doc.setTextColor(4, 120, 87);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('3. FASE SETELAH GEMPA TERJADI (PASCABENCANA)', 14, y);

  y += 7;
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const afterPoints = [
    '• Evakuasi Tertib: Gunakan tangga darurat. Jangan tergesa-gesa atau saling dorong.',
    '• Waspadai Gempa Susulan (Aftershocks): Tetap waspada di titik kumpul terbuka.',
    '• Periksa Bahaya Sekunder: Jangan menyalakan korek/listrik jika tercium bau gas.',
    '• Peringatan Tsunami Alami: Jika berada di dekat pantai dan merasakan guncangan kuat',
    '  atau air laut surut tiba-tiba, SEGERA lari ke dataran tinggi tanpa menunggu sirine resmi!',
    '• Dengar Informasi Resmi: Pantau rilis terkini dari BMKG dan BNPB, abaikan rumor hoaks.'
  ];
  afterPoints.forEach(pt => {
    doc.text(pt, 16, y);
    y += 6;
  });

  // Emergency Hotlines Box
  y += 6;
  doc.setFillColor(240, 253, 244); // mint/emerald-50
  doc.roundedRect(14, y, pageWidth - 28, 28, 3, 3, 'F');
  doc.setTextColor(4, 120, 87);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('NOMOR PANGGILAN DARURAT RESMI INDONESIA', 18, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text('• Call Center BMKG: 196', 18, y + 14);
  doc.text('• BNPB (Bencana): 117', 75, y + 14);
  doc.text('• Basarnas (SAR): 115', 135, y + 14);
  doc.text('• Ambulans: 118 / 119', 18, y + 21);
  doc.text('• Pemadam: 113', 75, y + 21);
  doc.text('• Polisi: 110', 135, y + 21);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Dokumen ini digenerate secara otomatis oleh Platform SEISMORA — Know the Earth, Understand the Risk.', 14, 285);

  doc.save('SEISMORA_Panduan_Mitigasi_Gempa_Bumi.pdf');
}

