# JobMatch JP — Thuật toán Matching & Trust Score

## 1. Matching Score (`calcMatchScore`)

**File:** `backend/src/lib/matching.ts`

Tính điểm phù hợp giữa hồ sơ người dùng và một vị trí tuyển dụng. Kết quả là số nguyên từ **0 đến 100**.

### Input

| Tham số | Kiểu | Mô tả |
|---|---|---|
| `userSkills` | `string[]` | Danh sách kỹ năng của user |
| `userJlpt` | `string \| null` | Trình độ JLPT của user (N1–N5) |
| `userLocation` | `string \| null` | Thành phố user muốn làm việc |
| `userExpYears` | `number \| null` | Số năm kinh nghiệm |
| `job.requireSkills` | `string[]` | Kỹ năng job yêu cầu |
| `job.requireJlpt` | `string \| null` | JLPT job yêu cầu |
| `job.requireExp` | `string \| null` | Kinh nghiệm yêu cầu (vd: "2+") |
| `job.location` | `string` | Thành phố của job |

### Công thức tổng quát

```
total = round(
  skills_score   × 0.45 +
  jlpt_score     × 0.30 +
  location_score × 0.15 +
  exp_score      × 0.10
)
total = clamp(total, 0, 100)
```

### Chi tiết từng thành phần

#### Kỹ năng (45% trọng số)

```
Nếu job không yêu cầu kỹ năng → 100
Ngược lại:
  matched = số kỹ năng job yêu cầu mà user có (so sánh case-insensitive)
  skills_score = round(matched / total_required × 100)
```

**Ví dụ:**
- Job yêu cầu: `[Java, Spring Boot, SQL]`
- User có: `[Java, SQL, Python]`
- Matched: 2 → Score = round(2/3 × 100) = **67**

---

#### Tiếng Nhật / JLPT (30% trọng số)

```
Thứ hạng JLPT: N1=1, N2=2, N3=3, N4=4, N5=5 (số nhỏ = level cao hơn)

Nếu job không yêu cầu JLPT    → 100
Nếu user có JLPT:
  userRank <= reqRank (đủ hoặc giỏi hơn) → 100
  userRank > reqRank  (chưa đủ)          → round(reqRank / userRank × 100)
Nếu user không khai báo JLPT  → 50 (điểm mặc định)
```

**Ví dụ:**
- User N3 (rank=3), Job yêu cầu N2 (rank=2)
- 3 > 2 → chưa đủ → Score = round(2/3 × 100) = **67**

- User N2 (rank=2), Job yêu cầu N3 (rank=3)
- 2 ≤ 3 → đủ điều kiện → Score = **100**

---

#### Địa điểm (15% trọng số)

```
User không khai báo location → 70  (điểm mặc định)
User location == job location → 100 (khớp chính xác, case-insensitive)
User location ≠ job location  → 60  (khác thành phố)
```

---

#### Kinh nghiệm (10% trọng số)

```
Job không yêu cầu kinh nghiệm → 70 (điểm mặc định)
User và job đều có dữ liệu:
  reqYears = parseInt(job.requireExp)  // "2+" → 2
  userExpYears >= reqYears → 100
  userExpYears < reqYears  → round(userExpYears / reqYears × 100)
User không khai báo kinh nghiệm → 70
```

**Ví dụ:**
- User: 1 năm, Job yêu cầu: "2+"
- Score = round(1/2 × 100) = **50**

---

### Output

```typescript
{
  total: number,          // 0–100 (điểm tổng)
  breakdown: {
    skills: number,       // 0–100
    jlpt: number,         // 0–100 (hoặc 50 nếu không có JLPT)
    location: number,     // 60, 70, hoặc 100
    experience: number    // 70 hoặc tính theo công thức
  }
}
```

---

## 2. Trust Score (`calcTrustScore`)

**File:** `backend/src/lib/matching.ts`

Tính điểm tin cậy của một công ty. Chạy 1 lần khi seed database. Kết quả là số nguyên từ **0 đến 100**.

### Bảng điểm

| Tiêu chí | Điểm tối đa | Chi tiết |
|---|---|---|
| **Tuổi công ty** | 20 | > 30 năm: 20 \| 10–30 năm: 15 \| 5–10 năm: 10 \| 1–5 năm: 5 |
| **Quy mô** | 25 | Tập đoàn (>100k): 25 \| Lớn (>10k): 20 \| Lớn (>5k): 18 \| Trung bình: 15 \| Nhỏ: 5 |
| **Số lượng review** | 20 | > 1000: 20 \| > 100: 15 \| > 10: 10 \| > 0: 5 |
| **Glassdoor** | 20 | ≥ 4.0: 20 \| ≥ 3.5: 15 \| ≥ 3.0: 10 \| < 3.0: 5 |
| **Website** | 5 | Có website: +5 |
| **LinkedIn** | 5 | Có LinkedIn: +5 |
| **Không có rủi ro** | 5 | Mảng `risks` rỗng: +5 |
| **Tổng cộng** | **100** | `min(tổng, 100)` |

### Trust Score của 10 công ty seed

| Công ty | Age | Size | Reviews | GD | Web | LinkedIn | NoRisk | **Total** |
|---|---|---|---|---|---|---|---|---|
| Toyota | 20 | 25 | 20 | 20 | 5 | 5 | 5 | **100** |
| Sony | 20 | 20 | 20 | 20 | 5 | 5 | 5 | **95** |
| Nintendo | 20 | 20 | 20 | 20 | 5 | 5 | 5 | **95** |
| Panasonic | 20 | 25 | 20 | 15 | 5 | 5 | 5 | **95** |
| LINE | 15 | 18 | 15 | 20 | 5 | 5 | 5 | **83** |
| Rakuten | 15 | 20 | 15 | 15 | 5 | 5 | 5 | **80** |
| Mercari | 15 | 15 | 15 | 20 | 5 | 5 | 5 | **80** |
| DeNA | 15 | 15 | 15 | 20 | 5 | 0 | 5 | **75** |
| SoftBank | 20 | 20 | 5 | 15 | 5 | 0 | 5 | **70** |
| Startup XYZ | 5 | 5 | 0 | 0 | 0 | 0 | 0 | **10** |

---

## 3. Màu sắc hiển thị

### Match Score
| Điểm | Màu | Ý nghĩa |
|---|---|---|
| ≥ 80% | Xanh lá `#16a34a` | Phù hợp cao |
| 60–79% | Vàng `#d97706` | Phù hợp trung bình |
| < 60% | Đỏ `#dc2626` | Phù hợp thấp |

### Trust Score
| Điểm | Màu badge | Icon | Nhãn |
|---|---|---|---|
| ≥ 85 | Xanh lá | ShieldCheck | Verified |
| 70–84 | Xanh dương | Shield | Reliable |
| < 70 | Xám | ShieldAlert | (không nhãn) |

---

## 4. Hạn chế hiện tại

1. **Matching tính phía server** nhưng chỉ gọi khi user mở 1 job cụ thể — dashboard gọi `calcMatchScore()` cho toàn bộ job trong memory, chưa cache kết quả.

2. **Trust Score tĩnh** — được tính 1 lần khi seed, không tự cập nhật khi dữ liệu công ty thay đổi.

3. **JLPT score mặc định 50** khi user chưa khai báo — đây là giá trị tùy ý, có thể gây hiểu nhầm.

4. **Location matching đơn giản** — chỉ so sánh chuỗi chính xác, không hỗ trợ "Remote" hoặc vùng địa lý gần nhau.
