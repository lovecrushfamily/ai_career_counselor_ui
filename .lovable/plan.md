
## 1. Rebrand → "AI Career Advisor Assistant"

**Đổi tên toàn bộ** chuỗi "AI Career Counselor" / "Career Counselor" / "Cố vấn nghề nghiệp" → **"AI Career Advisor Assistant"** (target: career advisors / HR / job-seekers).

Files cần update:
- `index.html` (title + meta)
- `src/lib/env.ts` (APP_NAME constant nếu có)
- `src/components/layout/Navbar.tsx`, `Footer.tsx`
- `src/pages/Landing.tsx`, `Guide.tsx`, `FAQ.tsx`, `Community.tsx`, `Admin.tsx`
- `src/components/Walkthrough.tsx`
- `supabase/functions/chat/index.ts` (system prompt)

## 2. Logo robot 🤖

Thay icon `Activity` hiện tại bằng **logo robot head** custom (SVG inline component `src/components/brand/RobotLogo.tsx`):
- Đầu robot tròn-vuông, antenna với glow dot xanh, mắt LED, gradient xanh điện (giữ palette `--gradient-data`)
- Dùng trong Navbar, Footer, favicon (cập nhật `public/` + `index.html`)
- Kích thước responsive (h-8 nav, h-6 footer)

## 3. i18n VN/EN

**Stack**: `react-i18next` + `i18next` (lightweight, no extra backend).

- Tạo `src/i18n/index.ts` (init), `src/i18n/locales/vi.json`, `src/i18n/locales/en.json`
- Wrap `<App>` với init i18n trong `main.tsx`
- Lưu `language` vào `localStorage` (key `app-lang`), default = `vi`
- Tạo `src/components/LanguageToggle.tsx`: button gọn `VN | EN` (giống pattern theme toggle), đặt trong Navbar **ngay cạnh nút theme** (góc phải)
- Mobile menu cũng có toggle

**Phạm vi dịch (đợt đầu)**:
- Navbar, Footer, Landing (mọi section), Pricing, Community + FAQ, Login, Profile
- Analyze: tab labels, empty state, suggested prompts, dashboard headers
- Giữ nội dung do AI/data trả về (tin nhắn chat, JD) ở ngôn ngữ gốc — chỉ dịch UI shell

Tất cả copy hiện tại được trích thành key như `landing.hero.title`, `nav.solutions`, v.v.

## 4. Analyze: 2 tab (Chatbot | Dashboard)

Refactor `src/pages/Analyze.tsx` thành layout có **Tabs ở top** (dùng `@/components/ui/tabs` — đã có).

```
[ 💬 Chatbot Agent ] [ 📊 Market Dashboard ]
```

State `activeTab` lưu trong URL query (`?tab=chat|dashboard`) để deep-link.

### 4a. Tab Chatbot (refactor cái hiện có)

Layout 3 cột (giữ nguyên cấu trúc):
- **Left** — Lịch sử trò chuyện (đã có `chat_sessions`)
- **Center** — Khung chat chính + thinking/reasoning indicator (collapsible "💭 Thinking..." block hiện stream nhỏ phía trên message)
- **Right** — **Cited Sources panel** (mới):
  - Hiển thị **JD source links** dạng card gọn: platform badge + role title + URL link "↗"
  - **Không show full raw JD content** — chỉ link + 1-line excerpt + crawl date
  - Cập nhật theo message assistant đang hover/active
  - Section "Reasoning" collapsible thể hiện chain-of-thought rút gọn (nếu edge function trả về)

Edge function `chat/index.ts` cần update để trả về `citations` JSON (đã có cột `citations jsonb` trong `chat_messages`) — tạm thời mock structured nếu chưa có pipeline thật.

### 4b. Tab Dashboard (mới — informative)

**Layout**: biểu đồ chính ở center, KPI cards bao quanh.

```
┌─────────────────────────────────────────────────┐
│  Range: [Week ▾] [Month] [Year]   [Export PDF] │
├──────────┬─────────────────────────┬────────────┤
│ KPI 1    │                         │  KPI 4    │
│ Total JDs│   📈 LINE CHART         │  Avg sal  │
│          │   (recharts)            │           │
│ KPI 2    │   - x: time             │  KPI 5    │
│ Δ w/w    │   - y: demand index     │  Top co.  │
│          │   - 3-5 series          │           │
│ KPI 3    │     (skill/industry)    │  KPI 6    │
│ New jobs │                         │  Hot field│
├──────────┴─────────────────────────┴────────────┤
│ ┌─ Top Platforms ─┐ ┌─ Top Companies ─┐        │
│ │ TopCV    32%    │ │ FPT, VNG, MoMo… │        │
│ │ ITviec   24% …  │ │ +tăng trưởng %  │        │
│ └─────────────────┘ └──────────────────┘        │
│ ┌─ Top Industries / Lĩnh vực ────────────────┐ │
│ │ Fintech +18% · Healthtech +12% · …         │ │
│ └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Chi tiết**:
- **Line chart** dùng `recharts` (đã có trong `components/ui/chart.tsx`):
  - Multi-series: top 5 skills/industries demand index theo thời gian
  - Smooth curve, gradient fill mờ, glow xanh điện, tooltip có nguồn
- **Range selector**: `Week | Month | Quarter | Year` → resample data, label trục X tự đổi
- **KPI cards** (6 cái xung quanh): Total JDs aggregated, Δ vs prev period, New companies, Median salary trend, Top growing skill, Top declining skill
- **Platforms section**: TopCV / ITviec / VietnamWorks / LinkedIn VN với % share + tăng trưởng
- **Top companies**: list top 10 công ty uy tín đăng tuyển nhiều nhất + delta
- **Industries/Fields**: Fintech, E-commerce, Healthtech, EdTech, Manufacturing… với delta
- **Data layer**: tạo `src/lib/marketData.ts` mock-data có shape đúng cho line chart + KPIs (week/month/year). Để dễ thay bằng API thật sau.

### 4c. Export PDF báo cáo

- Cài `jspdf` + `html2canvas` (hoặc `@react-pdf/renderer` — gọn hơn cho structured report)
- Chọn **`jspdf` + `html2canvas`** để snapshot dashboard hiện tại + thêm phần thống kê text
- Nút **"Export PDF"** ở góc phải Dashboard với dropdown: `Báo cáo tuần | Tháng | Quý | Năm`
- File output: `market-report-{range}-{date}.pdf` chứa:
  - Cover (logo + tên báo cáo + period)
  - KPI summary
  - Line chart snapshot
  - Top platforms / companies / industries tables
  - Footer "Aggregate data — sources: TopCV, ITviec, …"

## 5. Files mới / sửa

**Mới**:
- `src/components/brand/RobotLogo.tsx`
- `src/components/LanguageToggle.tsx`
- `src/i18n/index.ts`, `src/i18n/locales/vi.json`, `src/i18n/locales/en.json`
- `src/components/analyze/ChatbotPanel.tsx` (extract từ Analyze hiện tại)
- `src/components/analyze/CitedSourcesPanel.tsx`
- `src/components/analyze/DashboardPanel.tsx`
- `src/components/analyze/MarketLineChart.tsx`
- `src/components/analyze/KpiCard.tsx`
- `src/lib/marketData.ts` (mock data + types)
- `src/lib/exportReport.ts` (jsPDF logic)

**Sửa**:
- `index.html`, `src/main.tsx`
- `src/components/layout/Navbar.tsx` (logo + LanguageToggle), `Footer.tsx`
- `src/pages/Analyze.tsx` (chuyển sang Tabs wrapper)
- `src/pages/Landing.tsx`, `Pricing.tsx`, `Community.tsx`, `FAQ.tsx`, `Login.tsx`, `Profile.tsx`, `Guide.tsx`, `Admin.tsx` (đổi tên brand + thêm key i18n)
- `src/components/Walkthrough.tsx` (đổi tên + i18n)
- `supabase/functions/chat/index.ts` (đổi tên trong system prompt + return citations structured)

## 6. Dependencies cần cài

- `react-i18next` + `i18next` + `i18next-browser-languagedetector`
- `jspdf` + `html2canvas`
- (`recharts` đã có sẵn)

## 7. Acceptance criteria

- [ ] Mọi nơi hiển thị "AI Career Advisor Assistant" thay cho tên cũ
- [ ] Logo đầu robot xuất hiện trong Navbar + Footer + favicon
- [ ] Toggle VN/EN ngay cạnh theme — đổi ngôn ngữ ngay không reload
- [ ] `/analyze` có 2 tab `Chatbot` & `Dashboard` (URL deep-link)
- [ ] Chatbot có panel **Cited Sources** bên phải, không show raw JD
- [ ] Dashboard có line chart center + KPI cards xung quanh + range selector + platforms/companies/industries
- [ ] Nút "Export PDF" tạo báo cáo theo tuần/tháng/quý/năm
