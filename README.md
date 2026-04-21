# AI Career Counselor

> AI-powered career insights — phân tích thị trường tuyển dụng từ dữ liệu công khai, **chỉ aggregate**, cập nhật hàng tuần.

Built on **Lovable Cloud** (frontend + backend + auth + edge functions trong một).

---

## ✨ Tính năng

- 💬 **AI chat** — hỏi về kỹ năng, mức lương, lộ trình nghề nghiệp. Trả lời dạng aggregate, có nguồn tham khảo.
- 📊 **Live Market Data** — widget xu hướng kỹ năng / lương theo tuần.
- 🛡️ **Admin observability dashboard** — `/admin` — request volume, p50/p95 latency, error rate, token usage, CSAT, top users.
- 🔄 **Data flywheel** — user 👍/👎 → cải thiện model theo thời gian.
- 🎓 **Walkthrough** — tour tương tác cho user mới + trang `/guide`.

## 🧭 Chạy ở đâu?

| Hạng mục | Lovable Cloud (mặc định) | Local dev |
|---|---|---|
| Frontend (Vite + React) | ✅ Tự build/deploy | ✅ `npm run dev` |
| Database (Postgres) | ✅ Managed | ⚠️ Trỏ vào cùng Cloud DB (đơn giản nhất) hoặc tự host Supabase |
| Auth (Email + Google) | ✅ Quản lý qua Cloud UI | ✅ Dùng chung Cloud auth |
| Edge functions (`chat`, `admin-stats`) | ✅ Deploy tự động khi commit | ⚠️ Cần Supabase CLI nếu muốn chạy local |
| Secrets (`LOVABLE_API_KEY`, `ADMIN_EMAILS`) | ✅ Cloud → Secrets | ⚠️ Cho vào `.env` local |
| AI Gateway (Lovable AI) | ✅ Built-in, không cần API key | ⚠️ Cần `LOVABLE_API_KEY` |

**TL;DR**: Khuyến nghị edit code trên Lovable. Khi cần debug nặng / chạy offline, clone về local nhưng vẫn trỏ tới Cloud DB & functions để tránh dựng lại backend.

---

## 🚀 Quick start (local)

### 1. Yêu cầu
- Node ≥ 20
- npm / bun / pnpm

### 2. Clone & install
```bash
git clone <your-repo-url>
cd ai-career-counselor
npm install
```

### 3. Cấu hình môi trường
```bash
cp .env.example .env
```
Mở `.env` và dán giá trị từ **Lovable → Cloud → Connect** (hoặc Supabase project).

> Trên Lovable, file `.env` được tự inject — KHÔNG commit `.env` của bạn.

### 4. Chạy dev server
```bash
npm run dev
```
Mở http://localhost:8080. Console sẽ hiện badge `[LOCAL DEV]` xác nhận môi trường.

### 5. (Optional) Chạy edge functions local
```bash
npx supabase functions serve chat --env-file ./supabase/.env.local
```
Cần thêm `LOVABLE_API_KEY` trong `supabase/.env.local` để gọi AI Gateway.

---

## 🏗️ Kiến trúc

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  React SPA  │───▶│  Edge Functions  │───▶│   Lovable AI    │
│  (Vite)     │    │  - chat          │    │   Gateway       │
│             │    │  - admin-stats   │    └─────────────────┘
└──────┬──────┘    └────────┬─────────┘
       │                    │
       │           ┌────────▼─────────┐
       └──────────▶│   Postgres       │
                   │  - chat_sessions │
                   │  - chat_messages │
                   │  - request_logs  │
                   │  - feedback      │
                   │  - profiles      │
                   └──────────────────┘
```

### Detect runtime
`src/lib/env.ts` tự nhận biết `local` / `lovable-preview` / `lovable-published` / `custom`. Dùng `getEnv()` ở bất cứ component nào cần phân biệt.

---

## 📁 Cấu trúc thư mục
```
src/
  components/        # UI components + Walkthrough, LiveMarketData
    layout/          # AppLayout, Navbar, Footer, Protected/AdminRoute
    ui/              # shadcn primitives
  hooks/             # useAuth, useTheme, useIsAdmin
  integrations/      # supabase + lovable auth (auto-generated, KHÔNG sửa)
  lib/               # utils, env
  pages/             # Landing, Analyze, Admin, Guide, FAQ, Login, Profile
supabase/
  functions/
    chat/            # AI streaming + log request_logs
    admin-stats/     # Aggregate metrics cho /admin
  migrations/        # SQL migrations (read-only — tạo mới qua Lovable)
```

---

## 🔐 Bảo mật & Pháp lý

- Chỉ lưu **aggregate metrics**, không lưu JD gốc → giảm rủi ro pháp lý với các nền tảng tuyển dụng.
- RLS bật cho mọi bảng có dữ liệu user (chat, feedback, profiles).
- `/admin` bảo vệ bằng allowlist email (secret `ADMIN_EMAILS`).
- Auth: Email + Google OAuth (qua Lovable Cloud).

---

## 📦 Deploy

- **Lovable**: bấm **Publish** ở góc trên phải → app live tại `*.lovable.app`. Edge functions auto-deploy.
- **Self-host**: Build SPA `npm run build` → host static (Vercel/Netlify/Cloudflare). Edge functions deploy bằng Supabase CLI.

---

## 📝 License

MIT (hoặc tự chọn).
