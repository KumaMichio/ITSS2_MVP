# 🇯🇵 JobMatch JP — Demo MVP

Ứng dụng demo hỗ trợ IT Engineer người Việt tìm việc làm tại Nhật Bản.  
Tự động tính **độ phù hợp (Matching %)**, **độ tin cậy công ty (Trust Score)** và **cảnh báo rủi ro** dựa trên hồ sơ cá nhân của người dùng.

---

## 🚀 Cách chạy

Không cần cài đặt, không cần server.

```
Mở file index.html bằng trình duyệt (Chrome / Edge / Firefox)
```

> Data được nhúng sẵn trong `app.js` — hoạt động trực tiếp từ file system.

---

## 📁 Cấu trúc files

```
ITSS2_mvp/
├── index.html       # Trang chính — danh sách & tìm kiếm việc làm
├── profile.html     # Trang hồ sơ cá nhân
├── styles.css       # Style chung (header, job card, detail panel)
├── profile.css      # Style riêng cho trang profile
├── app.js           # Logic trang chính (filter, matching, trust score)
├── profile.js       # Logic trang profile (edit, localStorage)
└── mock-data.json   # Mock data gốc (10 jobs + demo user)
```

---

## 🧩 Tính năng chi tiết

### 1. 📋 Danh sách việc làm

Hiển thị 10 job IT tại Nhật với thông tin nhanh trên mỗi card:

| Thông tin | Chi tiết |
|---|---|
| **Tên vị trí** | Java Developer, Frontend, DevOps... |
| **Công ty** | Sony, Rakuten, Nintendo, LINE... |
| **Địa điểm** | Tokyo, Osaka, Kyoto, Nagoya |
| **Tags kỹ năng** | Java, React, Python, Go... |
| **Tag JLPT** | N2, N3, N4 |
| **Trust Score mini** | ⭐ Trust X/10 |
| **Cảnh báo rủi ro** | Badge đỏ ⚠ nếu có rủi ro |
| **Matching %** | Vòng tròn màu (xanh/vàng/đỏ) |
| **Ngày đăng** | Hôm nay / X ngày trước |

---

### 2. 🔍 Tìm kiếm & Lọc việc làm

**Thanh tìm kiếm (header):**
- Tìm theo tên job, tên công ty, hoặc kỹ năng
- Có debounce 280ms, không reload trang

**Bộ lọc sidebar (4 nhóm):**

| Bộ lọc | Loại | Mô tả |
|---|---|---|
| **Kỹ năng** | Multi-select chip | Click để bật/tắt từng kỹ năng |
| **Tiếng Nhật** | Radio | Lọc đúng cấp JLPT yêu cầu |
| **Địa điểm** | Radio | Tokyo / Osaka / Kyoto / Nagoya |
| **Độ phù hợp** | Radio | Cao ≥70% / Trung bình 40–69% / Thấp <40% |

**Sắp xếp (dropdown):**
- Độ phù hợp (mặc định)
- Trust Score
- Mới nhất
- Lương cao nhất

---

### 3. 📄 Chi tiết việc làm

Click vào job card → panel chi tiết mở ra bên phải (layout 3 cột).

Nội dung bao gồm:
- Tên vị trí, công ty, địa điểm, loại hình, ngày đăng
- Mức lương
- **Matching %** (chi tiết — xem mục 4)
- **Trust Score** (chi tiết — xem mục 5)
- **Cảnh báo rủi ro** (nếu có — xem mục 6)
- Mô tả công việc
- Yêu cầu (kỹ năng, JLPT, kinh nghiệm, học vấn)
- Phúc lợi
- Thông tin công ty (quy mô, năm thành lập, Glassdoor rating)

---

### 4. 📊 Matching % — Độ phù hợp

Tính tự động bằng cách so sánh **hồ sơ người dùng** với **yêu cầu của job**.

**Công thức:**
```
Matching % = (số tiêu chí đạt / tổng tiêu chí) × 100
```

**Tiêu chí so sánh:**
- Từng kỹ năng yêu cầu (Java, Python, Docker...) → có trong hồ sơ không?
- Trình độ JLPT yêu cầu → JLPT của user ≥ yêu cầu không?
  - Thứ tự: N5 < N4 < N3 < N2 < N1
  - VD: user N3, job yêu cầu N4 → ✔ đạt
  - VD: user N3, job yêu cầu N2 → ✖ không đạt

**Hiển thị:**

| % | Màu | Ý nghĩa |
|---|---|---|
| ≥ 70% | 🟢 Xanh lá | Phù hợp cao |
| 50–69% | 🔵 Xanh dương | Phù hợp trung bình |
| 30–49% | 🟡 Vàng | Phù hợp thấp |
| < 30% | 🔴 Đỏ | Không phù hợp |

Trong panel chi tiết hiển thị từng tiêu chí:
- **✔ Java** — kỹ năng đạt
- **✖ ~~React~~** — kỹ năng thiếu

---

### 5. ⭐ Trust Score — Độ tin cậy công ty

Điểm từ **0 đến 10**, tính tự động từ thông tin công ty.

**Bảng tính điểm:**

| Tiêu chí | Điểm | Lý do |
|---|---|---|
| Có website chính thức | +3 | Dấu hiệu minh bạch cơ bản |
| Có trang LinkedIn | +2 | Hiện diện mạng xã hội chuyên nghiệp |
| ≥ 100 đánh giá (Glassdoor) | +3 | Nhiều nhân viên đánh giá = đáng tin |
| 1–99 đánh giá | +1 | Có đánh giá nhưng ít |
| Có mô tả công ty đầy đủ | +2 | Thông tin rõ ràng |

**Phân loại:**

| Điểm | Màu | Đánh giá |
|---|---|---|
| 7–10 | 🟢 Xanh | Đáng tin cậy |
| 5–6 | 🟡 Vàng | Trung bình |
| 0–4 | 🔴 Đỏ | Cần cẩn thận |

**Ví dụ thực tế trong demo:**
- Sony / Nintendo / Toyota → **10/10** (đủ tất cả tiêu chí)
- DeNA → **8/10** (không có LinkedIn)
- SoftBank → **6/10** (không có LinkedIn, chỉ 15 reviews)
- Tech Startup XYZ → **0/10** (không website, không LinkedIn, không reviews, không mô tả)

---

### 6. ⚠️ Cảnh báo rủi ro

Tự động phát hiện và hiển thị cảnh báo nếu job/công ty thiếu thông tin quan trọng.

**Các loại cảnh báo:**

| Cảnh báo | Điều kiện kích hoạt |
|---|---|
| Không có website chính thức | `company.website == null` |
| Không có trang LinkedIn | `company.linkedin == null` |
| Thiếu mô tả về công ty | `company.description == null` |
| Không có đánh giá từ nhân viên | `company.reviewCount == 0` |
| Rủi ro tùy chỉnh | Nhập thẳng trong mock data (`job.risks[]`) |

**Hiển thị:**
- Trên card: badge đỏ **"⚠ X rủi ro"**
- Trong detail panel: khung đỏ liệt kê từng cảnh báo

---

### 7. 👤 Trang Hồ sơ cá nhân (`profile.html`)

Xem và chỉnh sửa hồ sơ — thay đổi phản ánh ngay vào Matching % ở trang jobs.

**Các phần trong trang profile:**

#### Hero Card
- Avatar, tên, chức danh, địa điểm, JLPT badge
- Preview 6 kỹ năng đầu tiên
- Cập nhật realtime khi chỉnh sửa form bên dưới

#### Stats tổng quan (3 ô)
- Tổng số job (10)
- Số job phù hợp cao ≥ 70%
- Số job phù hợp trung bình 40–69%
- Tính lại ngay khi thay đổi kỹ năng hoặc JLPT

#### Chọn trình độ JLPT
- 5 thẻ bấm: N5 / N4 / N3 / N2 / N1
- Hiển thị mô tả tiêu chí từng cấp độ

#### Chỉnh sửa kỹ năng
- Xóa kỹ năng: bấm **×** trên chip
- Thêm kỹ năng: nhập text + Enter hoặc bấm nút
- Gợi ý nhanh: 14 kỹ năng IT phổ biến chưa có trong hồ sơ

#### Thông tin cơ bản
- Họ và tên
- Vị trí / Chức danh
- Năm kinh nghiệm (dropdown)
- Địa điểm mong muốn (dropdown)

#### Lưu / Đặt lại
- **Lưu thay đổi** → ghi vào `localStorage` → trang jobs đọc lại khi mở
- **Đặt lại mặc định** → xóa localStorage, khôi phục hồ sơ gốc
- Toast notification xác nhận sau mỗi hành động

---

## 👤 Demo User (mặc định)

```json
{
  "name": "Nguyen Van A",
  "title": "Java Developer",
  "skills": ["Java", "Spring Boot", "SQL", "Python", "Git", "Linux", "Docker"],
  "japaneseLevel": "N3",
  "location": "Tokyo",
  "experience": "3 năm"
}
```

---

## 📊 Kết quả Matching % với Demo User

| Job | Công ty | Match | Lý do |
|---|---|---|---|
| Java Developer | Sony | **100%** | Java ✔ Spring Boot ✔ SQL ✔ N3 ✔ |
| Python/ML Engineer | DeNA | **75%** | Python ✔ SQL ✔ N3 ✔ / TensorFlow ✗ |
| Data Analyst | SoftBank | **75%** | SQL ✔ Python ✔ N3 ✔ / Tableau ✗ |
| DevOps Engineer | Toyota | **50%** | Docker ✔ Linux ✔ / AWS ✗ N2 ✗ |
| Embedded Engineer | Panasonic | **50%** | Linux ✔ N3 ✔ / C++ ✗ Embedded ✗ |
| PHP Developer | XYZ Startup | **33%** | N3 ✔ / PHP ✗ MySQL ✗ |
| iOS Developer | Nintendo | **25%** | N4 ✔ / Swift ✗ iOS ✗ Xcode ✗ |
| Backend (Go) | LINE | **25%** | Docker ✔ / Go ✗ Kubernetes ✗ N2 ✗ |
| Frontend Developer | Rakuten | **0%** | React ✗ TypeScript ✗ CSS ✗ N2 ✗ |
| Full Stack Developer | Mercari | **0%** | React ✗ Node.js ✗ TypeScript ✗ N2 ✗ |

---

## 🔗 Điều hướng giữa các trang

```
index.html  ──[click avatar / "Chỉnh sửa hồ sơ"]──►  profile.html
profile.html ──[click "← Danh sách việc làm"]──►  index.html
```

Thay đổi hồ sơ trên `profile.html` → Lưu → Quay về `index.html` → Matching % tự động cập nhật.

---

## 🛠 Tech Stack

| Thành phần | Công nghệ |
|---|---|
| UI | HTML5 + CSS3 (Grid, Flexbox, Custom Properties) |
| Logic | Vanilla JavaScript (ES6+) |
| Lưu trữ | localStorage (user profile) |
| Data | Inline JSON (không cần server/API) |
| Font | System font stack (Segoe UI, Hiragino Sans) |
