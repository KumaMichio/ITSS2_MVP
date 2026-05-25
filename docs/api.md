# JobMatch JP — API Endpoints

Base URL: `http://localhost:3001/api`

## Xác thực

Các endpoint được đánh dấu **🔒 Protected** yêu cầu header:
```
Authorization: Bearer <JWT token>
```

Token có hiệu lực 7 ngày. Khi token hết hạn hoặc không hợp lệ, server trả về `401`.

---

## Auth

### POST /auth/register

Đăng ký tài khoản mới.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "abc123",
  "name": "Nguyen Van A"
}
```

| Field | Kiểu | Ràng buộc |
|---|---|---|
| email | string | Định dạng email hợp lệ |
| password | string | Tối thiểu 6 ký tự |
| name | string | Không được rỗng |

**Response 201:**
```json
{
  "token": "<JWT>",
  "user": { "id": "...", "email": "...", "name": "..." }
}
```

**Errors:**
- `400` — Dữ liệu không hợp lệ (Zod error)
- `409` — Email đã được đăng ký

---

### POST /auth/login

Đăng nhập.

**Request body:**
```json
{
  "email": "demo@jobmatch.jp",
  "password": "demo123456"
}
```

**Response 200:**
```json
{
  "token": "<JWT>",
  "user": { "id": "...", "email": "...", "name": "..." }
}
```

**Errors:**
- `400` — Dữ liệu không hợp lệ
- `401` — Sai email hoặc mật khẩu

---

## Jobs

### GET /jobs

Lấy danh sách tất cả việc làm. Hỗ trợ tìm kiếm và lọc qua query string.

**Query params:**

| Param | Kiểu | Mô tả |
|---|---|---|
| `search` | string | Tìm theo tên vị trí hoặc tên công ty (case-insensitive) |
| `location` | string | Lọc theo thành phố (case-insensitive exact match) |
| `type` | string | Lọc theo loại hình: `Full-time`, `Part-time`, `Contract`, `Remote` |
| `jlpt` | string | Lọc theo JLPT yêu cầu: `N1`–`N5` |
| `skills` | string | Danh sách kỹ năng phân cách bằng dấu phẩy. Job phải có ít nhất 1 kỹ năng khớp |
| `trustMin` | number | Chỉ trả về job thuộc công ty có Trust Score ≥ giá trị này |

**Response 200:** Mảng Job object, sắp xếp theo `postedAt` mới nhất. Mỗi job bao gồm object `company`.

```json
[
  {
    "id": "...",
    "title": "Backend Engineer",
    "location": "Tokyo",
    "type": "Full-time",
    "salaryMin": 600,
    "salaryMax": 900,
    "currency": "JPY_MAN",
    "postedAt": "2024-01-15T00:00:00.000Z",
    "description": "...",
    "requireSkills": ["Java", "Spring Boot"],
    "requireJlpt": "N3",
    "requireExp": "2+",
    "requireEdu": "Bachelor",
    "benefits": ["Remote OK", "Visa support"],
    "risks": [],
    "companyId": "...",
    "company": {
      "id": "...",
      "name": "Toyota Motor",
      "trustScore": 100,
      ...
    }
  }
]
```

> **Lưu ý:** `matchScore` KHÔNG được tính trong endpoint này. Matching phải gọi riêng qua `GET /jobs/:id/match`.

---

### GET /jobs/:id

Lấy chi tiết một việc làm theo ID.

**Response 200:** Job object đầy đủ (bao gồm `company`).

**Errors:**
- `404` — Không tìm thấy job

---

### GET /jobs/:id/match 🔒

Tính điểm phù hợp (matching score) giữa hồ sơ user đang đăng nhập và một job.

**Response 200:**
```json
{
  "total": 78,
  "breakdown": {
    "skills": 67,
    "jlpt": 100,
    "location": 100,
    "experience": 100
  }
}
```

Xem chi tiết công thức tại [algorithms.md](algorithms.md).

**Errors:**
- `401` — Chưa đăng nhập
- `404` — Không tìm thấy job

---

## Users

### GET /users/me 🔒

Lấy thông tin tài khoản và hồ sơ của user đang đăng nhập.

**Response 200:**
```json
{
  "id": "...",
  "email": "demo@jobmatch.jp",
  "name": "Demo User",
  "createdAt": "...",
  "profile": {
    "id": "...",
    "userId": "...",
    "skills": ["Java", "SQL"],
    "japaneseLevel": "N3",
    "location": "Tokyo",
    "experienceYears": 3,
    "currentTitle": "Backend Engineer"
  }
}
```

> **Lưu ý:** Trường `password` bị loại bỏ khỏi response.

**Errors:**
- `401` — Chưa đăng nhập
- `404` — User không tồn tại trong DB

---

### PUT /users/me/profile 🔒

Cập nhật hồ sơ (và tên) của user đang đăng nhập. Dùng `upsert` nên không cần phân biệt tạo mới hay cập nhật.

**Request body** (tất cả field đều optional):
```json
{
  "name": "Nguyen Van A",
  "skills": ["Java", "Spring Boot", "SQL"],
  "japaneseLevel": "N3",
  "location": "Tokyo",
  "experienceYears": 3,
  "currentTitle": "Backend Engineer"
}
```

| Field | Kiểu | Ràng buộc |
|---|---|---|
| name | string | Không rỗng (nếu có) |
| skills | string[] | Mảng chuỗi |
| japaneseLevel | `N1`\|`N2`\|`N3`\|`N4`\|`N5`\|`null` | Enum hoặc null |
| location | string\|null | Tên thành phố |
| experienceYears | number\|null | Số nguyên ≥ 0 |
| currentTitle | string\|null | Tiêu đề vị trí hiện tại |

**Response 200:** Profile object sau khi cập nhật.

**Errors:**
- `400` — Dữ liệu không hợp lệ (Zod error)
- `401` — Chưa đăng nhập

---

## Bookmarks

### GET /bookmarks 🔒

Lấy danh sách việc làm đã bookmark, sắp xếp theo thời gian bookmark mới nhất.

**Response 200:** Mảng Job object (bao gồm `company`), giống format `GET /jobs`.

---

### POST /bookmarks/:jobId 🔒

Thêm bookmark cho một job.

**Response 201:**
```json
{
  "id": "...",
  "userId": "...",
  "jobId": "...",
  "createdAt": "..."
}
```

**Errors:**
- `401` — Chưa đăng nhập
- `409` — Job đã được bookmark

---

### DELETE /bookmarks/:jobId 🔒

Xóa bookmark. Dùng `deleteMany` nên không báo lỗi nếu bookmark không tồn tại.

**Response 204:** Không có body.

**Errors:**
- `401` — Chưa đăng nhập

---

## Dashboard

### GET /dashboard/stats 🔒

Lấy thống kê tổng quan để hiển thị trên Dashboard.

**Response 200:**
```json
{
  "avgMatchScore": 72,
  "verifiedCompanies": 8,
  "totalJobs": 10,
  "topMatches": [
    {
      "id": "...",
      "title": "Backend Engineer",
      "matchScore": 95,
      "company": { ... },
      ...
    }
  ]
}
```

| Field | Mô tả |
|---|---|
| `avgMatchScore` | % phù hợp trung bình của user với toàn bộ job trong DB |
| `verifiedCompanies` | Số công ty có Trust Score ≥ 70 |
| `totalJobs` | Tổng số job đang tuyển dụng |
| `topMatches` | 5 job phù hợp nhất (sắp xếp theo matchScore giảm dần) |

> **Lưu ý:** Endpoint này tải toàn bộ job vào memory và tính matching cho từng job — có thể chậm khi số lượng job lớn.

**Errors:**
- `401` — Chưa đăng nhập

---

## Health Check

### GET /health

Kiểm tra API đang hoạt động. Không yêu cầu auth.

**Response 200:**
```json
{ "status": "ok" }
```
