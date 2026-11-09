import { Earthquake } from '../types/earthquake';

// Rich fallback dataset of recent significant global & BMKG earthquakes
export const FALLBACK_EARTHQUAKES: Earthquake[] = [
  {
    id: "bmkg-20261104-01",
    source: "BMKG",
    externalId: "20261104052011",
    magnitude: 5.6,
    location: "84 km BaratDaya BAYAH-BANTEN",
    latitude: -7.62,
    longitude: 106.12,
    depth: 18,
    time: Date.now() - 1000 * 60 * 35, // 35 mins ago
    tsunami: false,
    status: "CONFIRMED",
    alert: "yellow",
    felt: 850,
    dirasakan: "IV Pelabuhan Ratu, III Bayah, III Sukabumi, II Jakarta",
    url: "https://bmkg.go.id"
  },
  {
    id: "usgs-20261104-02",
    source: "USGS",
    externalId: "us7000m9kx",
    magnitude: 6.4,
    location: "112 km ENE of Hualien City, Taiwan",
    latitude: 24.25,
    longitude: 122.68,
    depth: 24,
    time: Date.now() - 1000 * 60 * 85, // 1.4 hours ago
    tsunami: false,
    status: "reviewed",
    alert: "orange",
    felt: 1420,
    significance: 680,
    url: "https://earthquake.usgs.gov/earthquakes/eventpage/us7000m9kx"
  },
  {
    id: "bmkg-20261104-03",
    source: "BMKG",
    externalId: "20261104021500",
    magnitude: 4.8,
    location: "42 km TimurLaut BUKITTINGGI-SUMBAR",
    latitude: -0.12,
    longitude: 100.58,
    depth: 10,
    time: Date.now() - 1000 * 60 * 180, // 3 hours ago
    tsunami: false,
    status: "CONFIRMED",
    alert: "yellow",
    felt: 340,
    dirasakan: "III Bukittinggi, II Padang Panjang",
    url: "https://bmkg.go.id"
  },
  {
    id: "usgs-20261104-04",
    source: "USGS",
    externalId: "us7000m9jw",
    magnitude: 7.2,
    location: "South of the Fiji Islands (Tonga Trench)",
    latitude: -22.45,
    longitude: -179.82,
    depth: 540,
    time: Date.now() - 1000 * 60 * 320, // 5.3 hours ago
    tsunami: 1, // Potential alert checked
    status: "reviewed",
    alert: "red",
    felt: 65,
    significance: 840,
    url: "https://earthquake.usgs.gov"
  },
  {
    id: "usgs-20261104-05",
    source: "USGS",
    externalId: "us7000m9it",
    magnitude: 5.1,
    location: "Off the coast of Miyagi, Japan",
    latitude: 38.41,
    longitude: 142.15,
    depth: 42,
    time: Date.now() - 1000 * 60 * 450, // 7.5 hours ago
    tsunami: false,
    status: "reviewed",
    alert: "green",
    felt: 512,
    significance: 420,
    url: "https://earthquake.usgs.gov"
  },
  {
    id: "bmkg-20261104-06",
    source: "BMKG",
    externalId: "20261103213000",
    magnitude: 5.2,
    location: "128 km BaratLaut KEP-ARU-MALUKU",
    latitude: -5.18,
    longitude: 133.42,
    depth: 25,
    time: Date.now() - 1000 * 60 * 600, // 10 hours ago
    tsunami: false,
    status: "CONFIRMED",
    alert: "yellow",
    felt: 90,
    dirasakan: "II Dobo",
    url: "https://bmkg.go.id"
  },
  {
    id: "usgs-20261104-07",
    source: "USGS",
    externalId: "nc74012981",
    magnitude: 3.8,
    location: "7 km WNW of Cobb, California, USA",
    latitude: 38.84,
    longitude: -122.80,
    depth: 2.1,
    time: Date.now() - 1000 * 60 * 720, // 12 hours ago
    tsunami: false,
    status: "automatic",
    alert: "green",
    felt: 110,
    significance: 220,
    url: "https://earthquake.usgs.gov"
  },
  {
    id: "usgs-20261104-08",
    source: "USGS",
    externalId: "us7000m9hg",
    magnitude: 5.9,
    location: "Antofagasta, Northern Chile",
    latitude: -23.65,
    longitude: -68.90,
    depth: 104,
    time: Date.now() - 1000 * 60 * 900, // 15 hours ago
    tsunami: false,
    status: "reviewed",
    alert: "yellow",
    felt: 780,
    significance: 530,
    url: "https://earthquake.usgs.gov"
  },
  {
    id: "bmkg-20261104-09",
    source: "BMKG",
    externalId: "20261103141000",
    magnitude: 4.5,
    location: "28 km BaratDaya KAB-BANTUL-DIY",
    latitude: -8.08,
    longitude: 110.31,
    depth: 14,
    time: Date.now() - 1000 * 60 * 1150, // 19 hours ago
    tsunami: false,
    status: "CONFIRMED",
    alert: "green",
    felt: 420,
    dirasakan: "II-III Bantul, II Kulonprogo, II Sleman",
    url: "https://bmkg.go.id"
  },
  {
    id: "usgs-20261104-10",
    source: "USGS",
    externalId: "us7000m9fa",
    magnitude: 5.4,
    location: "Eastern Mediterranean Sea, Crete, Greece",
    latitude: 35.12,
    longitude: 25.85,
    depth: 15,
    time: Date.now() - 1000 * 60 * 1380, // 23 hours ago
    tsunami: false,
    status: "reviewed",
    alert: "yellow",
    felt: 920,
    significance: 460,
    url: "https://earthquake.usgs.gov"
  },
  {
    id: "usgs-20261104-11",
    source: "USGS",
    externalId: "us7000m9e5",
    magnitude: 6.8,
    location: "Near the East Coast of Honshu, Japan",
    latitude: 37.95,
    longitude: 142.80,
    depth: 35,
    time: Date.now() - 1000 * 60 * 60 * 36, // 1.5 days ago
    tsunami: 1,
    status: "reviewed",
    alert: "orange",
    felt: 2850,
    significance: 760,
    url: "https://earthquake.usgs.gov"
  },
  {
    id: "bmkg-20261104-12",
    source: "BMKG",
    externalId: "20261102081520",
    magnitude: 6.1,
    location: "155 km BaratLaut JAILOLO-MALUT",
    latitude: 1.85,
    longitude: 126.75,
    depth: 48,
    time: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
    tsunami: false,
    status: "CONFIRMED",
    alert: "orange",
    felt: 560,
    dirasakan: "III Manado, III Bitung, II Ternate",
    url: "https://bmkg.go.id"
  },
  {
    id: "usgs-20261104-13",
    source: "USGS",
    externalId: "us7000m9cx",
    magnitude: 7.7,
    location: "Kahramanmaras, Southern Turkey (Historical Ref)",
    latitude: 37.17,
    longitude: 37.03,
    depth: 10,
    time: Date.now() - 1000 * 60 * 60 * 72, // 3 days ago
    tsunami: false,
    status: "reviewed",
    alert: "red",
    felt: 15400,
    significance: 1100,
    url: "https://earthquake.usgs.gov"
  },
  {
    id: "usgs-20261104-14",
    source: "USGS",
    externalId: "us7000m9ba",
    magnitude: 5.7,
    location: "Reykjanes Ridge, Iceland",
    latitude: 63.85,
    longitude: -22.45,
    depth: 6,
    time: Date.now() - 1000 * 60 * 60 * 96, // 4 days ago
    tsunami: false,
    status: "reviewed",
    alert: "yellow",
    felt: 4100,
    significance: 510,
    url: "https://earthquake.usgs.gov"
  },
  {
    id: "bmkg-20261104-15",
    source: "BMKG",
    externalId: "20261031123456",
    magnitude: 4.9,
    location: "65 km BaratDaya KAB-CIANJUR-JABAR",
    latitude: -7.25,
    longitude: 107.05,
    depth: 8,
    time: Date.now() - 1000 * 60 * 60 * 120, // 5 days ago
    tsunami: false,
    status: "CONFIRMED",
    alert: "yellow",
    felt: 1820,
    dirasakan: "IV Cianjur, III Sukabumi, II Bogor",
    url: "https://bmkg.go.id"
  }
];

