# JobMatch JP — Hướng dẫn chạy

## Cách 1: Chạy local (Development)

### Yêu cầu
- Node.js 18+
- Docker Desktop (để chạy PostgreSQL)

### Bước 1: Khởi động PostgreSQL
```bash
docker run -d \
  --name jobmatch-db \
  -e POSTGRES_DB=jobmatch \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:16-alpine
```

### Bước 2: Setup Backend
```bash
cd backend
npm install
npx prisma db push      # Tạo tables
npm run db:seed         # Nhập data mẫu
npm run dev             # Chạy API tại http://localhost:3001
```

### Bước 3: Setup Frontend
```bash
cd frontend
npm install
npm run dev             # Chạy UI tại http://localhost:5173
```

### Tài khoản demo
- Email: `demo@jobmatch.jp`
- Mật khẩu: `demo123456`

---

## Cách 2: Docker Compose (All-in-one)

```bash
# Từ thư mục gốc
docker compose up --build
```

Sau khi build xong:
- Frontend: http://localhost:5173
- API: http://localhost:3001/api
- DB: localhost:5432

---

## Cấu trúc project
```
jobmatch-jp/
├── backend/
│   ├── src/
│   │   ├── routes/       # auth, jobs, users, bookmarks, dashboard
│   │   ├── middleware/   # JWT auth
│   │   └── lib/          # prisma client, matching algorithm
│   ├── prisma/
│   │   ├── schema.prisma # DB schema
│   │   └── seed.ts       # Dữ liệu mẫu 10 jobs
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/        # AuthPage, DashboardPage, JobsPage, ProfilePage
│   │   ├── components/   # Sidebar, JobCard, MatchCircle, TrustBadge, JobDetailPanel
│   │   ├── store/        # Zustand store
│   │   └── lib/          # axios client, utils
│   └── Dockerfile
└── docker-compose.yml
```

## API Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/auth/register | Đăng ký |
| POST | /api/auth/login | Đăng nhập |
| GET | /api/jobs | Danh sách jobs (filter: search, jlpt, location, type, trustMin) |
| GET | /api/jobs/:id | Chi tiết job |
| GET | /api/jobs/:id/match | Match score của user với job (cần auth) |
| GET | /api/users/me | Thông tin user + CV |
| PUT | /api/users/me/profile | Cập nhật CV |
| GET | /api/bookmarks | Danh sách bookmark |
| POST | /api/bookmarks/:jobId | Bookmark job |
| DELETE | /api/bookmarks/:jobId | Xóa bookmark |
| GET | /api/dashboard/stats | Stats + top matches |
