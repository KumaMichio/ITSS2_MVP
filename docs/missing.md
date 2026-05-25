# JobMatch JP — Phần còn thiếu / Chưa hoàn thiện

## 1. Tính năng chưa có UI (Backend đã sẵn sàng)

### Bookmark UI
- **Trạng thái:** Backend API đầy đủ (`GET/POST/DELETE /api/bookmarks`), nhưng **không có trang hay component frontend**.
- **Cần làm:**
  - Nút bookmark (icon tim/bookmark) trên `JobCard` và `JobDetailPanel`
  - Trang "Việc làm đã lưu" hiển thị danh sách job đã bookmark
  - Đồng bộ trạng thái bookmark qua Zustand store

---

## 2. Trang placeholder (chưa implement)

### Match Insights (`/insights`)
- **Trạng thái:** Route tồn tại trong `App.tsx`, render `PlaceholderPage`.
- **Mục tiêu ban đầu:** Phân tích hồ sơ user — kỹ năng còn thiếu, so sánh với thị trường, gợi ý học thêm gì để tăng match score.
- **Cần làm:** Thiết kế và implement toàn bộ trang này.

### Trust Scores (`/trust`)
- **Trạng thái:** Route tồn tại, render `PlaceholderPage`.
- **Mục tiêu ban đầu:** Bảng xếp hạng công ty theo Trust Score, giải thích các tiêu chí đánh giá.
- **Cần làm:** Thiết kế và implement toàn bộ trang này.

### Settings (`/settings`)
- **Trạng thái:** Route tồn tại, render `PlaceholderPage`.
- **Cần làm:** Trang cài đặt tài khoản (đổi mật khẩu, ngôn ngữ, v.v.).

---

## 3. Vấn đề kỹ thuật cần giải quyết

### Docker: Không thể kết nối database (`P1001`)
- **Triệu chứng:** API container báo `Can't reach database server at db:5432` dù DB container đã healthy.
- **Nguyên nhân đã xác định:** PostgreSQL healthcheck có thể pass qua Unix socket trước khi TCP port sẵn sàng nhận kết nối từ container khác.
- **Đã thử:** `.dockerignore` để loại `.env`, thêm retry loop với `netcat`, tăng `start_period` và `retries` cho healthcheck.
- **Chưa giải quyết:** Cần xác minh container networking và thứ tự khởi động.

---

## 4. Thiếu sót trong logic hiện tại

### matchScore không có trong danh sách job
- `GET /jobs` không trả về `matchScore` — client phải tự gọi `GET /jobs/:id/match` từng cái một.
- `DashboardPage` gọi `GET /dashboard/stats` để có `topMatches` (có matchScore), nhưng `JobsPage` phải tính match ở client-side bằng cách gọi thêm API cho mỗi job.
- **Giải pháp đề xuất:** Thêm optional query param `?userId=me` vào `GET /jobs` để tính và trả về `matchScore` cùng lúc.

### Sắp xếp "Phù hợp nhất" trên JobsPage
- Hiện tại, `JobsPage` sort theo `matchScore` client-side. Nhưng `matchScore` chỉ có sau khi gọi `GET /jobs/:id/match` cho từng job — chưa thấy code gọi API này trong `JobsPage`.
- Cần kiểm tra lại flow: sort "Phù hợp nhất" có đang hoạt động đúng không hay chỉ sort theo `postedAt`.

### matchScore không được cache
- Mỗi lần load Dashboard, hệ thống tính lại `calcMatchScore()` cho toàn bộ job trong memory.
- Sẽ là vấn đề hiệu năng khi số lượng job lớn.

---

## 5. Tính năng chưa có (ngoài scope MVP ban đầu)

| Tính năng | Mô tả |
|---|---|
| **Ứng tuyển (Apply)** | Nút apply, lưu lịch sử ứng tuyển, trạng thái (đang xem xét, phỏng vấn…) |
| **Phân trang** | Danh sách job hiện tải toàn bộ, không có pagination hay infinite scroll |
| **Xác thực email** | Không có bước verify email khi đăng ký |
| **Quên mật khẩu** | Không có flow reset password |
| **Admin panel** | Không có giao diện quản lý job/company cho admin |
| **Thông báo** | Không có notification khi có job phù hợp mới |
| **Upload CV** | Chỉ nhập kỹ năng thủ công, không parse CV từ file PDF/Word |
| **Nhiều ngôn ngữ (i18n)** | Giao diện hiện tại chỉ có tiếng Việt, không có tiếng Anh hay Nhật |
| **Dark mode** | CSS variable đã chuẩn bị nhưng chưa có toggle |
| **Responsive mobile** | Sidebar cố định không phù hợp màn hình nhỏ |

---

## 6. Thiếu sót về data

### Trust Score tĩnh
- Trust Score được tính 1 lần khi seed, lưu cứng vào DB. Không tự cập nhật khi dữ liệu công ty thay đổi.
- Cần cân nhắc chạy `calcTrustScore()` động hoặc có cron job tính lại định kỳ.

### Dữ liệu seed hạn chế
- Chỉ có 10 công ty, 10 job, 1 demo user.
- Không đủ để test phân trang, lọc đa dạng, hay benchmark hiệu năng.

### JLPT score mặc định tùy tiện
- Khi user chưa khai báo JLPT, thuật toán trả về `50` — không có cơ sở rõ ràng.
- Có thể gây hiểu nhầm: user không có JLPT vẫn có score 50% cho tiêu chí này.

---

## Ưu tiên đề xuất

| Độ ưu tiên | Hạng mục |
|---|---|
| 🔴 **Cao** | Sửa Docker networking issue |
| 🔴 **Cao** | Implement Bookmark UI |
| 🟡 **Trung bình** | Kiểm tra và sửa "Sort by phù hợp nhất" trên JobsPage |
| 🟡 **Trung bình** | Implement Match Insights page |
| 🟢 **Thấp** | Phân trang cho danh sách job |
| 🟢 **Thấp** | Implement Trust Scores page |
| 🟢 **Thấp** | Responsive mobile |
