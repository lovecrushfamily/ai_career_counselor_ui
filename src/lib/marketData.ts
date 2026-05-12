/**
 * Mock dữ liệu aggregate thị trường tuyển dụng.
 * Shape phẳng để dễ thay bằng API thật sau (chỉ cần 1 endpoint /market?range=).
 * KHÔNG chứa raw JD — chỉ aggregate (counts, deltas, shares).
 */

export type RangeKey = "week" | "month" | "quarter" | "year";

export interface SeriesPoint {
  /** ISO date hoặc nhãn (W14, Apr, Q1...) */
  label: string;
  [seriesKey: string]: string | number;
}

export interface PlatformAgg {
  name: string;
  share: number;          // %
  jds: number;            // tổng JD aggregate
  delta: number;          // % so với kỳ trước
}

export interface CompanyAgg {
  name: string;
  industry: string;
  jds: number;
  delta: number;
}

export interface IndustryAgg {
  name: string;
  jds: number;
  delta: number;
}

export interface MarketSnapshot {
  range: RangeKey;
  generatedAt: string;
  totalJds: number;
  deltaPct: number;
  newCompanies: number;
  medianSalary: string;     // "22 – 35tr"
  topSkill: { name: string; delta: number };
  topField: { name: string; delta: number };
  /** Series cho line chart (multi-series). Keys = skill/field name. */
  trend: SeriesPoint[];
  trendKeys: string[];
  platforms: PlatformAgg[];
  companies: CompanyAgg[];
  industries: IndustryAgg[];
}

const RANGE_CONFIG: Record<RangeKey, { points: number; labelFn: (i: number, total: number) => string }> = {
  week: { points: 12, labelFn: (i, n) => `W${52 - (n - 1) + i}` },
  month: { points: 12, labelFn: (i) => ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i] },
  quarter: { points: 8, labelFn: (i) => `Q${(i % 4) + 1}/${24 + Math.floor(i / 4)}` },
  year: { points: 5, labelFn: (i) => `${2022 + i}` },
};

const SKILL_KEYS = ["React/Next", "Python", "ML/AI", "Data Eng", "DevOps"] as const;

/** Sinh dữ liệu mock có quy luật (tăng nhẹ + nhiễu) — deterministic theo range để re-render ổn định */
const seeded = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const buildTrend = (range: RangeKey): { trend: SeriesPoint[]; keys: string[] } => {
  const cfg = RANGE_CONFIG[range];
  const rand = seeded(range.length * 7 + cfg.points);
  const baseline: Record<string, number> = {
    "React/Next": 100,
    "Python": 110,
    "ML/AI": 60,
    "Data Eng": 70,
    "DevOps": 80,
  };
  const growth: Record<string, number> = {
    "React/Next": 1.04,
    "Python": 1.05,
    "ML/AI": 1.22,
    "Data Eng": 1.09,
    "DevOps": 1.06,
  };
  // Biên độ nhiễu lớn hơn để biểu đồ biến động rõ rệt; thêm shock theo chu kỳ.
  const volatility: Record<string, number> = {
    "React/Next": 28,
    "Python": 24,
    "ML/AI": 34,
    "Data Eng": 22,
    "DevOps": 20,
  };
  const trend: SeriesPoint[] = [];
  for (let i = 0; i < cfg.points; i++) {
    const point: SeriesPoint = { label: cfg.labelFn(i, cfg.points) };
    for (const k of SKILL_KEYS) {
      const noise = (rand() - 0.5) * volatility[k];
      // dao động sin mô phỏng mùa vụ tuyển dụng
      const wave = Math.sin((i / cfg.points) * Math.PI * 2 + k.length) * (volatility[k] * 0.45);
      // shock ngẫu nhiên ~15% số điểm
      const shock = rand() < 0.15 ? (rand() - 0.5) * volatility[k] * 1.8 : 0;
      baseline[k] = baseline[k] * (1 + (growth[k] - 1) / cfg.points) + noise * 0.35;
      point[k] = Math.max(20, Math.round(baseline[k] + wave + shock));
    }
    trend.push(point);
  }
  return { trend, keys: SKILL_KEYS as unknown as string[] };
};

const PLATFORMS: PlatformAgg[] = [
  { name: "TopCV", share: 32, jds: 12480, delta: 6.2 },
  { name: "VietnamWorks", share: 24, jds: 9610, delta: 3.8 },
  { name: "ITviec", share: 21, jds: 8230, delta: 8.4 },
  { name: "LinkedIn VN", share: 16, jds: 6180, delta: 11.7 },
  { name: "Glints", share: 7, jds: 2710, delta: -1.3 },
];

const COMPANIES: CompanyAgg[] = [
  { name: "FPT Software", industry: "IT Services", jds: 412, delta: 5.6 },
  { name: "VNG", industry: "Internet/Game", jds: 318, delta: 12.1 },
  { name: "Momo", industry: "Fintech", jds: 287, delta: 9.4 },
  { name: "Techcombank", industry: "Banking", jds: 264, delta: 4.1 },
  { name: "Tiki", industry: "E-commerce", jds: 219, delta: -2.7 },
  { name: "Shopee VN", industry: "E-commerce", jds: 208, delta: 7.3 },
  { name: "VinAI", industry: "AI Research", jds: 184, delta: 22.6 },
  { name: "Viettel Digital", industry: "Telecom", jds: 176, delta: 3.9 },
  { name: "VPBank", industry: "Banking", jds: 158, delta: 6.4 },
  { name: "MISA", industry: "SaaS", jds: 142, delta: 4.8 },
];

const INDUSTRIES: IndustryAgg[] = [
  { name: "Fintech", jds: 3120, delta: 18.4 },
  { name: "AI / ML", jds: 1890, delta: 31.2 },
  { name: "E-commerce", jds: 2640, delta: 4.7 },
  { name: "Banking", jds: 2180, delta: 5.3 },
  { name: "Healthtech", jds: 980, delta: 14.1 },
  { name: "EdTech", jds: 870, delta: 9.6 },
  { name: "Manufacturing", jds: 1740, delta: 2.1 },
  { name: "Logistics", jds: 1350, delta: 7.8 },
];

export const getMarketSnapshot = (range: RangeKey): MarketSnapshot => {
  const { trend, keys } = buildTrend(range);
  const totalJds = PLATFORMS.reduce((acc, p) => acc + p.jds, 0);
  return {
    range,
    generatedAt: new Date().toISOString(),
    totalJds,
    deltaPct: range === "week" ? 6.4 : range === "month" ? 12.8 : range === "quarter" ? 18.2 : 34.5,
    newCompanies: range === "week" ? 38 : range === "month" ? 124 : range === "quarter" ? 312 : 870,
    medianSalary: "22 – 35tr",
    topSkill: { name: "ML / AI", delta: 31.2 },
    topField: { name: "Fintech", delta: 18.4 },
    trend,
    trendKeys: keys,
    platforms: PLATFORMS,
    companies: COMPANIES,
    industries: INDUSTRIES,
  };
};