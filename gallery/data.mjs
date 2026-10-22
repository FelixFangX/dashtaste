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
data.saas.netNew = data.saas.added.map((v, i) => v - data.saas.churned[i]);
// Monthly recurring revenue rolls forward by additions less churn.
data.saas.revenue = data.saas.netNew.reduce((series, net, i) => {
  series.push(i === 0 ? data.saas.revenue[0] : series[i - 1] + net);
  return series;
}, []);
data.saas.accounts = trend(18, 1120, 43);
data.saas.churn = data.saas.churned.map((v, i) => v / data.saas.revenue[i]);
data.finance.cash = trend(12, 2400000, 68000);
data.finance.runway = data.finance.cash.map((v, i) => v / (data.finance.expense[i] * 0.34));
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
        ? [data.saas.revenue, data.saas.netNew, data.saas.churn, data.saas.accounts]
        : [
            data.finance.revenue,
            data.finance.margin.map((v) => v / 100),
            data.finance.cash,
            data.finance.runway,
          ];
    labels =
      name === 'saas'
        ? ['MRR', 'Net new MRR', 'Churn', 'Active accounts']
        : ['Revenue', 'Gross margin', 'Cash balance', 'Runway'];
    types =
      name === 'saas'
        ? ['money', 'money', 'percent', 'number']
        : ['money', 'percent', 'money', 'months'];
    current = series.map(last);
    previous = series.map((v) => v.at(-2));
  } else if (name === 'store') {
    labels = ['成交金额', '访客数', '支付转化率', '客单价'];
    types = ['money', 'number', 'percent', 'money'];
    current = storeMetrics(data.store);
    previous = storeMetrics(data.store.previous);
    yearAgo = storeMetrics(data.store.yearAgo);
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
const allocate = (weights, total) => {
  const weight = sum(weights);
  const values = weights.map((v) => Math.floor((v / weight) * total));
  values[0] += total - sum(values);
  return values;
};
data.saas.plans = allocate(data.saas.plans, last(data.saas.revenue));
data.finance.ranks = allocate(data.finance.ranks, last(data.finance.expense));
data.live.regions = allocate(data.live.regions, last(data.live.revenue));
