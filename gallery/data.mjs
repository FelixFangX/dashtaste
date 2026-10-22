// Fictional fixtures. A fixed seed keeps both variants and every build identical.
let seed = 7321;
const random = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
const trend = (n, base, step) =>
  Array.from({ length: n }, (_, i) => Math.round(base + i * step + random() * base * 0.14));
export const data = {
  saas: {
    months: Array.from(
      { length: 18 },
      (_, i) => `${2025 + Math.floor((i + 5) / 12)}-${String(((i + 5) % 12) + 1).padStart(2, '0')}`,
    ),
    revenue: trend(18, 180000, 8200),
    added: trend(18, 12000, 450),
    churned: trend(18, 4200, 100),
    parts: [42, 28, 14, 7, 4, 3, 2],
    ranks: trend(5, 120, 90).reverse(),
  },
  finance: {
    months: Array.from(
      { length: 12 },
      (_, i) =>
        `${2025 + Math.floor((i + 10) / 12)}-${String(((i + 10) % 12) + 1).padStart(2, '0')}`,
    ),
    revenue: trend(12, 620000, 18000),
    expense: trend(12, 420000, 9000),
    margin: trend(12, 62, 0.5),
    parts: [38, 24, 16, 9, 6, 4, 3],
    ranks: [182000, 96000, 74000, 58000, 32000],
  },
  store: {
    months: Array.from({ length: 30 }, (_, i) => `09-${String(i + 1).padStart(2, '0')}`),
    revenue: trend(30, 68000, 1200),
    rate: trend(30, 280, 3).map((v) => v / 100),
    parts: [38, 27, 16, 8, 5, 4, 2],
    ranks: trend(10, 42000, 14000).reverse(),
  },
  live: {
    months: Array.from({ length: 19 }, (_, i) => `${String(i).padStart(2, '0')}:00`),
    revenue: trend(19, 120000, 64000),
    yesterday: trend(19, 100000, 44000),
    parts: [48, 20, 12, 8, 5, 4, 3],
    ranks: trend(5, 520000, 130000).reverse(),
    regions: trend(12, 220000, 32000),
  },
};
export const dashboards = [
  { name: 'saas', pack: 'global', mode: 'light', width: 1440, height: 900 },
  { name: 'finance', pack: 'global', mode: 'dark', width: 1440, height: 900 },
  { name: 'store', pack: 'cn', mode: 'light', width: 1440, height: 900 },
  { name: 'live', pack: 'cn', mode: 'dark', width: 1920, height: 1080 },
];

export const kpisFor = (name) =>
  name === 'saas'
    ? [
        ['MRR', 328240, 'money'],
        ['Net new MRR', 18640, 'money'],
        ['Churn', 0.021, 'percent'],
        ['Active accounts', 1842, 'number'],
      ]
    : name === 'finance'
      ? [
          ['Revenue', 864200, 'money'],
          ['Gross margin', 0.684, 'percent'],
          ['Cash balance', 3240000, 'money'],
          ['Runway', 18.4, 'months'],
        ]
      : name === 'store'
        ? [
            ['成交金额', 2641800, 'money'],
            ['访客数', 246280, 'number'],
            ['支付转化率', 0.0382, 'percent'],
            ['客单价', 280.81, 'money'],
          ]
        : [
            ['成交金额', 12864000, 'money'],
            ['支付订单', 42880, 'number'],
            ['实时访客', 186420, 'number'],
            ['支付转化率', 0.046, 'percent'],
            ['客单价', 300, 'money'],
            ['退款金额', 182400, 'money'],
          ];

data.saas.plans = [42000, 78000, 92000, 82000, 18240, 10000, 6000];
data.saas.planNames = [
  'Starter',
  'Standard',
  'Advanced',
  'Enterprise',
  'Education',
  'Community',
  'Legacy',
];
