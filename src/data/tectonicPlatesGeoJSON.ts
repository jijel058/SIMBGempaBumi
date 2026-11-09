// Tectonic plate boundaries and Ring of Fire coordinates for Leaflet and 3D globe visualization
export interface PlateFeature {
  name: string;
  type: string;
  color: string;
  coordinates: [number, number][]; // [lat, lng]
}

export const TECTONIC_PLATES: PlateFeature[] = [
  {
    name: "Cincin Api Pasifik (Pacific Ring of Fire)",
    type: "Subduction Zone / Ring of Fire",
    color: "#ef4444",
    coordinates: [
      [-45, 168], [-38, 178], [-20, -175], [-15, -173],
      [-5, 155], [0, 140], [15, 145], [30, 140],
      [35, 140], [45, 150], [55, 165], [60, -170],
      [55, -160], [50, -130], [38, -123], [30, -115],
      [15, -100], [5, -80], [-10, -78], [-25, -70],
      [-40, -74], [-55, -70]
    ]
  },
  {
    name: "Lempeng Indo-Australia (Indo-Australian Plate)",
    type: "Plate Boundary",
    color: "#10b981",
    coordinates: [
      [-10, 60], [-10, 80], [-5, 95], [-8, 105],
      [-10, 115], [-11, 125], [-10, 140], [-25, 165],
      [-45, 168], [-55, 150], [-55, 90], [-40, 60],
      [-10, 60]
    ]
  },
  {
    name: "Lempeng Eurasia (Eurasian Plate)",
    type: "Plate Boundary",
    color: "#059669",
    coordinates: [
      [35, -10], [40, 15], [38, 30], [35, 60],
      [30, 80], [25, 95], [15, 105], [5, 105],
      [7, 117], [18, 120], [30, 122], [40, 130],
      [60, 150], [70, 170], [70, 30], [60, -10],
      [35, -10]
    ]
  },
  {
    name: "Lempeng Pasifik (Pacific Plate)",
    type: "Plate Boundary",
    color: "#3b82f6",
    coordinates: [
      [55, 165], [60, -170], [50, -130], [38, -123],
      [20, -110], [5, -85], [-20, -115], [-45, -120],
      [-55, -140], [-60, 170], [-45, 168], [-20, -175],
      [-5, 155], [15, 145], [35, 140], [55, 165]
    ]
  },
  {
    name: "Megathrust Sunda (Sunda Megathrust Fault)",
    type: "Subduction Fault",
    color: "#f97316",
    coordinates: [
      [6, 93], [3, 95], [0, 98], [-3, 100],
      [-6, 103], [-7.5, 106], [-8.5, 110], [-9, 115],
      [-9.5, 120], [-10, 125], [-9, 130]
    ]
  },
  {
    name: "Sesar Semangko / Great Sumatran Fault",
    type: "Strike-Slip Fault",
    color: "#eab308",
    coordinates: [
      [5.5, 95.3], [4.0, 96.5], [2.0, 98.5], [0.5, 100.0],
      [-1.5, 101.5], [-3.5, 103.0], [-5.0, 104.5], [-5.8, 105.5]
    ]
  },
  {
    name: "Sesar Lembang & Cimandiri (Jawa Barat)",
    type: "Active Crustal Fault",
    color: "#eab308",
    coordinates: [
      [-6.8, 106.8], [-6.82, 107.1], [-6.81, 107.4], [-6.8, 107.7], [-6.85, 108.1]
    ]
  },
  {
    name: "Sesar Palu-Koro (Sulawesi)",
    type: "Strike-Slip Fault",
    color: "#f43f5e",
    coordinates: [
      [-0.5, 119.8], [-0.9, 119.85], [-1.4, 120.0], [-1.9, 120.3], [-2.5, 120.7], [-3.2, 121.2]
    ]
  },
  {
    name: "Sesar San Andreas (California, USA)",
    type: "Transform Fault",
    color: "#eab308",
    coordinates: [
      [40.3, -124.3], [38.5, -123.0], [37.2, -122.0], [35.5, -119.8], [33.8, -116.5], [32.5, -115.3]
    ]
  }
];

export const MAJOR_TECTONIC_ZONES = [
  {
    name: "Zona Subduksi Lempeng Sunda - Indo-Australia",
    description: "Zona tempat lempeng samudra Indo-Australia menunjam ke bawah lempeng benua Eurasia (Sunda), menghasilkan palung Jawa dan busur vulkanik aktif.",
    hazardLevel: "Tinggi (Megathrust M8.5+)",
    region: "Sumatera, Jawa, Bali, Nusa Tenggara"
  },
  {
    name: "Zona Busur Pasifik Barat (Ring of Fire)",
    description: "Zona seismik paling aktif di dunia yang membentang dari Selandia Baru, Filipina, Jepang, hingga semenanjung Kamchatka.",
    hazardLevel: "Sangat Tinggi",
    region: "Pasifik Barat & Asia Timur"
  },
  {
    name: "Zona Sesar Transkuren San Andreas",
    description: "Batas lempeng geser (transform) antara Lempeng Pasifik dan Lempeng Amerika Utara.",
    hazardLevel: "Tinggi",
    region: "California, Amerika Serikat"
  },
  {
    name: "Zona Tumbukan Himalaya (Continental Collision)",
    description: "Tumbukan lempeng benua India ke dalam lempeng Eurasia yang terus mendorong pegunungan Himalaya ke atas.",
    hazardLevel: "Tinggi",
    region: "Asia Selatan & Pegunungan Himalaya"
  }
];

