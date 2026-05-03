// ─── Inline data (mirrors mock-data.json — works without a local server) ───
const DATA = {
  "demoUser": {
    "name": "Nguyen Van A",
    "skills": ["Java", "Spring Boot", "SQL", "Python", "Git", "Linux", "Docker"],
    "japaneseLevel": "N3",
    "location": "Tokyo",
    "experience": "3 năm"
  },
  "jobs": [
    {
      "id": "1", "title": "Java Developer",
      "company": { "name": "Sony Corporation", "logo": "S", "logoColor": "#003087", "size": "Lớn (>10,000)", "founded": 1946, "website": "https://sony.com", "linkedin": "sony", "description": "Sony Corporation là tập đoàn đa quốc gia của Nhật Bản, chuyên về điện tử tiêu dùng, phim ảnh, âm nhạc và dịch vụ tài chính với hiện diện tại hơn 100 quốc gia.", "reviewCount": 1250, "glassdoor": 4.2 },
      "location": "Tokyo", "salary": "400,000 – 600,000 ¥/tháng", "type": "Full-time", "posted": "2026-04-28",
      "tags": { "skills": ["Java", "Spring Boot", "Microservices"], "japaneseLevel": "N3" },
      "description": "Chúng tôi đang tìm kiếm Java Developer tài năng để gia nhập đội ngũ phát triển phần mềm tại Sony. Bạn sẽ tham gia xây dựng và phát triển các hệ thống backend quy mô lớn phục vụ hàng triệu người dùng toàn cầu.",
      "requirements": { "skills": ["Java", "Spring Boot", "SQL"], "japaneseLevel": "N3", "experience": "2+ năm", "education": "Đại học trở lên" },
      "benefits": ["Bảo hiểm sức khỏe đầy đủ", "Remote 2 ngày/tuần", "Thưởng năm 4 tháng lương", "Hỗ trợ học tiếng Nhật"],
      "risks": []
    },
    {
      "id": "2", "title": "Frontend Developer (React)",
      "company": { "name": "Rakuten, Inc.", "logo": "R", "logoColor": "#BF0000", "size": "Lớn (>10,000)", "founded": 1997, "website": "https://rakuten.co.jp", "linkedin": "rakuten", "description": "Rakuten là một trong những công ty thương mại điện tử và dịch vụ internet lớn nhất Nhật Bản với hơn 70 dịch vụ khác nhau toàn cầu.", "reviewCount": 890, "glassdoor": 3.9 },
      "location": "Tokyo", "salary": "380,000 – 550,000 ¥/tháng", "type": "Full-time", "posted": "2026-04-30",
      "tags": { "skills": ["React", "TypeScript", "Frontend"], "japaneseLevel": "N2" },
      "description": "Rakuten tìm kiếm Frontend Developer có kinh nghiệm với React và TypeScript để phát triển giao diện người dùng cho nền tảng thương mại điện tử hàng đầu Nhật Bản.",
      "requirements": { "skills": ["React", "TypeScript", "CSS"], "japaneseLevel": "N2", "experience": "3+ năm", "education": "Đại học trở lên" },
      "benefits": ["Bảo hiểm đầy đủ", "Tiếng Anh là ngôn ngữ chính", "Thưởng hiệu suất"],
      "risks": []
    },
    {
      "id": "3", "title": "Python / ML Engineer",
      "company": { "name": "DeNA Co., Ltd.", "logo": "D", "logoColor": "#00A4E4", "size": "Trung bình (1,000–5,000)", "founded": 1999, "website": "https://dena.com", "linkedin": null, "description": "DeNA là công ty công nghệ Nhật Bản nổi tiếng với các sản phẩm game mobile, AI và dịch vụ internet sáng tạo.", "reviewCount": 320, "glassdoor": 4.0 },
      "location": "Osaka", "salary": "420,000 – 650,000 ¥/tháng", "type": "Full-time", "posted": "2026-04-25",
      "tags": { "skills": ["Python", "Machine Learning", "AI"], "japaneseLevel": "N3" },
      "description": "Tham gia đội ngũ AI/ML của DeNA để xây dựng các mô hình học máy ứng dụng trong game và dịch vụ internet quy mô lớn.",
      "requirements": { "skills": ["Python", "TensorFlow", "SQL"], "japaneseLevel": "N3", "experience": "2+ năm", "education": "Đại học (ưu tiên AI/Data)" },
      "benefits": ["Bảo hiểm sức khỏe", "Hỗ trợ nghiên cứu AI", "Flexible hours"],
      "risks": []
    },
    {
      "id": "4", "title": "iOS Developer",
      "company": { "name": "Nintendo Co., Ltd.", "logo": "N", "logoColor": "#E4000F", "size": "Lớn (>10,000)", "founded": 1889, "website": "https://nintendo.co.jp", "linkedin": "nintendo", "description": "Nintendo là công ty game nổi tiếng thế giới với các thương hiệu Mario, Zelda, Pokémon. Trụ sở chính tại Kyoto, Nhật Bản.", "reviewCount": 2100, "glassdoor": 4.5 },
      "location": "Kyoto", "salary": "350,000 – 500,000 ¥/tháng", "type": "Full-time", "posted": "2026-04-20",
      "tags": { "skills": ["Swift", "iOS", "Mobile"], "japaneseLevel": "N4" },
      "description": "Nintendo tìm kiếm iOS Developer để phát triển ứng dụng mobile cho hệ sinh thái game và giải trí của Nintendo.",
      "requirements": { "skills": ["Swift", "iOS", "Xcode"], "japaneseLevel": "N4", "experience": "2+ năm", "education": "Đại học trở lên" },
      "benefits": ["Bảo hiểm toàn diện", "Game miễn phí", "Môi trường sáng tạo", "Thưởng tháng 13"],
      "risks": []
    },
    {
      "id": "5", "title": "Backend Engineer (Go)",
      "company": { "name": "LINE Corporation", "logo": "L", "logoColor": "#00B900", "size": "Lớn (>5,000)", "founded": 2000, "website": "https://linecorp.com", "linkedin": "line-corporation", "description": "LINE là ứng dụng nhắn tin hàng đầu tại Nhật Bản, Đài Loan, Thái Lan với hàng trăm triệu người dùng hoạt động hàng tháng.", "reviewCount": 780, "glassdoor": 4.1 },
      "location": "Tokyo", "salary": "500,000 – 750,000 ¥/tháng", "type": "Full-time", "posted": "2026-05-01",
      "tags": { "skills": ["Go", "Backend", "Cloud"], "japaneseLevel": "N2" },
      "description": "LINE tìm kiếm Backend Engineer giỏi Go để phát triển hạ tầng nhắn tin xử lý hàng tỷ tin nhắn mỗi ngày với độ trễ cực thấp.",
      "requirements": { "skills": ["Go", "Docker", "Kubernetes"], "japaneseLevel": "N2", "experience": "3+ năm", "education": "Đại học trở lên" },
      "benefits": ["Lương cạnh tranh", "Bảo hiểm cao cấp", "Stock options", "Remote toàn phần"],
      "risks": []
    },
    {
      "id": "6", "title": "PHP Developer",
      "company": { "name": "Tech Startup XYZ", "logo": "X", "logoColor": "#6B7280", "size": "Nhỏ (<50 nhân viên)", "founded": 2023, "website": null, "linkedin": null, "description": null, "reviewCount": 0, "glassdoor": null },
      "location": "Tokyo", "salary": "250,000 – 350,000 ¥/tháng", "type": "Full-time", "posted": "2026-05-02",
      "tags": { "skills": ["PHP", "Backend", "Web"], "japaneseLevel": "N3" },
      "description": "Công ty khởi nghiệp đang tuyển PHP Developer để phát triển web application. Môi trường năng động, startup.",
      "requirements": { "skills": ["PHP", "MySQL"], "japaneseLevel": "N3", "experience": "1+ năm", "education": "Cao đẳng trở lên" },
      "benefits": ["Flexible hours"],
      "risks": ["Công ty mới thành lập năm 2023, chưa có track record", "Không rõ nguồn tài chính và nhà đầu tư"]
    },
    {
      "id": "7", "title": "DevOps Engineer",
      "company": { "name": "Toyota Motor Corporation", "logo": "T", "logoColor": "#EB0A1E", "size": "Tập đoàn (>100,000)", "founded": 1937, "website": "https://toyota.co.jp", "linkedin": "toyota-motor-corporation", "description": "Toyota là nhà sản xuất ô tô lớn nhất thế giới, đang đầu tư mạnh vào công nghệ phần mềm, xe điện và xe tự lái thế hệ mới.", "reviewCount": 3200, "glassdoor": 4.3 },
      "location": "Nagoya", "salary": "430,000 – 620,000 ¥/tháng", "type": "Full-time", "posted": "2026-04-15",
      "tags": { "skills": ["DevOps", "Cloud", "AWS"], "japaneseLevel": "N2" },
      "description": "Toyota tìm kiếm DevOps Engineer để xây dựng và vận hành hạ tầng cloud cho hệ thống phần mềm xe hơi thế hệ mới.",
      "requirements": { "skills": ["AWS", "Docker", "Linux"], "japaneseLevel": "N2", "experience": "3+ năm", "education": "Đại học trở lên" },
      "benefits": ["Phúc lợi tập đoàn", "Bảo hiểm toàn diện", "Xe Toyota miễn phí", "Đào tạo nghề nghiệp"],
      "risks": []
    },
    {
      "id": "8", "title": "Data Analyst",
      "company": { "name": "SoftBank Corp.", "logo": "SB", "logoColor": "#FF8A00", "size": "Lớn (>10,000)", "founded": 1981, "website": "https://softbank.jp", "linkedin": null, "description": "SoftBank là tập đoàn viễn thông và đầu tư công nghệ hàng đầu Nhật Bản với portfolio đầu tư khổng lồ toàn cầu.", "reviewCount": 15, "glassdoor": 3.5 },
      "location": "Tokyo", "salary": "350,000 – 520,000 ¥/tháng", "type": "Full-time", "posted": "2026-04-22",
      "tags": { "skills": ["SQL", "Python", "Data"], "japaneseLevel": "N3" },
      "description": "SoftBank cần Data Analyst để phân tích dữ liệu viễn thông và hành vi người dùng nhằm tối ưu hóa chiến lược kinh doanh.",
      "requirements": { "skills": ["SQL", "Python", "Tableau"], "japaneseLevel": "N3", "experience": "1+ năm", "education": "Đại học (ưu tiên Thống kê, Kinh tế, CNTT)" },
      "benefits": ["Bảo hiểm sức khỏe", "Đào tạo chuyên sâu", "Thưởng hiệu suất"],
      "risks": []
    },
    {
      "id": "9", "title": "Full Stack Developer",
      "company": { "name": "Mercari, Inc.", "logo": "M", "logoColor": "#FF0211", "size": "Trung bình (1,000–5,000)", "founded": 2013, "website": "https://mercari.com", "linkedin": "mercari", "description": "Mercari là nền tảng marketplace C2C lớn nhất Nhật Bản, hiện đang mở rộng sang Mỹ và các thị trường quốc tế.", "reviewCount": 540, "glassdoor": 4.2 },
      "location": "Tokyo", "salary": "500,000 – 800,000 ¥/tháng", "type": "Full-time", "posted": "2026-05-02",
      "tags": { "skills": ["React", "Node.js", "Full Stack"], "japaneseLevel": "N2" },
      "description": "Mercari tìm kiếm Full Stack Developer để phát triển nền tảng marketplace với scale hàng triệu giao dịch mỗi ngày.",
      "requirements": { "skills": ["React", "Node.js", "TypeScript"], "japaneseLevel": "N2", "experience": "3+ năm", "education": "Đại học trở lên" },
      "benefits": ["Lương top-tier", "Full remote", "Stock options", "Bảo hiểm cao cấp", "Learning budget"],
      "risks": []
    },
    {
      "id": "10", "title": "Embedded Systems Engineer",
      "company": { "name": "Panasonic Holdings", "logo": "P", "logoColor": "#0032A0", "size": "Tập đoàn (>100,000)", "founded": 1918, "website": "https://panasonic.com", "linkedin": "panasonic", "description": "Panasonic là tập đoàn điện tử Nhật Bản với lịch sử hơn 100 năm, chuyên về điện tử gia dụng, năng lượng và hệ thống automotive.", "reviewCount": 2800, "glassdoor": 3.9 },
      "location": "Osaka", "salary": "380,000 – 580,000 ¥/tháng", "type": "Full-time", "posted": "2026-04-18",
      "tags": { "skills": ["C++", "Embedded", "Linux"], "japaneseLevel": "N3" },
      "description": "Panasonic cần Embedded Systems Engineer để phát triển firmware cho thiết bị điện tử và hệ thống automotive thế hệ mới.",
      "requirements": { "skills": ["C++", "Embedded Systems", "Linux"], "japaneseLevel": "N3", "experience": "2+ năm", "education": "Đại học (Kỹ thuật điện, Điện tử, CNTT)" },
      "benefits": ["Bảo hiểm tập đoàn", "Hỗ trợ nhà ở", "Đào tạo kỹ thuật chuyên sâu"],
      "risks": []
    }
  ]
};

// ─── State ───────────────────────────────────────────────────────────────────
let { jobs, demoUser } = DATA;

// Merge saved profile from localStorage (edited on profile page)
try {
  const _saved = localStorage.getItem('jmjp_user');
  if (_saved) demoUser = Object.assign({}, demoUser, JSON.parse(_saved));
} catch (_) {}

let activeId = null;
const JP = ['N5', 'N4', 'N3', 'N2', 'N1'];
const filters = { skills: new Set(), jp: '', loc: '', match: '', q: '' };

// ─── Calculations ─────────────────────────────────────────────────────────────
function calcMatch(job) {
  const userSkills = demoUser.skills.map(s => s.toLowerCase());
  const req = job.requirements;
  const matched = [], missing = [];

  req.skills.forEach(s => {
    (userSkills.includes(s.toLowerCase()) ? matched : missing).push(s);
  });

  const ui = JP.indexOf(demoUser.japaneseLevel);
  const ri = JP.indexOf(req.japaneseLevel);
  if (ui >= ri) matched.push(req.japaneseLevel);
  else missing.push(`${req.japaneseLevel} (bạn: ${demoUser.japaneseLevel})`);

  const total = matched.length + missing.length;
  return { pct: total ? Math.round(matched.length / total * 100) : 0, matched, missing };
}

function calcTrust(job) {
  const c = job.company;
  let score = 0;
  const pos = [], neg = [];
  if (c.website)                    { score += 3; pos.push('Có website chính thức'); }
  else                                             neg.push('Không có website chính thức');
  if (c.linkedin)                   { score += 2; pos.push('Có trang LinkedIn'); }
  else                                             neg.push('Không có LinkedIn');
  if (c.reviewCount >= 100)         { score += 3; pos.push(`${c.reviewCount} đánh giá (Glassdoor)`); }
  else if (c.reviewCount > 0)       { score += 1; pos.push(`${c.reviewCount} đánh giá`); }
  else                                             neg.push('Không có đánh giá nào');
  if (c.description)                { score += 2; pos.push('Thông tin công ty đầy đủ'); }
  else                                             neg.push('Thiếu thông tin công ty');
  return { score, pos, neg };
}

function getRisks(job) {
  const r = [...job.risks];
  const c = job.company;
  if (!c.website)     r.push('Không có website chính thức');
  if (!c.linkedin)    r.push('Không có trang LinkedIn');
  if (!c.description) r.push('Thiếu mô tả về công ty');
  if (c.reviewCount === 0) r.push('Không có đánh giá từ nhân viên');
  return r;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function ringClass(p) {
  return p >= 70 ? 'mh' : p >= 50 ? 'mm' : p >= 30 ? 'mml' : 'ml';
}
function trustClass(s) {
  return s >= 7 ? 'th' : s >= 5 ? 'tm' : 'tl';
}
function barColor(p) {
  return p >= 70 ? '#16a34a' : p >= 50 ? '#2563eb' : p >= 30 ? '#d97706' : '#dc2626';
}
function starsHtml(score) {
  return Array.from({ length: 10 }, (_, i) => `<span>${i < score ? '⭐' : '☆'}</span>`).join('');
}
function timeAgo(d) {
  const diff = Math.floor((Date.now() - new Date(d)) / 86400000);
  if (diff === 0) return 'Hôm nay';
  if (diff === 1) return 'Hôm qua';
  if (diff < 7)  return `${diff} ngày trước`;
  return new Date(d).toLocaleDateString('vi-VN');
}

// ─── Render: Job Card ──────────────────────────────────────────────────────────
function cardHtml(job) {
  const m = calcMatch(job);
  const t = calcTrust(job);
  const risks = getRisks(job);
  const active = job.id === activeId ? 'active' : '';
  return `
<div class="job-card ${active}" onclick="openDetail('${job.id}')">
  <div class="co-logo" style="background:${job.company.logoColor}">${job.company.logo}</div>
  <div class="card-body">
    <div class="card-title">${job.title}</div>
    <div class="card-sub">
      <span>${job.company.name}</span>
      <span class="card-loc">📍 ${job.location}</span>
      <span>${job.type}</span>
    </div>
    <div class="tag-row">
      ${job.tags.skills.map(s => `<span class="tag tag-s">${s}</span>`).join('')}
      <span class="tag tag-jp">${job.tags.japaneseLevel}</span>
    </div>
    <div class="card-foot">
      <span class="trust-mini">⭐ Trust ${t.score}/10</span>
      ${risks.length ? `<span class="risk-pill">⚠ ${risks.length} rủi ro</span>` : ''}
      <span class="posted-txt" style="margin-left:auto">${timeAgo(job.posted)}</span>
    </div>
  </div>
  <div class="card-right">
    <div class="match-ring ${ringClass(m.pct)}">${m.pct}<small>%</small></div>
  </div>
</div>`;
}

// ─── Render: Detail Panel ─────────────────────────────────────────────────────
function detailHtml(job) {
  const m = calcMatch(job);
  const t = calcTrust(job);
  const risks = getRisks(job);
  const rc = ringClass(m.pct);
  const tc = trustClass(t.score);

  return `
<button class="d-close" onclick="closeDetail()">✕</button>
<div class="d-co-logo" style="background:${job.company.logoColor}">${job.company.logo}</div>
<div class="d-title">${job.title}</div>
<div class="d-meta">
  <span>🏢 ${job.company.name}</span>
  <span>📍 ${job.location}</span>
  <span>💼 ${job.type}</span>
  <span>🗓 ${timeAgo(job.posted)}</span>
</div>
<div class="d-salary">💰 ${job.salary}</div>

<!-- Matching -->
<div class="match-block">
  <div class="sec-title">Độ phù hợp của bạn</div>
  <div class="match-top">
    <div class="match-circle ${rc}">${m.pct}<small>%</small></div>
    <div class="match-bar-area">
      <div class="match-bar-label">Phù hợp <strong>${m.pct}%</strong> với vị trí này</div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${m.pct}%;background:${barColor(m.pct)}"></div>
      </div>
    </div>
  </div>
  <div class="match-rows">
    ${m.matched.map(x => `<div class="match-row"><span class="ico-ok">✔</span><span>${x}</span></div>`).join('')}
    ${m.missing.map(x => `<div class="match-row"><span class="ico-no">✖</span><span class="miss">${x}</span></div>`).join('')}
  </div>
</div>

<!-- Trust Score -->
<div class="trust-block">
  <div class="trust-head">
    <div class="sec-title">⭐ Trust Score</div>
    <div class="trust-badge ${tc}">${t.score}/10</div>
  </div>
  <div class="trust-stars">${starsHtml(t.score)}</div>
  <div class="trust-rows">
    ${t.pos.map(x => `<div class="trust-row"><span style="color:#16a34a">✔</span> ${x}</div>`).join('')}
    ${t.neg.map(x => `<div class="trust-row"><span style="color:#dc2626">✖</span> ${x}</div>`).join('')}
  </div>
</div>

${risks.length ? `
<div class="risk-block">
  <div class="risk-title">⚠️ Cảnh báo rủi ro</div>
  <div class="risk-rows">
    ${risks.map(r => `<div class="risk-row"><span>⚠</span>${r}</div>`).join('')}
  </div>
</div>` : ''}

<div class="divider"></div>

<div class="sec">
  <div class="sec-title">Mô tả công việc</div>
  <div class="d-desc">${job.description}</div>
</div>

<div class="sec">
  <div class="sec-title">Yêu cầu</div>
  <div class="req-rows">
    <div class="req-row"><span class="req-lbl">Kỹ năng:</span><span class="req-val">${job.requirements.skills.join(', ')}</span></div>
    <div class="req-row"><span class="req-lbl">Tiếng Nhật:</span><span class="req-val">${job.requirements.japaneseLevel}</span></div>
    <div class="req-row"><span class="req-lbl">Kinh nghiệm:</span><span class="req-val">${job.requirements.experience}</span></div>
    <div class="req-row"><span class="req-lbl">Học vấn:</span><span class="req-val">${job.requirements.education}</span></div>
  </div>
</div>

<div class="divider"></div>

<div class="sec">
  <div class="sec-title">Phúc lợi</div>
  <div class="benefit-rows">
    ${job.benefits.map(b => `<div class="benefit-row">✓ ${b}</div>`).join('')}
  </div>
</div>

<div class="divider"></div>

<div class="sec">
  <div class="sec-title">Về công ty</div>
  <div class="d-desc">${job.company.description || '<em>Chưa có thông tin.</em>'}</div>
  <div class="req-rows" style="margin-top:10px">
    <div class="req-row"><span class="req-lbl">Quy mô:</span><span class="req-val">${job.company.size}</span></div>
    <div class="req-row"><span class="req-lbl">Thành lập:</span><span class="req-val">${job.company.founded}</span></div>
    ${job.company.glassdoor ? `<div class="req-row"><span class="req-lbl">Glassdoor:</span><span class="req-val">⭐ ${job.company.glassdoor}/5 · ${job.company.reviewCount} reviews</span></div>` : ''}
  </div>
</div>`;
}

// ─── Filter & Sort ────────────────────────────────────────────────────────────
function filtered() {
  let list = [...jobs];

  if (filters.q) {
    const q = filters.q.toLowerCase();
    list = list.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.company.name.toLowerCase().includes(q) ||
      j.tags.skills.some(s => s.toLowerCase().includes(q))
    );
  }
  if (filters.skills.size)
    list = list.filter(j =>
      [...filters.skills].some(sk =>
        j.tags.skills.map(s => s.toLowerCase()).includes(sk.toLowerCase())
      )
    );
  if (filters.jp)
    list = list.filter(j => j.tags.japaneseLevel === filters.jp);
  if (filters.loc)
    list = list.filter(j => j.location === filters.loc);
  if (filters.match) {
    list = list.filter(j => {
      const p = calcMatch(j).pct;
      if (filters.match === 'high') return p >= 70;
      if (filters.match === 'mid')  return p >= 40 && p < 70;
      if (filters.match === 'low')  return p < 40;
      return true;
    });
  }

  const sort = document.getElementById('sortSelect').value;
  if (sort === 'match')  list.sort((a, b) => calcMatch(b).pct - calcMatch(a).pct);
  if (sort === 'trust')  list.sort((a, b) => calcTrust(b).score - calcTrust(a).score);
  if (sort === 'newest') list.sort((a, b) => new Date(b.posted) - new Date(a.posted));
  if (sort === 'salary') list.sort((a, b) => {
    const num = s => parseInt(s.replace(/\D/g, ''));
    return num(b.salary) - num(a.salary);
  });

  return list;
}

function renderList() {
  const list = filtered();
  document.getElementById('jobCount').textContent = `${list.length} việc làm`;
  document.getElementById('cardGrid').innerHTML = list.length
    ? list.map(cardHtml).join('')
    : `<div class="empty"><div class="empty-icon">🔍</div><h3>Không tìm thấy việc làm</h3><p>Thử thay đổi bộ lọc hoặc từ khóa</p></div>`;
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
function openDetail(id) {
  activeId = id;
  const job = jobs.find(j => j.id === id);
  document.getElementById('detailBody').innerHTML = detailHtml(job);
  document.getElementById('detailPanel').classList.add('open');
  document.getElementById('layout').classList.add('panel-open');
  document.getElementById('detailPanel').scrollTop = 0;
  renderList();
}

function closeDetail() {
  activeId = null;
  document.getElementById('detailPanel').classList.remove('open');
  document.getElementById('layout').classList.remove('panel-open');
  renderList();
}

// ─── Init ─────────────────────────────────────────────────────────────────────
function init() {
  // Update header badge from (possibly saved) profile
  const _av = document.getElementById('hdrBadgeAvatar');
  const _nm = document.getElementById('hdrBadgeName');
  const _sb = document.getElementById('hdrBadgeSub');
  if (_av) _av.textContent = (demoUser.name || 'U')[0].toUpperCase();
  if (_nm) _nm.textContent = demoUser.name;
  if (_sb) _sb.textContent = `${demoUser.title || 'IT Dev'} · ${demoUser.japaneseLevel} · ${demoUser.location}`;

  // Profile card in sidebar
  document.getElementById('profileSkills').innerHTML =
    demoUser.skills.map(s => `<span class="profile-skill-tag">${s}</span>`).join('');
  document.getElementById('profileJp').textContent =
    `Tiếng Nhật: ${demoUser.japaneseLevel}`;

  // Skill filter chips
  const allSkills = [...new Set(jobs.flatMap(j => j.tags.skills))].sort();
  document.getElementById('skillTags').innerHTML =
    allSkills.map(s =>
      `<span class="skill-chip" data-skill="${s}" onclick="toggleSkill(this,'${s}')">${s}</span>`
    ).join('');

  // Radios
  document.querySelectorAll('input[name="jp"]').forEach(r =>
    r.addEventListener('change', e => { filters.jp = e.target.value; renderList(); })
  );
  document.querySelectorAll('input[name="loc"]').forEach(r =>
    r.addEventListener('change', e => { filters.loc = e.target.value; renderList(); })
  );
  document.querySelectorAll('input[name="match"]').forEach(r =>
    r.addEventListener('change', e => { filters.match = e.target.value; renderList(); })
  );

  // Search
  let debounce;
  document.getElementById('searchInput').addEventListener('input', e => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { filters.q = e.target.value.trim(); renderList(); }, 280);
  });

  // Sort
  document.getElementById('sortSelect').addEventListener('change', renderList);

  // Reset
  document.getElementById('resetBtn').addEventListener('click', () => {
    filters.skills.clear(); filters.jp = ''; filters.loc = ''; filters.match = ''; filters.q = '';
    document.getElementById('searchInput').value = '';
    document.querySelectorAll('input[name="jp"]')[0].checked = true;
    document.querySelectorAll('input[name="loc"]')[0].checked = true;
    document.querySelectorAll('input[name="match"]')[0].checked = true;
    document.querySelectorAll('.skill-chip').forEach(c => c.classList.remove('on'));
    renderList();
  });

  renderList();
}

function toggleSkill(el, skill) {
  if (filters.skills.has(skill)) { filters.skills.delete(skill); el.classList.remove('on'); }
  else                           { filters.skills.add(skill);    el.classList.add('on'); }
  renderList();
}

document.addEventListener('DOMContentLoaded', init);
