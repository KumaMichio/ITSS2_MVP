import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const companies = [
  // index 0
  {
    name: 'Sony Corporation',
    logo: 'S', logoColor: '#003087',
    size: 'Lớn (>10,000 nhân viên)', founded: 1946,
    website: 'https://sony.com', linkedin: 'sony',
    description: 'Sony Corporation là tập đoàn đa quốc gia Nhật Bản, chuyên về điện tử tiêu dùng, phim ảnh, âm nhạc và tài chính.',
    reviewCount: 1250, glassdoor: 4.2, trustScore: 95,
  },
  // index 1
  {
    name: 'Rakuten, Inc.',
    logo: 'R', logoColor: '#BF0000',
    size: 'Lớn (>10,000 nhân viên)', founded: 1997,
    website: 'https://rakuten.co.jp', linkedin: 'rakuten',
    description: 'Rakuten là một trong những công ty thương mại điện tử và internet lớn nhất Nhật Bản với hơn 70 dịch vụ toàn cầu.',
    reviewCount: 890, glassdoor: 3.9, trustScore: 80,
  },
  // index 2
  {
    name: 'DeNA Co., Ltd.',
    logo: 'D', logoColor: '#00A4E4',
    size: 'Trung bình (1,000-5,000)', founded: 1999,
    website: 'https://dena.com', linkedin: null,
    description: 'DeNA là công ty công nghệ Nhật Bản nổi tiếng với game mobile, AI và các dịch vụ internet sáng tạo.',
    reviewCount: 320, glassdoor: 4.0, trustScore: 75,
  },
  // index 3
  {
    name: 'Nintendo Co., Ltd.',
    logo: 'N', logoColor: '#E4000F',
    size: 'Lớn (>10,000 nhân viên)', founded: 1889,
    website: 'https://nintendo.co.jp', linkedin: 'nintendo',
    description: 'Nintendo là công ty game nổi tiếng thế giới với các thương hiệu Mario, Zelda, Pokémon. Trụ sở chính tại Kyoto.',
    reviewCount: 2100, glassdoor: 4.5, trustScore: 95,
  },
  // index 4
  {
    name: 'LINE Corporation',
    logo: 'L', logoColor: '#00B900',
    size: 'Lớn (>5,000 nhân viên)', founded: 2000,
    website: 'https://linecorp.com', linkedin: 'line-corporation',
    description: 'LINE là ứng dụng nhắn tin hàng đầu tại Nhật, Đài Loan, Thái Lan với hàng trăm triệu người dùng hàng tháng.',
    reviewCount: 780, glassdoor: 4.1, trustScore: 83,
  },
  // index 5
  {
    name: 'Tech Startup XYZ',
    logo: 'X', logoColor: '#6B7280',
    size: 'Nhỏ (<50 nhân viên)', founded: 2023,
    website: null, linkedin: null, description: null,
    reviewCount: 0, glassdoor: null, trustScore: 10,
  },
  // index 6
  {
    name: 'Toyota Motor Corporation',
    logo: 'T', logoColor: '#EB0A1E',
    size: 'Tập đoàn (>100,000 nhân viên)', founded: 1937,
    website: 'https://toyota.co.jp', linkedin: 'toyota-motor-corporation',
    description: 'Toyota là nhà sản xuất ô tô lớn nhất thế giới, đang đầu tư mạnh vào phần mềm, xe điện và xe tự lái.',
    reviewCount: 3200, glassdoor: 4.3, trustScore: 100,
  },
  // index 7
  {
    name: 'SoftBank Corp.',
    logo: 'SB', logoColor: '#FF8A00',
    size: 'Lớn (>10,000 nhân viên)', founded: 1981,
    website: 'https://softbank.jp', linkedin: null,
    description: 'SoftBank là tập đoàn viễn thông và đầu tư công nghệ hàng đầu Nhật Bản với portfolio đầu tư khổng lồ toàn cầu.',
    reviewCount: 15, glassdoor: 3.5, trustScore: 70,
  },
  // index 8
  {
    name: 'Mercari, Inc.',
    logo: 'M', logoColor: '#FF0211',
    size: 'Trung bình (1,000-5,000)', founded: 2013,
    website: 'https://mercari.com', linkedin: 'mercari',
    description: 'Mercari là nền tảng marketplace C2C lớn nhất Nhật Bản, đang mở rộng sang Mỹ và các thị trường quốc tế.',
    reviewCount: 540, glassdoor: 4.2, trustScore: 80,
  },
  // index 9
  {
    name: 'Panasonic Holdings',
    logo: 'P', logoColor: '#0032A0',
    size: 'Tập đoàn (>100,000 nhân viên)', founded: 1918,
    website: 'https://panasonic.com', linkedin: 'panasonic',
    description: 'Panasonic là tập đoàn điện tử Nhật Bản với lịch sử hơn 100 năm, chuyên điện tử gia dụng, năng lượng và automotive.',
    reviewCount: 2800, glassdoor: 3.9, trustScore: 95,
  },
  // index 10
  {
    name: 'Fujitsu Limited',
    logo: 'FJ', logoColor: '#FF0000',
    size: 'Tập đoàn (>100,000 nhân viên)', founded: 1935,
    website: 'https://fujitsu.com', linkedin: 'fujitsu',
    description: 'Fujitsu là tập đoàn công nghệ thông tin hàng đầu Nhật Bản, cung cấp dịch vụ IT, cloud, AI và tư vấn chuyển đổi số.',
    reviewCount: 1800, glassdoor: 3.8, trustScore: 90,
  },
  // index 11
  {
    name: 'NTT Data Corporation',
    logo: 'NT', logoColor: '#003087',
    size: 'Tập đoàn (>100,000 nhân viên)', founded: 1988,
    website: 'https://nttdata.com', linkedin: 'ntt-data',
    description: 'NTT Data là công ty IT toàn cầu thuộc tập đoàn NTT, cung cấp giải pháp phần mềm và dịch vụ cloud cho khách hàng doanh nghiệp.',
    reviewCount: 1200, glassdoor: 3.9, trustScore: 88,
  },
  // index 12
  {
    name: 'CyberAgent, Inc.',
    logo: 'CA', logoColor: '#0066FF',
    size: 'Lớn (>5,000 nhân viên)', founded: 1998,
    website: 'https://cyberagent.co.jp', linkedin: 'cyberagent',
    description: 'CyberAgent là công ty internet và truyền thông Nhật Bản nổi tiếng với AbemaTV, Ameba blog và nhiều game mobile phổ biến.',
    reviewCount: 680, glassdoor: 4.1, trustScore: 82,
  },
  // index 13
  {
    name: 'Recruit Holdings Co.',
    logo: 'RC', logoColor: '#E6002D',
    size: 'Tập đoàn (>100,000 nhân viên)', founded: 1960,
    website: 'https://recruit.co.jp', linkedin: 'recruit',
    description: 'Recruit Holdings là tập đoàn tuyển dụng và truyền thông lớn nhất Nhật Bản, sở hữu Indeed, Glassdoor và nhiều nền tảng toàn cầu.',
    reviewCount: 2500, glassdoor: 4.2, trustScore: 92,
  },
  // index 14
  {
    name: 'SmartHR Inc.',
    logo: 'SH', logoColor: '#6366F1',
    size: 'Trung bình (1,000-5,000)', founded: 2013,
    website: 'https://smarthr.jp', linkedin: 'smarthr',
    description: 'SmartHR là startup SaaS HR hàng đầu Nhật Bản, cung cấp giải pháp quản lý nhân sự cho hơn 40,000 công ty.',
    reviewCount: 280, glassdoor: 4.3, trustScore: 78,
  },
  // index 15
  {
    name: 'Money Forward, Inc.',
    logo: 'MF', logoColor: '#0B6E4F',
    size: 'Trung bình (1,000-5,000)', founded: 2012,
    website: 'https://moneyforward.com', linkedin: 'money-forward',
    description: 'Money Forward là công ty fintech hàng đầu Nhật Bản, cung cấp dịch vụ quản lý tài chính cá nhân và kế toán doanh nghiệp.',
    reviewCount: 420, glassdoor: 4.1, trustScore: 80,
  },
  // index 16
  {
    name: 'Freee K.K.',
    logo: 'FR', logoColor: '#00B4D8',
    size: 'Trung bình (1,000-5,000)', founded: 2012,
    website: 'https://freee.co.jp', linkedin: 'freee',
    description: 'Freee là công ty SaaS kế toán và quản lý nhân sự cho doanh nghiệp vừa và nhỏ tại Nhật Bản với hơn 1.5 triệu khách hàng.',
    reviewCount: 350, glassdoor: 4.0, trustScore: 75,
  },
  // index 17
  {
    name: 'Cybozu Inc.',
    logo: 'CY', logoColor: '#E63946',
    size: 'Trung bình (1,000-5,000)', founded: 1997,
    website: 'https://cybozu.co.jp', linkedin: 'cybozu',
    description: 'Cybozu là công ty phần mềm groupware nổi tiếng tại Nhật Bản với sản phẩm kintone và Garoon, hỗ trợ hơn 12,000 doanh nghiệp.',
    reviewCount: 480, glassdoor: 4.2, trustScore: 82,
  },
  // index 18
  {
    name: 'GREE, Inc.',
    logo: 'GR', logoColor: '#FF6B35',
    size: 'Trung bình (1,000-5,000)', founded: 2004,
    website: 'https://gree.net', linkedin: 'gree-inc',
    description: 'GREE là công ty internet và game mobile Nhật Bản, hiện tập trung vào metaverse, blockchain game và các nền tảng XR.',
    reviewCount: 290, glassdoor: 3.8, trustScore: 68,
  },
  // index 19
  {
    name: 'Cookpad Inc.',
    logo: 'CK', logoColor: '#FF4500',
    size: 'Nhỏ (50-500 nhân viên)', founded: 1998,
    website: 'https://cookpad.com', linkedin: 'cookpad',
    description: 'Cookpad là nền tảng chia sẻ công thức nấu ăn lớn nhất thế giới với 100 triệu người dùng, có mặt tại 70 quốc gia.',
    reviewCount: 160, glassdoor: 4.0, trustScore: 70,
  },
]

const jobs = [
  // --- Các job cũ (index 0-9) ---
  {
    companyIndex: 0, title: 'Java Developer',
    location: 'Tokyo', salaryMin: 400000, salaryMax: 600000, type: 'Full-time',
    postedAt: new Date('2026-04-28'),
    description: 'Sony tìm Java Developer xây dựng hệ thống backend quy mô lớn phục vụ hàng triệu người dùng toàn cầu.',
    requireSkills: ['Java', 'Spring Boot', 'SQL'], requireJlpt: 'N3', requireExp: '2+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Bảo hiểm sức khỏe đầy đủ', 'Remote 2 ngày/tuần', 'Thưởng năm 4 tháng', 'Hỗ trợ học tiếng Nhật'],
    risks: [],
  },
  {
    companyIndex: 1, title: 'Frontend Developer (React)',
    location: 'Tokyo', salaryMin: 380000, salaryMax: 550000, type: 'Full-time',
    postedAt: new Date('2026-04-30'),
    description: 'Rakuten tìm Frontend Developer phát triển giao diện cho nền tảng thương mại điện tử hàng đầu Nhật Bản.',
    requireSkills: ['React', 'TypeScript', 'CSS'], requireJlpt: 'N2', requireExp: '3+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Bảo hiểm đầy đủ', 'Tiếng Anh là ngôn ngữ chính', 'Thưởng hiệu suất'],
    risks: [],
  },
  {
    companyIndex: 2, title: 'Python / ML Engineer',
    location: 'Osaka', salaryMin: 420000, salaryMax: 650000, type: 'Full-time',
    postedAt: new Date('2026-04-25'),
    description: 'DeNA tìm ML Engineer xây dựng mô hình học máy ứng dụng trong game và dịch vụ internet quy mô lớn.',
    requireSkills: ['Python', 'TensorFlow', 'SQL'], requireJlpt: 'N3', requireExp: '2+',
    requireEdu: 'Đại học (ưu tiên AI/Data)',
    benefits: ['Bảo hiểm sức khỏe', 'Hỗ trợ nghiên cứu AI', 'Flexible hours'],
    risks: [],
  },
  {
    companyIndex: 3, title: 'iOS Developer',
    location: 'Kyoto', salaryMin: 350000, salaryMax: 500000, type: 'Full-time',
    postedAt: new Date('2026-04-20'),
    description: 'Nintendo tìm iOS Developer phát triển ứng dụng mobile cho hệ sinh thái game và giải trí.',
    requireSkills: ['Swift', 'iOS', 'Xcode'], requireJlpt: 'N4', requireExp: '2+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Bảo hiểm toàn diện', 'Game miễn phí', 'Môi trường sáng tạo', 'Thưởng tháng 13'],
    risks: [],
  },
  {
    companyIndex: 4, title: 'Backend Engineer (Go)',
    location: 'Tokyo', salaryMin: 500000, salaryMax: 750000, type: 'Full-time',
    postedAt: new Date('2026-05-01'),
    description: 'LINE tìm Backend Engineer giỏi Go phát triển hạ tầng nhắn tin xử lý hàng tỷ tin nhắn mỗi ngày.',
    requireSkills: ['Go', 'Docker', 'Kubernetes'], requireJlpt: 'N2', requireExp: '3+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Lương cạnh tranh', 'Bảo hiểm cao cấp', 'Stock options', 'Remote toàn phần'],
    risks: [],
  },
  {
    companyIndex: 5, title: 'PHP Developer',
    location: 'Tokyo', salaryMin: 250000, salaryMax: 350000, type: 'Full-time',
    postedAt: new Date('2026-05-02'),
    description: 'Startup đang tuyển PHP Developer phát triển web application. Môi trường năng động, nhiều cơ hội thăng tiến.',
    requireSkills: ['PHP', 'MySQL'], requireJlpt: 'N3', requireExp: '1+',
    requireEdu: 'Cao đẳng trở lên',
    benefits: ['Flexible hours'],
    risks: ['Công ty mới thành lập 2023, chưa có track record', 'Không rõ nguồn tài chính'],
  },
  {
    companyIndex: 6, title: 'DevOps Engineer',
    location: 'Nagoya', salaryMin: 430000, salaryMax: 620000, type: 'Full-time',
    postedAt: new Date('2026-04-15'),
    description: 'Toyota tìm DevOps Engineer xây dựng hạ tầng cloud cho hệ thống phần mềm xe hơi thế hệ mới.',
    requireSkills: ['AWS', 'Docker', 'Linux'], requireJlpt: 'N2', requireExp: '3+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Phúc lợi tập đoàn', 'Bảo hiểm toàn diện', 'Xe Toyota ưu đãi', 'Đào tạo nghề nghiệp'],
    risks: [],
  },
  {
    companyIndex: 7, title: 'Data Analyst',
    location: 'Tokyo', salaryMin: 350000, salaryMax: 520000, type: 'Full-time',
    postedAt: new Date('2026-04-22'),
    description: 'SoftBank cần Data Analyst phân tích dữ liệu viễn thông và hành vi người dùng để tối ưu chiến lược kinh doanh.',
    requireSkills: ['SQL', 'Python', 'Tableau'], requireJlpt: 'N3', requireExp: '1+',
    requireEdu: 'Đại học (ưu tiên Thống kê, Kinh tế, CNTT)',
    benefits: ['Bảo hiểm sức khỏe', 'Đào tạo chuyên sâu', 'Thưởng hiệu suất'],
    risks: [],
  },
  {
    companyIndex: 8, title: 'Full Stack Developer',
    location: 'Tokyo', salaryMin: 500000, salaryMax: 800000, type: 'Full-time',
    postedAt: new Date('2026-05-02'),
    description: 'Mercari tìm Full Stack Developer phát triển marketplace với scale hàng triệu giao dịch mỗi ngày.',
    requireSkills: ['React', 'Node.js', 'TypeScript'], requireJlpt: 'N2', requireExp: '3+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Lương top-tier', 'Full remote', 'Stock options', 'Bảo hiểm cao cấp', 'Learning budget'],
    risks: [],
  },
  {
    companyIndex: 9, title: 'Embedded Systems Engineer',
    location: 'Osaka', salaryMin: 380000, salaryMax: 580000, type: 'Full-time',
    postedAt: new Date('2026-04-18'),
    description: 'Panasonic cần Embedded Systems Engineer phát triển firmware cho thiết bị điện tử và automotive.',
    requireSkills: ['C++', 'Embedded Systems', 'Linux'], requireJlpt: 'N3', requireExp: '2+',
    requireEdu: 'Đại học (Kỹ thuật điện, Điện tử, CNTT)',
    benefits: ['Bảo hiểm tập đoàn', 'Hỗ trợ nhà ở', 'Đào tạo kỹ thuật chuyên sâu'],
    risks: [],
  },

  // --- Jobs mới (index 10-29) ---
  {
    companyIndex: 10, title: 'Cloud Solutions Architect',
    location: 'Tokyo', salaryMin: 650000, salaryMax: 950000, type: 'Full-time',
    postedAt: new Date('2026-05-10'),
    description: 'Fujitsu tìm Cloud Architect thiết kế và triển khai giải pháp cloud cho khách hàng doanh nghiệp lớn tại Nhật Bản và quốc tế.',
    requireSkills: ['AWS', 'Java', 'Docker', 'Kubernetes'], requireJlpt: 'N2', requireExp: '5+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Lương cao top market', 'Bảo hiểm tập đoàn', 'Certification budget', 'Work from anywhere'],
    risks: [],
  },
  {
    companyIndex: 11, title: 'Java Backend Engineer',
    location: 'Tokyo', salaryMin: 500000, salaryMax: 750000, type: 'Full-time',
    postedAt: new Date('2026-05-08'),
    description: 'NTT Data tìm Java Engineer phát triển hệ thống core banking và tài chính cho các ngân hàng lớn tại Nhật Bản.',
    requireSkills: ['Java', 'Spring Boot', 'SQL', 'Git'], requireJlpt: 'N3', requireExp: '3+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Ổn định dài hạn', 'Bảo hiểm đầy đủ', 'Thưởng cuối năm', 'Đào tạo chứng chỉ'],
    risks: [],
  },
  {
    companyIndex: 12, title: 'React Frontend Engineer',
    location: 'Tokyo', salaryMin: 450000, salaryMax: 700000, type: 'Full-time',
    postedAt: new Date('2026-05-12'),
    description: 'CyberAgent tìm Frontend Engineer phát triển AbemaTV và các sản phẩm video streaming hàng triệu người dùng.',
    requireSkills: ['React', 'TypeScript', 'Node.js'], requireJlpt: 'N2', requireExp: '2+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Flexible remote', 'Bảo hiểm cao cấp', 'Thưởng hiệu suất', 'Learning budget'],
    risks: [],
  },
  {
    companyIndex: 12, title: 'Android Developer (Kotlin)',
    location: 'Tokyo', salaryMin: 450000, salaryMax: 680000, type: 'Full-time',
    postedAt: new Date('2026-05-05'),
    description: 'CyberAgent tìm Android Developer phát triển các ứng dụng game mobile và giải trí trên nền tảng Android.',
    requireSkills: ['Android', 'Kotlin', 'Java'], requireJlpt: 'N3', requireExp: '2+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Remote hybrid', 'Bảo hiểm đầy đủ', 'Game account', 'Thưởng dự án'],
    risks: [],
  },
  {
    companyIndex: 13, title: 'Node.js Backend Developer',
    location: 'Tokyo', salaryMin: 600000, salaryMax: 900000, type: 'Full-time',
    postedAt: new Date('2026-05-14'),
    description: 'Recruit Holdings tìm Node.js Developer xây dựng API và microservices cho nền tảng tuyển dụng Indeed tại thị trường châu Á.',
    requireSkills: ['Node.js', 'TypeScript', 'SQL', 'Docker'], requireJlpt: 'N2', requireExp: '3+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Lương cạnh tranh', 'Stock options', 'Remote toàn phần', 'Bảo hiểm cao cấp'],
    risks: [],
  },
  {
    companyIndex: 13, title: 'Data Scientist',
    location: 'Tokyo', salaryMin: 550000, salaryMax: 850000, type: 'Full-time',
    postedAt: new Date('2026-05-06'),
    description: 'Recruit tìm Data Scientist phân tích dữ liệu hàng triệu tin tuyển dụng và người dùng để xây dựng recommendation engine.',
    requireSkills: ['Python', 'SQL', 'TensorFlow', 'PyTorch'], requireJlpt: 'N2', requireExp: '2+',
    requireEdu: 'Đại học (ưu tiên Toán, Thống kê, CNTT)',
    benefits: ['Lương cao', 'Research budget', 'Remote 3 ngày/tuần', 'Bảo hiểm tốt'],
    risks: [],
  },
  {
    companyIndex: 14, title: 'Backend Engineer (Ruby/Rails)',
    location: 'Tokyo', salaryMin: 500000, salaryMax: 750000, type: 'Full-time',
    postedAt: new Date('2026-05-09'),
    description: 'SmartHR tìm Backend Engineer phát triển nền tảng HR SaaS phục vụ hơn 40,000 công ty Nhật Bản.',
    requireSkills: ['Python', 'SQL', 'Docker', 'Git'], requireJlpt: 'N3', requireExp: '2+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Remote-first', 'Equity options', 'Bảo hiểm tốt', 'Flex hours', 'Learning budget'],
    risks: [],
  },
  {
    companyIndex: 15, title: 'Java/Spring Engineer (Fintech)',
    location: 'Tokyo', salaryMin: 520000, salaryMax: 780000, type: 'Full-time',
    postedAt: new Date('2026-05-11'),
    description: 'Money Forward tìm Java Engineer phát triển các dịch vụ kế toán và thanh toán cho hơn 1 triệu doanh nghiệp Nhật Bản.',
    requireSkills: ['Java', 'Spring Boot', 'SQL', 'Docker'], requireJlpt: 'N3', requireExp: '3+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Thưởng hiệu suất', 'Bảo hiểm cao cấp', 'Remote hybrid', 'Stock options'],
    risks: [],
  },
  {
    companyIndex: 16, title: 'Python Backend Developer',
    location: 'Tokyo', salaryMin: 450000, salaryMax: 680000, type: 'Full-time',
    postedAt: new Date('2026-05-07'),
    description: 'Freee tìm Python Developer xây dựng API và tự động hóa quy trình kế toán cho doanh nghiệp vừa và nhỏ Nhật Bản.',
    requireSkills: ['Python', 'SQL', 'Docker', 'Linux'], requireJlpt: 'N3', requireExp: '2+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Remote toàn phần', 'Flex hours', 'Learning budget', 'Bảo hiểm đầy đủ'],
    risks: [],
  },
  {
    companyIndex: 17, title: 'Full Stack Engineer (kintone)',
    location: 'Tokyo', salaryMin: 480000, salaryMax: 720000, type: 'Full-time',
    postedAt: new Date('2026-05-13'),
    description: 'Cybozu tìm Full Stack Engineer phát triển nền tảng no-code kintone, giải pháp quản lý công việc cho 12,000+ doanh nghiệp.',
    requireSkills: ['React', 'TypeScript', 'Node.js', 'SQL'], requireJlpt: 'N3', requireExp: '2+',
    requireEdu: 'Đại học trở lên',
    benefits: ['100% Remote OK', 'Kintone license', 'Bảo hiểm tốt', 'Thưởng dự án'],
    risks: [],
  },
  {
    companyIndex: 18, title: 'Game Backend Developer (Java)',
    location: 'Tokyo', salaryMin: 380000, salaryMax: 560000, type: 'Full-time',
    postedAt: new Date('2026-05-04'),
    description: 'GREE tìm Game Backend Developer xây dựng server cho các game blockchain và ứng dụng metaverse thế hệ mới.',
    requireSkills: ['Java', 'SQL', 'Linux'], requireJlpt: 'N4', requireExp: '1+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Game allowance', 'Flexible hours', 'Bảo hiểm đầy đủ'],
    risks: [],
  },
  {
    companyIndex: 19, title: 'Backend Developer (Python)',
    location: 'Tokyo', salaryMin: 370000, salaryMax: 530000, type: 'Full-time',
    postedAt: new Date('2026-05-03'),
    description: 'Cookpad tìm Backend Developer phát triển API và hệ thống recommendation cho 100 triệu người dùng trên toàn thế giới.',
    requireSkills: ['Python', 'SQL', 'Docker'], requireJlpt: 'N3', requireExp: '1+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Remote hybrid', 'Bữa ăn công ty', 'Flexible hours', 'Bảo hiểm đầy đủ'],
    risks: [],
  },
  {
    companyIndex: 0, title: 'Android Mobile Developer',
    location: 'Tokyo', salaryMin: 450000, salaryMax: 650000, type: 'Full-time',
    postedAt: new Date('2026-05-15'),
    description: 'Sony tìm Android Developer phát triển ứng dụng âm nhạc và giải trí trên thiết bị di động cho thị trường toàn cầu.',
    requireSkills: ['Android', 'Kotlin', 'Java', 'Git'], requireJlpt: 'N3', requireExp: '2+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Remote 2 ngày/tuần', 'Bảo hiểm cao cấp', 'Thưởng năm', 'Discount sản phẩm Sony'],
    risks: [],
  },
  {
    companyIndex: 1, title: 'Data Engineer (Spark/SQL)',
    location: 'Tokyo', salaryMin: 520000, salaryMax: 780000, type: 'Full-time',
    postedAt: new Date('2026-05-16'),
    description: 'Rakuten tìm Data Engineer xây dựng data pipeline và data warehouse cho hệ thống analytics thương mại điện tử.',
    requireSkills: ['Python', 'SQL', 'Docker', 'Linux'], requireJlpt: 'N2', requireExp: '3+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Bảo hiểm đầy đủ', 'Tiếng Anh môi trường làm việc', 'Stock RSU', 'Remote hybrid'],
    risks: [],
  },
  {
    companyIndex: 6, title: 'Cloud Infrastructure Engineer',
    location: 'Tokyo', salaryMin: 580000, salaryMax: 850000, type: 'Full-time',
    postedAt: new Date('2026-05-17'),
    description: 'Toyota Connected tìm Cloud Engineer vận hành hạ tầng AWS phục vụ hệ thống connected car và dịch vụ IoT xe thông minh.',
    requireSkills: ['AWS', 'Docker', 'Kubernetes', 'Python', 'Linux'], requireJlpt: 'N2', requireExp: '3+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Lương tập đoàn', 'Bảo hiểm toàn diện', 'AWS certification paid', 'Xe ưu đãi'],
    risks: [],
  },
  {
    companyIndex: 8, title: 'Site Reliability Engineer (SRE)',
    location: 'Tokyo', salaryMin: 600000, salaryMax: 900000, type: 'Full-time',
    postedAt: new Date('2026-05-18'),
    description: 'Mercari tìm SRE đảm bảo độ ổn định và hiệu năng cho nền tảng marketplace C2C scale hàng triệu user đồng thời.',
    requireSkills: ['Docker', 'Kubernetes', 'Python', 'Linux', 'AWS'], requireJlpt: 'N2', requireExp: '3+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Full remote', 'Lương cao nhất market', 'Stock options', 'SRE tools budget'],
    risks: [],
  },
  {
    companyIndex: 4, title: 'Security Engineer',
    location: 'Tokyo', salaryMin: 550000, salaryMax: 800000, type: 'Full-time',
    postedAt: new Date('2026-05-19'),
    description: 'LINE tìm Security Engineer bảo vệ hệ thống nhắn tin và dữ liệu của hàng trăm triệu người dùng khỏi các mối đe dọa an ninh mạng.',
    requireSkills: ['Linux', 'Python', 'Docker'], requireJlpt: 'N2', requireExp: '3+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Lương cạnh tranh', 'Security conference budget', 'Remote hybrid', 'Bảo hiểm cao cấp'],
    risks: [],
  },
  {
    companyIndex: 9, title: 'IoT & Edge Computing Engineer',
    location: 'Osaka', salaryMin: 430000, salaryMax: 650000, type: 'Full-time',
    postedAt: new Date('2026-05-20'),
    description: 'Panasonic tìm IoT Engineer phát triển giải pháp edge computing và firmware cho thiết bị nhà thông minh và factory automation.',
    requireSkills: ['Python', 'Linux', 'Docker', 'C++'], requireJlpt: 'N3', requireExp: '2+',
    requireEdu: 'Đại học (Kỹ thuật điện, điện tử, CNTT)',
    benefits: ['Bảo hiểm tập đoàn', 'Hỗ trợ nhà ở Osaka', 'Đào tạo kỹ thuật', 'Thưởng dự án'],
    risks: [],
  },
  {
    companyIndex: 3, title: 'C++ Game Engine Developer',
    location: 'Kyoto', salaryMin: 420000, salaryMax: 650000, type: 'Full-time',
    postedAt: new Date('2026-05-21'),
    description: 'Nintendo tìm C++ Developer phát triển game engine và hệ thống đồ họa cho các tựa game đình đám trên Nintendo Switch thế hệ mới.',
    requireSkills: ['C++', 'Git', 'Linux'], requireJlpt: 'N4', requireExp: '2+',
    requireEdu: 'Đại học (ưu tiên Khoa học máy tính, Đồ họa)',
    benefits: ['Bảo hiểm toàn diện', 'Game hardware miễn phí', 'Môi trường sáng tạo', 'Thưởng tháng 13'],
    risks: [],
  },
  {
    companyIndex: 2, title: 'QA Engineer (Automation)',
    location: 'Osaka', salaryMin: 360000, salaryMax: 520000, type: 'Full-time',
    postedAt: new Date('2026-05-22'),
    description: 'DeNA tìm QA Engineer xây dựng framework kiểm thử tự động cho game mobile và dịch vụ internet. Remote-friendly.',
    requireSkills: ['Python', 'Git', 'Linux'], requireJlpt: 'N3', requireExp: '2+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Remote hybrid', 'Flexible hours', 'Bảo hiểm sức khỏe', 'Game account'],
    risks: [],
  },
  {
    companyIndex: 10, title: 'AI/ML Engineer (NLP)',
    location: 'Tokyo', salaryMin: 580000, salaryMax: 880000, type: 'Full-time',
    postedAt: new Date('2026-05-23'),
    description: 'Fujitsu Research tìm AI Engineer nghiên cứu và phát triển các mô hình NLP/LLM ứng dụng trong tư vấn doanh nghiệp và chuyển đổi số.',
    requireSkills: ['Python', 'TensorFlow', 'PyTorch', 'SQL'], requireJlpt: 'N2', requireExp: '3+',
    requireEdu: 'Thạc sĩ/Tiến sĩ AI, CNTT',
    benefits: ['Research budget lớn', 'Publish papers', 'Conference expenses', 'Lương top 10%'],
    risks: [],
  },
  {
    companyIndex: 11, title: 'Infrastructure Engineer (On-premise & Cloud)',
    location: 'Tokyo', salaryMin: 480000, salaryMax: 720000, type: 'Full-time',
    postedAt: new Date('2026-05-24'),
    description: 'NTT Data tìm Infrastructure Engineer thiết kế hạ tầng hybrid cloud cho các khách hàng chính phủ và ngân hàng lớn nhất Nhật Bản.',
    requireSkills: ['Linux', 'AWS', 'Docker', 'Git'], requireJlpt: 'N3', requireExp: '3+',
    requireEdu: 'Đại học trở lên',
    benefits: ['Ổn định lâu dài', 'Bảo hiểm đầy đủ', 'Certification support', 'Thưởng cuối năm'],
    risks: [],
  },
]

async function main() {
  console.log('Seeding database...')

  await prisma.application.deleteMany()
  await prisma.bookmark.deleteMany()
  await prisma.job.deleteMany()
  await prisma.company.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.user.deleteMany()

  const createdCompanies = await Promise.all(
    companies.map(c => prisma.company.create({ data: c }))
  )
  console.log(`Created ${createdCompanies.length} companies`)

  const createdJobs = await Promise.all(
    jobs.map(j => {
      const { companyIndex, ...jobData } = j
      return prisma.job.create({
        data: { ...jobData, companyId: createdCompanies[companyIndex].id },
      })
    })
  )
  console.log(`Created ${createdJobs.length} jobs`)

  const hashedPassword = await bcrypt.hash('demo123456', 10)
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@jobmatch.jp',
      password: hashedPassword,
      name: 'Nguyen Van A',
      profile: {
        create: {
          skills: ['Java', 'Spring Boot', 'SQL', 'Python', 'Git', 'Linux', 'Docker'],
          japaneseLevel: 'N3',
          location: 'Tokyo',
          experienceYears: 3,
          currentTitle: 'Backend Developer',
        },
      },
    },
  })
  console.log(`Created demo user: ${demoUser.email} / demo123456`)
  console.log('Seeding complete!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
