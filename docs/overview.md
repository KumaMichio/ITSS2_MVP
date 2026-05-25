# JobMatch JP — Tổng quan dự án

## Giới thiệu

**JobMatch JP** là nền tảng tìm kiếm việc làm IT tại Nhật Bản dành cho kỹ sư người Việt. Hệ thống tự động tính **điểm phù hợp (Matching %)** giữa hồ sơ cá nhân và từng vị trí tuyển dụng, đồng thời đánh giá **độ tin cậy công ty (Trust Score)** để người dùng có thể ra quyết định sáng suốt hơn.

## Mục tiêu

- Giúp kỹ sư IT người Việt tìm được việc làm phù hợp tại Nhật nhanh hơn
- Giảm thiểu rủi ro ứng tuyển vào công ty không đáng tin cậy
- Cung cấp thông tin minh bạch về mức độ phù hợp theo từng tiêu chí

---

## Tech Stack

| Layer | Công nghệ |
|---|---|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS + Lucide React |
| **State** | Zustand |
| **HTTP** | Axios |
| **Routing** | React Router v6 |
| **Backend** | Node.js + Express.js + TypeScript |
| **ORM** | Prisma |
| **Database** | PostgreSQL 16 |
| **Auth** | JWT + bcryptjs |
| **Validation** | Zod |
| **DevOps** | Docker + Docker Compose + Nginx |

---

## Kiến trúc hệ thống

```
Browser
  │
  ▼
[Frontend - React/Vite]   http://localhost:5173
  │  (Axios + Bearer JWT)
  ▼
[Backend - Express API]   http://localhost:3001/api
  │  (Prisma ORM)
  ▼
[PostgreSQL Database]     localhost:5432
```

### Docker Compose (production-like)

```
┌─────────────────────────────────────────┐
│           Docker Network                │
│                                         │
│  [web - Nginx:80]  ──proxy──▶  [api]   │
│                                  │      │
│                              [db:5432]  │
└─────────────────────────────────────────┘
```

---

## Cấu trúc thư mục

```
ITSS2_mvp/
├── backend/
│   ├── src/
│   │   ├── index.ts               # Express entry point
│   │   ├── routes/
│   │   │   ├── auth.ts            # POST /auth/register, /auth/login
│   │   │   ├── jobs.ts            # GET /jobs, /jobs/:id, /jobs/:id/match
│   │   │   ├── users.ts           # GET/PUT /users/me/profile
│   │   │   ├── bookmarks.ts       # GET/POST/DELETE /bookmarks/:jobId
│   │   │   └── dashboard.ts       # GET /dashboard/stats
│   │   ├── middleware/
│   │   │   └── auth.ts            # JWT middleware
│   │   └── lib/
│   │       ├── prisma.ts          # Prisma singleton
│   │       └── matching.ts        # Matching & Trust Score algorithms
│   ├── prisma/
│   │   ├── schema.prisma          # DB schema
│   │   └── seed.ts                # 10 companies, 10 jobs, 1 demo user
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AuthPage.tsx       # Login + Register
│   │   │   ├── DashboardPage.tsx  # Trang chủ sau login
│   │   │   ├── JobsPage.tsx       # Danh sách + tìm kiếm việc làm
│   │   │   ├── ProfilePage.tsx    # Chỉnh sửa CV cá nhân
│   │   │   └── PlaceholderPage.tsx
│   │   ├── components/
│   │   │   ├── Layout.tsx         # Sidebar + main wrapper
│   │   │   ├── Sidebar.tsx        # Navigation
│   │   │   ├── JobCard.tsx        # Card hiển thị job
│   │   │   ├── JobDetailPanel.tsx # Panel chi tiết job (slide-in)
│   │   │   ├── MatchCircle.tsx    # SVG vòng tròn matching %
│   │   │   ├── TrustBadge.tsx     # Badge trust score
│   │   │   └── CompanyBadge.tsx   # Logo công ty
│   │   ├── store/useStore.ts      # Zustand: user, token
│   │   ├── lib/
│   │   │   ├── api.ts             # Axios instance
│   │   │   └── utils.ts           # Helpers (formatSalary, timeAgo...)
│   │   └── types/index.ts         # TypeScript interfaces
│   └── Dockerfile
│
├── docker-compose.yml
├── docs/                          # Tài liệu dự án (thư mục này)
└── SETUP.md                       # Hướng dẫn cài đặt
```

---

## Dữ liệu mẫu (Seed)

| Công ty | Trust Score | Ghi chú |
|---|---|---|
| Toyota Motor | 100 | Tập đoàn, 89 năm lịch sử |
| Sony Corporation | 95 | Lớn, Glassdoor 4.2 |
| Nintendo | 95 | Lớn, Glassdoor 4.5 |
| Panasonic | 95 | Tập đoàn, 108 năm lịch sử |
| LINE Corporation | 83 | Lớn, Glassdoor 4.1 |
| Rakuten | 80 | Lớn, Glassdoor 3.9 |
| Mercari | 80 | Trung bình, Glassdoor 4.2 |
| DeNA | 75 | Trung bình, Glassdoor 4.0 |
| SoftBank | 70 | Lớn, ít review |
| Tech Startup XYZ | 10 | Mới 2023, không có website, có rủi ro |

**Demo user:** `demo@jobmatch.jp` / `demo123456`
- Skills: Java, Spring Boot, SQL, Python, Git, Linux, Docker
- JLPT: N3 | Location: Tokyo | Experience: 3 năm
