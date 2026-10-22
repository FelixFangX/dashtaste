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

const last = (series) => series.at(-1);
const sum = (series) => series.reduce((a, b) => a + b, 0);
// Each KPI has its own observed series; comparisons use the same aggregation
// as the displayed value. Store comparisons cover equal 30-day periods.
data.saas.added = data.saas.months.map((m, i) =>
  Math.round((13500 + i * 330) * (m.endsWith('-12') || m.endsWith('-08') ? 0.78 : 1)),
);
data.saas.expansion = data.saas.months.map((m, i) => (m === '2026-03' ? 37000 : 3200 + i * 140));
data.saas.churned = data.saas.months.map((m, i) => (m === '2026-04' ? 12500 : 4200 + i * 75));
data.saas.netNew = data.saas.added.map((v, i) => v + data.saas.expansion[i] - data.saas.churned[i]);
data.saas.revenue = data.saas.netNew.reduce((a, v) => [...a, (a.at(-1) || 145000) + v], []);
data.saas.accounts = trend(18, 1120, 43);
data.saas.churn = data.saas.churned.map((v, i) => v / data.saas.revenue[i]);
data.finance.revenue = data.finance.months.map((_, i) => 310000 + i * 9000);
data.finance.expense = data.finance.months.map(
  (m, i) => 465000 + i * 6500 + (m.endsWith('-12') ? 110000 : 0),
);
data.finance.burn = data.finance.expense.map((v, i) => v - data.finance.revenue[i]);
data.finance.funding = data.finance.months.map((m) => (m === '2026-04' ? 1500000 : 0));
data.finance.cash = data.finance.burn.reduce(
  (a, v, i) => [...a, (a.at(-1) || 3300000) - v + data.finance.funding[i]],
  [],
);
data.finance.runway = data.finance.cash.map(
  (v, i) => v / (sum(data.finance.burn.slice(Math.max(0, i - 2), i + 1)) / Math.min(i + 1, 3)),
);
data.finance.margin = data.finance.revenue.map((v, i) => (100 * (v - (105000 + i * 2700))) / v);
data.store.revenue = data.store.months.map((_, i) =>
  Math.round(
    (72000 + 3500 * Math.sin(i * 0.7)) *
      ([0, 6].includes(new Date(2026, 8, i + 1).getDay()) ? 1.25 : 1) *
      (i === 8 ? 2.2 : i === 16 ? 0.78 : 1),
  ),
);
data.store.visitors = trend(30, 6200, 92);
data.store.orders = data.store.visitors.map((v, i) => Math.round((v * data.store.rate[i]) / 100));
data.store.previous = {
  revenue: trend(30, 62000, 980),
  visitors: trend(30, 5900, 78),
  orders: trend(30, 165, 3),
};
data.store.yearAgo = {
  revenue: trend(30, 54000, 850),
  visitors: trend(30, 5100, 70),
  orders: trend(30, 142, 2),
};
const cumulative = (a) => {
  let n = 0;
  return a.map((v) => (n += v));
};
data.live.revenue = cumulative(
  allocate(
    [140, 170, 20, 12, 10, 9, 12, 17, 24, 40, 50, 65, 72, 80, 90, 100, 110, 120, 133],
    1274000,
  ),
);
data.live.yesterday = cumulative(
  allocate([60, 65, 35, 25, 22, 20, 24, 30, 35, 44, 52, 60, 65, 70, 75, 80, 90, 95, 100], 1132000),
);
data.live.orders = data.live.revenue.map((v, i) => Math.round(v / (278 + i * 1.2)));
data.live.visitors = trend(19, 14200, 11800);
data.live.refunds = trend(19, 1800, 740);
data.live.previousOrders = data.live.yesterday.map((v, i) => Math.round(v / (269 + i * 0.8)));
data.live.previousVisitors = trend(19, 13800, 10300);
data.live.previousRefunds = trend(19, 2100, 690);
data.live.ranks = trend(8, 42000, 17000).reverse();
const storeMetrics = (series) => {
  const revenue = sum(series.revenue),
    visitors = sum(series.visitors),
    orders = sum(series.orders);
  return [revenue, visitors, orders / visitors, revenue / orders];
};
const liveMetrics = (revenue, orders, visitors, refunds) => [
  last(revenue),
  last(orders),
  last(visitors),
  last(orders) / last(visitors),
  last(revenue) / last(orders),
  last(refunds),
];
export const kpisFor = (name) => {
  let labels, types, current, previous, yearAgo;
  if (name === 'saas' || name === 'finance') {
    const series =
      name === 'saas'
        ? [data.saas.revenue, data.saas.netNew, data.saas.churn, data.saas.accounts, data.saas.arpa]
        : [
            data.finance.revenue,
            data.finance.margin.map((v) => v / 100),
            data.finance.cash,
            data.finance.runway,
          ];
    labels =
      name === 'saas'
        ? ['MRR', 'Net new MRR', 'Churn', 'Active accounts', 'ARPA']
        : ['Revenue', 'Gross margin', 'Cash balance', 'Runway'];
    types =
      name === 'saas'
        ? ['money', 'money', 'percent', 'number', 'money']
        : ['money', 'percent', 'money', 'months'];
    current = series.map(last);
    previous = series.map((v) => v.at(-2));
  } else if (name === 'store') {
    labels = ['成交金额', '访客数', '支付转化率', '客单价', '退款率'];
    types = ['money', 'number', 'percent', 'money', 'percent'];
    current = [...storeMetrics(data.store), last(data.store.refundRate)];
    previous = [...storeMetrics(data.store.previous), last(data.store.previousRefundRate)];
    yearAgo = [...storeMetrics(data.store.yearAgo), last(data.store.yearAgoRefundRate)];
  } else {
    const d = data.live;
    labels = ['成交金额', '支付订单', '实时访客', '支付转化率', '客单价', '退款金额'];
    types = ['money', 'number', 'number', 'percent', 'money', 'money'];
    current = liveMetrics(d.revenue, d.orders, d.visitors, d.refunds);
    previous = liveMetrics(d.yesterday, d.previousOrders, d.previousVisitors, d.previousRefunds);
  }
  return labels.map((label, i) => [label, current[i], types[i], previous[i], yearAgo?.[i]]);
};

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

// Reconcile categorical breakdowns to their corresponding headline totals.
function allocate(weights, total) {
  const weight = sum(weights);
  const values = weights.map((v) => Math.floor((v / weight) * total));
  values[0] += total - sum(values);
  return values;
}
data.saas.plans = allocate(data.saas.plans, last(data.saas.revenue));
data.finance.ranks = allocate(data.finance.ranks, last(data.finance.expense));
data.live.regions = allocate(data.live.regions, last(data.live.revenue));

// Observed detail periods use the same fixed generator as the headline series.
data.saas.arpa = data.saas.revenue.map((v, i) => v / data.saas.accounts[i]);
data.store.refundRate = trend(30, 210, -0.6).map((v) => v / 10000);
data.store.previousRefundRate = trend(30, 245, -0.5).map((v) => v / 10000);
data.store.yearAgoRefundRate = trend(30, 270, -0.4).map((v) => v / 10000);
data.saas.previousPlans = data.saas.plans.map((v) => Math.round(v / (1.02 + random() * 0.09)));
data.finance.previousSpend = data.finance.ranks.map((v) =>
  Math.round(v / (0.94 + random() * 0.15)),
);
data.store.ranks = allocate(data.store.ranks, sum(data.store.revenue));
data.live.ranks = allocate(data.live.ranks, last(data.live.revenue));
data.store.previousRanks = data.store.ranks.map((v) => Math.round(v / (1.03 + random() * 0.15)));
data.live.previousRanks = data.live.ranks.map((v) => Math.round(v / (1.03 + random() * 0.15)));
data.store.channels = allocate(data.store.parts, sum(data.store.revenue));
data.live.regions = allocate([20, 16, 13, 11, 9, 8, 6, 5, 4, 3, 3, 2], last(data.live.revenue));
data.live.regionHourly = data.live.regions.map((v, i) =>
  allocate(
    Array.from(
      { length: 19 },
      (_, h) =>
        20 + 70 * Math.exp(-((h - ((i % 5) + 12)) ** 2) / 12) + (h < 2 ? 80 : 0) + random() * 25,
    ),
    v,
  ),
);
// Detail comparisons reconcile to the same prior observation as the headline.
data.saas.previousPlans = allocate(data.saas.previousPlans, data.saas.revenue.at(-2));
data.saas.planAccounts = allocate(data.saas.plans, last(data.saas.accounts));
data.finance.previousSpend = allocate(data.finance.previousSpend, data.finance.expense.at(-2));
data.store.previousRanks = allocate(data.store.previousRanks, sum(data.store.yearAgo.revenue));
data.live.previousRanks = allocate(data.live.previousRanks, last(data.live.yesterday));

const hourlyRegions = data.live.revenue.map((v, h) =>
  allocate(
    data.live.regions.map((w, i) => w * (1 + 0.3 * Math.sin(h * 0.55 + i))),
    v - (h ? data.live.revenue[h - 1] : 0),
  ),
);
data.live.regionHourly = data.live.regions.map((_, i) => hourlyRegions.map((row) => row[i]));
data.live.regions = data.live.regionHourly.map(sum);
