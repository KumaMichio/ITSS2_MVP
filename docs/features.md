# JobMatch JP — Tính năng đã implement

## 1. Xác thực (Auth)

### Đăng ký tài khoản
- Form: email, mật khẩu (tối thiểu 6 ký tự), họ tên
- Validate bằng Zod (backend) + HTML5 (frontend)
- Hash mật khẩu bằng bcryptjs (10 rounds)
- Tự động đăng nhập sau khi đăng ký thành công
- Trả về JWT có hạn 7 ngày

### Đăng nhập
- Form: email + mật khẩu
- Hiển thị thông tin demo (`demo@jobmatch.jp / demo123456`)
- Lưu token vào `localStorage` + Zustand store
- Redirect về Dashboard sau khi thành công

### Bảo vệ route
- `PrivateRoute` kiểm tra token trước khi render trang
- Axios interceptor tự động thêm `Bearer token` vào mọi request
- Khi nhận 401 → tự xóa auth và redirect về `/login`

---

## 2. Dashboard

### Greeting thông minh
- Hiện thị "Chào buổi sáng/chiều/tối" theo giờ hiện tại
- Dùng tên người dùng (lấy từ Zustand store)

### Stats cards (3 thẻ số liệu)
| Card | Mô tả |
|---|---|
| Avg. Match Score | % phù hợp trung bình của user với toàn bộ job |
| Verified Companies | Số công ty có Trust Score ≥ 70 |
| Tổng việc làm | Tổng số job đang tuyển dụng trong hệ thống |

### Top matches
- Hiển thị **5 job phù hợp nhất** theo Match Score giảm dần
- Layout lưới 2 cột
- Nút "Cập nhật" để reload stats
- Nút "Xem tất cả" link sang trang Jobs

---

## 3. Danh sách & tìm kiếm việc làm

### Tìm kiếm full-text
- Tìm theo tên vị trí hoặc tên công ty
- Case-insensitive
- Gọi API mỗi khi input thay đổi

### Bộ lọc (Filter panel bên trái)
| Loại filter | Giá trị | Kiểu chọn |
|---|---|---|
| Employment | Full-time, Part-time, Contract, Remote | Checkbox (multi) |
| JLPT Level | N1, N2, N3, N4, N5 | Checkbox (multi) |
| Trust Score | 85+ Verified, 70+ Reliable, Tất cả | Radio (single) |

- Nút "Xóa filter" xuất hiện khi có filter đang active

### Sắp xếp
- **Phù hợp nhất:** Sort theo `matchScore` giảm dần (client-side)
- **Mới nhất:** Sort theo `postedAt` giảm dần (client-side)

### Job card (list view)
Mỗi card hiển thị:
- Logo công ty (badge màu sắc + chữ cái)
- Tên vị trí + tên công ty + thời gian đăng
- Địa điểm + loại hình công việc + mức lương (`¥XXXk – ¥YYYk`)
- Tags kỹ năng yêu cầu (tối đa 3) + JLPT level
- Trust Score badge (màu xanh/xanh dương/xám theo điểm)
- Cảnh báo rủi ro `⚠ Có rủi ro` nếu có
- Vòng tròn Match % (màu xanh/vàng/đỏ)

### Trạng thái
- Loading skeleton khi đang tải
- Empty state khi không có kết quả

---

## 4. Chi tiết việc làm (JobDetailPanel)

Mở bằng cách click vào job card, hiển thị dạng slide-in panel bên phải.

### Thông tin cơ bản
- Header: logo công ty, tên job, trust badge, nút đóng (X)
- Địa điểm, loại hình, mức lương

### Breakdown matching
- Vòng tròn match % tổng
- 4 thanh progress bar:
  - **Kỹ năng** — % kỹ năng yêu cầu user có
  - **Tiếng Nhật (JLPT)** — mức JLPT của user so với yêu cầu
  - **Địa điểm** — user ở đúng thành phố không
  - **Kinh nghiệm** — số năm kinh nghiệm so với yêu cầu
- Mỗi bar có màu: xanh ≥ 80%, vàng ≥ 60%, đỏ < 60%

### Yêu cầu công việc
- Danh sách kỹ năng dưới dạng tags
- JLPT level, kinh nghiệm tối thiểu, học vấn

### Mô tả công việc
- Full text description

### Phúc lợi
- Danh sách với icon checkmark xanh

### Cảnh báo rủi ro
- Hiển thị trên nền đỏ nếu có rủi ro
- Icon `AlertTriangle` + danh sách rủi ro

### Thông tin công ty
- Quy mô, năm thành lập, Glassdoor rating, số lượng review
- Mô tả công ty
- Link website (mở tab mới)

---

## 5. Hồ sơ cá nhân (CV Profile)

### Thông tin cơ bản
- Họ tên (cập nhật trực tiếp bảng User)
- Vị trí hiện tại
- Số năm kinh nghiệm
- Địa điểm mong muốn (dropdown: 7 thành phố Nhật)

### Trình độ tiếng Nhật
- 5 nút toggle: N1 → N5
- Chỉ chọn 1 level, click lại để bỏ chọn

### Kỹ năng
- Hiển thị kỹ năng hiện có dạng pill + nút xóa (X)
- Input thêm kỹ năng mới (Enter hoặc nút +)
- Gợi ý 12 kỹ năng phổ biến (dạng nút dashed, click để thêm nhanh)
- Gợi ý tự lọc ra những kỹ năng user chưa có

### Lưu hồ sơ
- Nút "Lưu hồ sơ" với loading state
- Hiện `✓ Đã lưu!` trong 2.5 giây sau khi thành công
- Dùng `upsert` → không cần phân biệt create/update

---

## 6. Bookmark

### Backend API (đã implement)
- `GET /api/bookmarks` — lấy danh sách job đã bookmark
- `POST /api/bookmarks/:jobId` — thêm bookmark
- `DELETE /api/bookmarks/:jobId` — xóa bookmark
- Unique constraint `[userId, jobId]` — không bị trùng

> **Lưu ý:** Bookmark đã có backend nhưng **chưa có UI** trên frontend.

---

## 7. Matching Algorithm

Xem chi tiết tại [algorithms.md](algorithms.md).

---

## 8. Trust Score

Xem chi tiết tại [algorithms.md](algorithms.md).

---

## 9. Infrastructure

### Docker Compose (all-in-one)
- 3 services: `db`, `api`, `web`
- Health check TCP cho PostgreSQL trước khi khởi động API
- Retry loop (`nc -z db 5432`) trong API container
- Persistent volume cho database data
- Nginx làm reverse proxy cho frontend

### CI/CD-ready
- Multi-stage Dockerfile cho frontend (Node builder → Nginx)
- Build args cho `VITE_API_URL` (có thể override khi deploy)
- `.dockerignore` loại trừ `.env` và `node_modules`
