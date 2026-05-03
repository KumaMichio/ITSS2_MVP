const STORAGE_KEY = 'jmjp_user';
const JP_ORDER = ['N5', 'N4', 'N3', 'N2', 'N1'];
const JP_LABEL = { N5: 'Cơ bản', N4: 'Sơ cấp', N3: 'Trung cấp', N2: 'Cao cấp', N1: 'Thành thạo' };
const JP_DESC  = {
  N5: 'Hiểu và sử dụng được các biểu hiện tiếng Nhật quen thuộc nhất.',
  N4: 'Hiểu được tiếng Nhật cơ bản — đọc, nghe các chủ đề đơn giản.',
  N3: 'Hiểu được tiếng Nhật trong các tình huống hàng ngày ở mức độ nhất định.',
  N2: 'Hiểu được tiếng Nhật trong nhiều tình huống, gần với người bản ngữ.',
  N1: 'Hiểu được tiếng Nhật trong mọi tình huống, thành thạo như người bản ngữ.',
};

const DEFAULT_USER = {
  name:          'Nguyen Van A',
  title:         'Java Developer',
  skills:        ['Java', 'Spring Boot', 'SQL', 'Python', 'Git', 'Linux', 'Docker'],
  japaneseLevel: 'N3',
  location:      'Tokyo',
  experience:    '3 năm',
};

// Compact job data — only what's needed for match calculation
const JOBS_LITE = [
  { id:'1',  title:'Java Developer',        company:'Sony',      skills:['Java','Spring Boot','SQL'],         jlpt:'N3' },
  { id:'2',  title:'Frontend Developer',    company:'Rakuten',   skills:['React','TypeScript','CSS'],          jlpt:'N2' },
  { id:'3',  title:'Python/ML Engineer',    company:'DeNA',      skills:['Python','TensorFlow','SQL'],         jlpt:'N3' },
  { id:'4',  title:'iOS Developer',         company:'Nintendo',  skills:['Swift','iOS','Xcode'],               jlpt:'N4' },
  { id:'5',  title:'Backend Engineer (Go)', company:'LINE',      skills:['Go','Docker','Kubernetes'],          jlpt:'N2' },
  { id:'6',  title:'PHP Developer',         company:'XYZ',       skills:['PHP','MySQL'],                      jlpt:'N3' },
  { id:'7',  title:'DevOps Engineer',       company:'Toyota',    skills:['AWS','Docker','Linux'],              jlpt:'N2' },
  { id:'8',  title:'Data Analyst',          company:'SoftBank',  skills:['SQL','Python','Tableau'],            jlpt:'N3' },
  { id:'9',  title:'Full Stack Developer',  company:'Mercari',   skills:['React','Node.js','TypeScript'],      jlpt:'N2' },
  { id:'10', title:'Embedded Engineer',     company:'Panasonic', skills:['C++','Embedded Systems','Linux'],    jlpt:'N3' },
];

const SUGGEST_POOL = [
  'React','Vue.js','Angular','Node.js','TypeScript','JavaScript',
  'Go','Kotlin','Swift','Rust','PHP','C++','Ruby','Scala',
  'AWS','GCP','Azure','Kubernetes','Terraform','CI/CD',
  'TensorFlow','PyTorch','Machine Learning','Data Science',
  'iOS','Android','Flutter','Unity',
  'Redis','MongoDB','PostgreSQL','Elasticsearch',
  'Microservices','Embedded Systems','FPGA',
];

// ── State ──────────────────────────────────────────────────────────────────
let profile = loadProfile();

function loadProfile() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? { ...DEFAULT_USER, ...JSON.parse(s) } : { ...DEFAULT_USER };
  } catch { return { ...DEFAULT_USER }; }
}

// ── Match calculation ───────────────────────────────────────────────────────
function calcPct(job) {
  const us = profile.skills.map(s => s.toLowerCase());
  let hit = 0;
  const total = job.skills.length + 1;
  job.skills.forEach(s => { if (us.includes(s.toLowerCase())) hit++; });
  const ui = JP_ORDER.indexOf(profile.japaneseLevel);
  const ri = JP_ORDER.indexOf(job.jlpt);
  if (ui >= ri) hit++;
  return Math.round(hit / total * 100);
}

function getStats() {
  const pcts = JOBS_LITE.map(calcPct);
  return {
    total: JOBS_LITE.length,
    high:  pcts.filter(p => p >= 70).length,
    mid:   pcts.filter(p => p >= 40 && p < 70).length,
    low:   pcts.filter(p => p < 40).length,
  };
}

// ── Render ──────────────────────────────────────────────────────────────────
function renderHero() {
  const initial = (profile.name || 'U')[0].toUpperCase();
  set('heroAvt',    initial);
  set('heroName',   profile.name);
  set('heroRole',   profile.title || 'IT Developer');
  set('heroLoc',    `📍 ${profile.location}`);
  set('heroExp',    `💼 ${profile.experience} kinh nghiệm`);
  set('heroJp',     profile.japaneseLevel);
  set('hdrAvatar',  initial);
  set('hdrName',    profile.name);
  set('hdrSub',     `${profile.title || 'IT Dev'} · ${profile.japaneseLevel} · ${profile.location}`);

  // Mini skill preview in hero (up to 5)
  document.getElementById('heroSkillsPreview').innerHTML =
    profile.skills.slice(0, 6).map(s =>
      `<span class="hero-skill-tag">${s}</span>`
    ).join('') + (profile.skills.length > 6
      ? `<span class="hero-skill-tag">+${profile.skills.length - 6} khác</span>` : '');
}

function renderStats() {
  const s = getStats();
  document.getElementById('pStats').innerHTML = `
    <div class="stat-card"><div class="stat-num sn-blue">${s.total}</div><div class="stat-lbl">Tổng job</div></div>
    <div class="stat-card"><div class="stat-num sn-green">${s.high}</div><div class="stat-lbl">Phù hợp cao ≥70%</div></div>
    <div class="stat-card"><div class="stat-num sn-amber">${s.mid}</div><div class="stat-lbl">Phù hợp TB 40–69%</div></div>
  `;
}

function renderJPCards() {
  document.getElementById('jpCards').innerHTML = JP_ORDER.map(lv => `
    <div class="jp-card ${lv === profile.japaneseLevel ? 'sel' : ''}" onclick="selectJP('${lv}')">
      <div class="jp-lv">${lv}</div>
      <div class="jp-sub">${JP_LABEL[lv]}</div>
    </div>
  `).join('');
  document.getElementById('jpHint').textContent =
    `${profile.japaneseLevel} — ${JP_DESC[profile.japaneseLevel]}`;
}

function renderSkills() {
  const { skills } = profile;
  set('skillCount', `${skills.length} kỹ năng`);
  document.getElementById('skillChips').innerHTML = skills.length
    ? skills.map(s => `
        <span class="s-chip">
          ${s}
          <button onclick="removeSkill('${s.replace(/'/g, "\\'")}')" title="Xóa kỹ năng">×</button>
        </span>`).join('')
    : `<span style="font-size:13px;color:var(--gray-400)">Chưa có kỹ năng nào. Thêm kỹ năng bên dưới.</span>`;

  const added = new Set(skills.map(s => s.toLowerCase()));
  document.getElementById('suggestRow').innerHTML =
    SUGGEST_POOL.filter(s => !added.has(s.toLowerCase()))
      .slice(0, 14)
      .map(s => `<span class="sug-chip" onclick="addSkill('${s}')">${s}</span>`)
      .join('');
}

function renderForm() {
  document.getElementById('fName').value = profile.name;
  document.getElementById('fRole').value = profile.title || '';
  document.getElementById('fExp').value  = profile.experience;
  document.getElementById('fLoc').value  = profile.location;
}

function renderAll() {
  renderHero();
  renderStats();
  renderJPCards();
  renderSkills();
  renderForm();
}

// ── Actions ─────────────────────────────────────────────────────────────────
function selectJP(level) {
  profile.japaneseLevel = level;
  renderJPCards();
  renderStats();
  renderHero();
}

function addSkill(skill) {
  if (!profile.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())) {
    profile.skills.push(skill);
    renderSkills();
    renderStats();
    renderHero();
  }
}

function removeSkill(skill) {
  profile.skills = profile.skills.filter(s => s !== skill);
  renderSkills();
  renderStats();
  renderHero();
}

function saveProfile() {
  const name = document.getElementById('fName').value.trim();
  const role = document.getElementById('fRole').value.trim();
  const exp  = document.getElementById('fExp').value;
  const loc  = document.getElementById('fLoc').value;

  if (!name) { showToast('⚠️ Vui lòng nhập họ và tên'); return; }

  profile.name       = name;
  profile.title      = role;
  profile.experience = exp;
  profile.location   = loc;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  renderAll();
  showToast('✅ Đã lưu hồ sơ thành công!');
}

function resetProfile() {
  if (!confirm('Bạn có chắc muốn đặt lại về hồ sơ mặc định không?')) return;
  profile = { ...DEFAULT_USER };
  localStorage.removeItem(STORAGE_KEY);
  renderAll();
  showToast('↺ Đã đặt lại hồ sơ mặc định');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2600);
}

// ── Utility ─────────────────────────────────────────────────────────────────
function set(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderAll();

  // Add skill: button click or Enter key
  const inp = document.getElementById('skillInput');
  document.getElementById('addSkillBtn').addEventListener('click', () => {
    const v = inp.value.trim();
    if (v) { addSkill(v); inp.value = ''; inp.focus(); }
  });
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const v = inp.value.trim();
      if (v) { addSkill(v); inp.value = ''; }
    }
  });

  // Live preview: form fields → hero card
  document.getElementById('fName').addEventListener('input',  e => { profile.name       = e.target.value; renderHero(); });
  document.getElementById('fRole').addEventListener('input',  e => { profile.title      = e.target.value; renderHero(); });
  document.getElementById('fExp') .addEventListener('change', e => { profile.experience = e.target.value; renderHero(); });
  document.getElementById('fLoc') .addEventListener('change', e => { profile.location   = e.target.value; renderHero(); });
});
