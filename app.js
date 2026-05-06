// ========== Loading Screen ==========
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('hide');
    setTimeout(() => document.getElementById('loading-screen').remove(), 500);
  }, 2600);
});

// ========== Reading Progress Bar ==========
(function initReadingProgress() {
  const progressBar = document.getElementById('reading-progress');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateProgress);
  updateProgress();
})();

// ========== Quick Contact Widget ==========
(function initContactWidget() {
  const bubble = document.getElementById('contact-bubble');
  const panel = document.getElementById('contact-panel');
  const closeBtn = document.getElementById('contact-close');

  if (!bubble || !panel) return;

  // Toggle panel
  bubble.addEventListener('click', () => {
    panel.classList.toggle('open');
  });

  // Close panel
  closeBtn.addEventListener('click', () => {
    panel.classList.remove('open');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#contact-widget')) {
      panel.classList.remove('open');
    }
  });

  // Copy functionality
  const copyBtns = panel.querySelectorAll('.copy-btn-small');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = btn.closest('.contact-item');
      const textToCopy = item.dataset.copy;

      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          btn.textContent = '已复制';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = '复制';
            btn.classList.remove('copied');
          }, 1500);
        });
      }
    });
  });
})();

// ========== Particle Effect ==========
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -1000, y: -1000 };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.3 + 0.1;
    }
    update() {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        this.vx -= dx * 0.00008;
        this.vy -= dy * 0.00008;
      }
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = document.body.classList.contains('dark')
        ? `rgba(88, 166, 255, ${this.alpha})`
        : `rgba(0, 112, 243, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 60; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = document.body.classList.contains('dark')
            ? `rgba(88, 166, 255, ${0.08 * (1 - dist / 120)})`
            : `rgba(0, 112, 243, ${0.08 * (1 - dist / 120)})`;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
})();

// ========== Dark Mode ==========
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

function setTheme(dark) {
  document.body.classList.toggle('dark', dark);
  themeIcon.textContent = dark ? '☀️' : '🌙';
  localStorage.setItem('ghz_theme', dark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => {
  setTheme(!document.body.classList.contains('dark'));
});

setTheme(localStorage.getItem('ghz_theme') === 'dark');

// ========== Navigation ==========
const navbar = document.getElementById('navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ========== Typewriter Effect ==========
const typewriterEl = document.getElementById('typewriter');
const slogans = [
  '物联网工程 · 软件测试 · AI 应用',
  '熟悉 Python、C++、Linux',
  '全国大学生智能技术应用大赛国一',
  'Talk is cheap, show me the code'
];
let sloganIdx = 0, charIdx = 0, deleting = false;

function typewrite() {
  const current = slogans[sloganIdx];
  if (!deleting) {
    typewriterEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      setTimeout(() => { deleting = true; typewrite(); }, 2000);
      return;
    }
    setTimeout(typewrite, 80);
  } else {
    typewriterEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      sloganIdx = (sloganIdx + 1) % slogans.length;
      setTimeout(typewrite, 400);
      return;
    }
    setTimeout(typewrite, 40);
  }
}
typewrite();

// ========== Terminal Typing ==========
(function initTerminal() {
  const output = document.getElementById('terminal-output');
  const lines = [
    '{',
    '  "name": "郭洪志",',
    '  "school": "沈阳航空航天大学",',
    '  "major": "物联网工程",',
    '  "skills": ["Python", "C++", "SQL", "Linux", "软件测试"],',
    '  "status": "2026届本科 · 拟录取计算机硕士",',
    '  "motto": "Talk is cheap, show me the code"',
    '}'
  ];

  let lineIdx = 0, charIdx = 0;
  const container = document.createElement('div');
  output.appendChild(container);

  function typeLine() {
    if (lineIdx >= lines.length) return;
    const line = lines[lineIdx];
    if (charIdx === 0) {
      const p = document.createElement('p');
      p.id = `term-line-${lineIdx}`;
      container.appendChild(p);
    }
    const el = document.getElementById(`term-line-${lineIdx}`);
    el.innerHTML = highlightJSON(line.slice(0, charIdx + 1));
    charIdx++;
    if (charIdx === line.length) {
      lineIdx++;
      charIdx = 0;
      setTimeout(typeLine, 100);
    } else {
      setTimeout(typeLine, 20 + Math.random() * 30);
    }
  }

  function highlightJSON(str) {
    return str
      .replace(/"([^"]+)":/g, '<span class="t-cyan">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span style="color:#f59e0b">"$1"</span>')
      .replace(/: \[/g, ': [<span class="t-green">')
      .replace(/\]$/g, '</span>]');
  }

  setTimeout(typeLine, 3000);
})();

// ========== Project Filtering ==========
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      if (filter === 'all' || card.dataset.tags.includes(filter)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ========== 3D Card Tilt ==========
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -5;
    const rotateY = (x - centerX) / centerX * 5;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
  });
});

// ========== Skills Progress Bar Animation ==========
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        fill.style.width = fill.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.3 });

const skillsGrid = document.querySelector('.skills-grid');
if (skillsGrid) skillObserver.observe(skillsGrid);

// ========== Avatar Generator ==========
(function initAvatar() {
  const canvas = document.getElementById('avatar-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = 120;

  // Generate a unique but consistent color from a seed
  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  function hslFromSeed(seed) {
    const h = Math.abs(seed) % 360;
    return `hsl(${h}, 65%, 55%)`;
  }

  const seed = hashCode('郭洪志2026');
  const bgColor = hslFromSeed(seed);
  const patternColor = hslFromSeed(seed + 120);

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, bgColor);
  grad.addColorStop(1, hslFromSeed(seed + 60));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // Geometric pattern — symmetric pixel art style
  const grid = 5;
  const cellW = size / (grid * 2 + 1);
  const cellH = size / (grid * 2 + 1);
  let s = Math.abs(seed);
  function rand() { s = (s * 16807 + 1) % 2147483647; return s; }

  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let y = 0; y < grid; y++) {
    for (let x = 0; x <= Math.floor(grid / 2); x++) {
      if (rand() % 3 !== 0) {
        const px = (x + 0.5) * cellW + cellW * 0.5;
        const py = (y + 1) * cellH;
        const w = cellW * 0.8;
        const h = cellH * 0.8;
        // Left side
        ctx.beginPath();
        ctx.roundRect(px - w / 2, py - h / 2, w, h, 2);
        ctx.fill();
        // Mirror right side
        ctx.beginPath();
        ctx.roundRect(size - px - w / 2, py - h / 2, w, h, 2);
        ctx.fill();
      }
    }
  }

  // Initials
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 36px "Noto Sans SC", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('郭', size / 2, size / 2);
})();

// ========== Modals ==========
function openModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (modal) modal.classList.add('open');
}

function closeModal(id, event) {
  if (event && event.target !== event.currentTarget && !event.target.classList.contains('modal-close')) return;
  const modal = document.getElementById('modal-' + id);
  if (modal) modal.classList.remove('open');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});

// ========== Copy to Clipboard ==========
function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = '已复制';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = '复制';
      btn.classList.remove('copied');
    }, 1500);
  });
}

// ========== Visitor Counter ==========
(function initVisitor() {
  let count = parseInt(localStorage.getItem('ghz_visits') || '0');
  count++;
  localStorage.setItem('ghz_visits', count);
  const el = document.getElementById('visit-count');
  if (el) el.textContent = count;
})();

// ========== Scroll Reveal ==========
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.project-card, .life-card, .timeline-item, .skill-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s, transform 0.5s';
  observer.observe(el);
});

// ========== Chat Widget ==========
const chatBubble = document.getElementById('chat-bubble');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');
let chatHistory = [];

chatBubble.addEventListener('click', () => {
  chatWindow.classList.toggle('open');
  if (chatWindow.classList.contains('open')) chatInput.focus();
});

chatClose.addEventListener('click', () => chatWindow.classList.remove('open'));

function appendChatMsg(text, isUser) {
  const msg = document.createElement('div');
  msg.className = `msg ${isUser ? 'user' : 'bot'}`;
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = text;
  msg.appendChild(bubble);
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotReply(input) {
  const text = input.toLowerCase().trim();

  // Easter egg commands
  if (text === '/help') {
    return '🔑 <b>隐藏指令</b>：<br><code>/help</code> — 查看指令列表<br><code>/whoami</code> — 自我介绍<br><code>/skills</code> — 技能列表<br><code>/projects</code> — 项目经历<br><code>/contact</code> — 联系方式<br><code>/joke</code> — 来个程序员笑话<br><code>/clear</code> — 清空聊天记录<br><code>/matrix</code> — 触发 Matrix 效果<br><code>/konami</code> — 触发 Konami 彩蛋<br><code>/secret</code> — 隐藏彩蛋提示';
  }

  if (text === '/matrix') {
    triggerMatrixEffect();
    return '🟢 Matrix 效果已触发！<br>按 Ctrl+Shift+G 也可以触发哦～';
  }

  if (text === '/konami') {
    triggerKonamiEffect();
    return '🎮 Konami Code 效果已触发！<br>试试用键盘输入 ↑↑↓↓←→←→BA';
  }

  if (text === '/secret') {
    const secrets = [
      '💡 <b>彩蛋提示</b>：',
      '• 连续点击头像 5 次',
      '• 按 Ctrl+Shift+G 触发 Matrix 效果',
      '• 输入 Konami Code（↑↑↓↓←→←→BA）',
      '• 在聊天中输入 /matrix 或 /konami',
      '• 点击右下角的下载名片按钮',
    ];
    return secrets.join('<br>');
  }

  if (text === '/clear') {
    chatMessages.innerHTML = '';
    chatHistory = [];
    return '聊天记录已清空 🧹';
  }

  if (text === '/joke') {
    const jokes = [
      '为什么程序员总是分不清万圣节和圣诞节？因为 Oct 31 == Dec 25。',
      '一个 SQL 语句走进酒吧，看到两张桌子，于是说："我可以 JOIN 你们吗？"',
      '程序员最讨厌的事情：1. 别人不写文档 2. 自己写文档',
      '—— "这个 bug 你修了吗？" —— "在我的电脑上是好的。"',
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  // Context-aware replies
  if (chatHistory.length > 0) {
    const last = chatHistory[chatHistory.length - 1];
    if (last.includes('项目') && (text.includes('第一个') || text.includes('脑部') || text.includes('肿瘤'))) {
      return 'AI 辅助脑部肿瘤识别系统（2025.04-2025.08）：郭洪志负责测试与质量保障，围绕核心流程设计测试用例，累计推动解决 12 个 Bug，参与压力测试优化数据库查询，获全国一等奖。想了解更多可以点击项目卡片的"查看测试报告"按钮～';
    }
    if (last.includes('项目') && (text.includes('第二个') || text.includes('rag') || text.includes('客服'))) {
      return 'RAG + ReAct 智能客服系统（2026.01-2026.03）：郭洪志自学 LangChain、ChromaDB，独立完成融合 RAG 与 ReAct 架构的智能客服。搭建向量知识库（6 类文档、1000+ 条知识），设计 7 个自定义工具，实现个性化报告生成。';
    }
  }

  // Greetings
  if (text.includes('你好') || text.includes('hi') || text.includes('hello') || text.includes('嗨') || text.match(/^(hey|哈喽|在吗)/) || text === '/whoami') {
    return '你好呀！👋 我是郭洪志的数字分身。郭洪志是沈阳航空航天大学物联网工程专业的 2026 届本科毕业生，拟录取计算机硕士。他熟悉 Python、C++、C 语言及 SQL，掌握软件测试基本流程，熟悉 Linux 环境下的项目部署与运维。';
  }

  // Contact
  if (text.includes('联系') || text.includes('邮箱') || text.includes('电话') || text.includes('contact') || text.includes('email') || text.includes('手机') || text === '/contact') {
    return '📧 邮箱：1922726541@qq.com<br>📱 电话：13941002786<br>欢迎随时联系！';
  }

  // Internship
  if (text.includes('实习') || text.includes('intern') || text.includes('工作') || text.includes('数字政通')) {
    return '郭洪志目前在数字政通担任项目实施实习生（2026.03 至今）。主要工作：<br>1. 项目文档整理与规范化编写<br>2. Linux 服务器环境部署、服务运维与日志安全审计<br>3. SQL 数据查询、异常排查与数据安全校验<br>4. 硬件设备部署、系统对接与联调测试';
  }

  // RAG
  if (text.includes('rag') || text.includes('react') || text.includes('检索增强') || text.includes('langchain') || text.includes('chromadb') || text.includes('向量') || text.includes('智能客服')) {
    return '郭洪志独立完成了基于 RAG 和 ReAct 的智能客服系统（2026.01 - 2026.03）。自学 LangChain、ChromaDB 等技术，搭建 Chroma 向量知识库（6 类文档、1000+ 条知识），设计 7 个自定义工具和动态提示词切换机制，实现个性化报告生成。';
  }

  // Projects
  if (text.includes('项目') || text.includes('project') || text.includes('作品') || text === '/projects') {
    chatHistory.push('项目');
    return '郭洪志的项目经历：<br>🧠 AI 辅助脑部肿瘤识别系统（2025.04-2025.08）- 测试与质量保障，获全国一等奖<br>💬 基于 RAG 和 ReAct 的智能客服系统（2026.01-2026.03）- 独立完成<br><br>可以看上面的"项目展厅"板块，点击"查看测试报告"了解详情～';
  }

  // Skills
  if (text.includes('技能') || text.includes('技术栈') || text.includes('skill') || text.includes('会什么') || text.includes('擅长') || text === '/skills') {
    return '专业技能：<br>💻 编程语言：Python、C++、C 语言，掌握 SQL 数据库查询<br>🛠️ 开发工具：PyCharm、VSCode<br>🐧 操作系统：熟悉 Linux 常用命令，可在 Linux 环境下完成项目部署<br>🧪 测试能力：掌握软件测试基本流程，具备手动测试、Bug 追踪与问题复现能力';
  }

  // Education
  if (text.includes('学校') || text.includes('学历') || text.includes('大学') || text.includes('education') || text.includes('毕业') || text.includes('专业')) {
    return '🎓 沈阳航空航天大学 · 物联网工程（本科）<br>📅 2022.09 - 至今<br>📋 拟录取计算机硕士<br>📜 CET-4、CET-6<br>🏆 全国大学生智能技术应用大赛（国一）<br>🏆 数学建模比赛（校一）';
  }

  // Competition / awards
  if (text.includes('比赛') || text.includes('竞赛') || text.includes('国一') || text.includes('奖项') || text.includes('荣誉')) {
    return '荣誉证书：<br>📜 CET-4、CET-6<br>🏆 2025年全国大学生智能技术应用大赛（国一）<br>🏆 2024年数学建模比赛（校一）<br>🎖️ 辽宁省本科大学生计算机博弈大赛优秀志愿者';
  }

  // Brain tumor / testing
  if (text.includes('肿瘤') || text.includes('深度学习') || text.includes('测试') || text.includes('bug')) {
    return 'AI 辅助脑部肿瘤识别系统（2025.04-2025.08）：郭洪志负责系统整体测试与质量保障，围绕核心流程设计测试用例，累计推动解决 12 个 Bug（含严重 2 个），参与压力测试优化数据库查询效率，完成跨平台兼容性验证，获全国一等奖。';
  }

  // Hobbies
  if (text.includes('爱好') || text.includes('兴趣') || text.includes('hobby') || text.includes('喜欢什么')) {
    return '🎮 打王者 — 放松方式之一，享受团队配合<br>📺 追剧 — 喜欢烧脑悬疑和心理博弈类作品<br>🎵 刷抖音 — 科技区 + 搞笑区双修';
  }

  // Easter egg: 王者/游戏
  if (text.includes('王者') || text.includes('游戏') || text.includes('kpl') || text.includes('ag超玩会')) {
    return '哈哈，我平时爱打王者，本命狂铁！KPL 最粉成都 AG 超玩会。平时也喜欢看《欺诈游戏》这种心理博弈剧。要一起探讨吗？';
  }

  // Easter egg: 狂铁
  if (text.includes('狂铁')) {
    return '狂铁超猛的！大招一开，护盾拉满，近战无敌。我最爱用他打对抗路，团战直接冲后排，一打三不是梦 💪';
  }

  // Easter egg: 诈骗/欺诈游戏
  if (text.includes('欺诈') || text.includes('诈欺') || text.includes('liar game')) {
    return '《欺诈游戏》超好看！秋山深一和神崎直的博弈太精彩了。推荐看日剧版，户田惠梨香演的神崎直超可爱～';
  }

  // Easter egg: AI
  if (text === 'ai' || text === '人工智能') {
    return '🤖 AI 是未来！郭洪志正在这个方向深耕，从 RAG 智能客服到 AI 辅助诊断，都在探索 AI 赋能的可能性。有什么 AI 相关的问题欢迎交流～';
  }

  // Easter egg: 彩蛋
  if (text.includes('彩蛋') || text.includes('easter egg') || text.includes('秘密')) {
    return '🥚 被你发现了！这个页面确实藏了不少彩蛋哦～<br>试试：<br>• 输入 <code>/secret</code> 查看彩蛋提示<br>• 连续点击头像 5 次<br>• 按 Ctrl+Shift+G<br>• 输入 ↑↑↓↓←→←→BA';
  }

  // Thank you
  if (text.includes('谢谢') || text.includes('thanks') || text.includes('thank') || text.includes('感谢')) {
    return '不客气！如果还有其他想了解的，随时问我～ 也欢迎直接联系郭洪志：1922726541@qq.com 📧';
  }

  // Default
  return '这个问题我不太确定怎么回答 😅 你可以试试：<br>• 输入 <code>/help</code> 查看隐藏指令<br>• 问我"你是谁"、"项目经历"、"技术栈"、"联系方式"<br>• 问我"爱好"、"比赛"、"实习"等';
}

function handleChatSend() {
  const text = chatInput.value.trim();
  if (!text) return;

  appendChatMsg(text, true);
  chatHistory.push(text);
  chatInput.value = '';

  setTimeout(() => {
    appendChatMsg(getBotReply(text), false);
  }, 300 + Math.random() * 400);
}

chatSend.addEventListener('click', handleChatSend);
chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleChatSend();
});

// ========== Guestbook ==========
const STORAGE_KEY = 'ghz_guestbook';

function loadMessages() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}

function saveMessages(msgs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
}

function formatTime(ts) {
  const d = new Date(ts);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

const REACTIONS_KEY = 'ghz_reactions';
const REACTION_EMOJIS = ['👍', '❤️', '😂', '🎉'];

function loadReactions() {
  try { return JSON.parse(localStorage.getItem(REACTIONS_KEY)) || {}; } catch { return {}; }
}

function saveReactions(reactions) {
  localStorage.setItem(REACTIONS_KEY, JSON.stringify(reactions));
}

function toggleReaction(msgIndex, emoji) {
  const reactions = loadReactions();
  const key = `${msgIndex}_${emoji}`;

  if (!reactions[msgIndex]) reactions[msgIndex] = {};
  if (!reactions[msgIndex][emoji]) reactions[msgIndex][emoji] = { count: 0, active: false };

  if (reactions[msgIndex][emoji].active) {
    reactions[msgIndex][emoji].count--;
    reactions[msgIndex][emoji].active = false;
  } else {
    reactions[msgIndex][emoji].count++;
    reactions[msgIndex][emoji].active = true;
  }

  if (reactions[msgIndex][emoji].count <= 0) {
    delete reactions[msgIndex][emoji];
  }

  saveReactions(reactions);
  renderMessages();
}

function renderMessages() {
  const list = document.getElementById('msg-list');
  const msgs = loadMessages();
  const reactions = loadReactions();

  if (msgs.length === 0) {
    list.innerHTML = '<div class="msg-empty">还没有留言，来抢沙发吧！</div>';
    return;
  }

  list.innerHTML = msgs.map((m, i) => {
    const msgReactions = reactions[i] || {};
    const reactionHtml = REACTION_EMOJIS.map(emoji => {
      const data = msgReactions[emoji] || { count: 0, active: false };
      const activeClass = data.active ? ' active' : '';
      return `<button class="reaction-btn${activeClass}" onclick="toggleReaction(${i}, '${emoji}')">
        <span class="emoji">${emoji}</span>
        <span class="count">${data.count > 0 ? data.count : ''}</span>
      </button>`;
    }).join('');

    return `
      <div class="msg-item">
        <div class="msg-item-header">
          <span>
            <span class="msg-item-name">${escapeHtml(m.name)}</span>
            ${m.email ? `<span class="msg-item-email">&lt;${escapeHtml(m.email)}&gt;</span>` : ''}
          </span>
          <span class="msg-item-time">${formatTime(m.time)}</span>
        </div>
        <div class="msg-item-content">${escapeHtml(m.content)}</div>
        <div class="msg-reactions">${reactionHtml}</div>
        <div class="msg-item-actions">
          <button class="msg-btn edit" onclick="editMessage(${i})">编辑</button>
          <button class="msg-btn delete" onclick="deleteMessage(${i})">删除</button>
        </div>
      </div>
    `;
  }).join('');
}

function submitMessage() {
  const nameInput = document.getElementById('msg-name');
  const emailInput = document.getElementById('msg-email');
  const contentInput = document.getElementById('msg-content');
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const content = contentInput.value.trim();
  if (!name || !content) return;

  const msgs = loadMessages();
  msgs.unshift({ name, email, content, time: Date.now() });
  saveMessages(msgs);
  nameInput.value = '';
  emailInput.value = '';
  contentInput.value = '';
  renderMessages();
}

function deleteMessage(index) {
  const msgs = loadMessages();
  msgs.splice(index, 1);
  saveMessages(msgs);
  renderMessages();
}

function editMessage(index) {
  const msgs = loadMessages();
  const newContent = prompt('编辑留言：', msgs[index].content);
  if (newContent !== null && newContent.trim()) {
    msgs[index].content = newContent.trim();
    saveMessages(msgs);
    renderMessages();
  }
}

document.getElementById('msg-submit').addEventListener('click', submitMessage);
document.getElementById('msg-content').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitMessage(); }
});

renderMessages();

// ========== Easter Egg Functions (Global Scope) ==========
function createFloatingEmoji(emoji) {
  const el = document.createElement('div');
  el.textContent = emoji;
  el.style.cssText = `
    position: fixed;
    font-size: 2rem;
    left: ${Math.random() * 100}vw;
    top: 100vh;
    z-index: 99999;
    pointer-events: none;
    animation: floatUp 3s ease-out forwards;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function showNotification(html) {
  const notif = document.createElement('div');
  notif.className = 'easter-egg-notification';
  notif.innerHTML = html;
  document.body.appendChild(notif);
  setTimeout(() => {
    notif.classList.add('show');
  }, 10);
  setTimeout(() => {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 300);
  }, 4000);
}

function triggerKonamiEffect() {
  // Rainbow background effect
  document.body.style.animation = 'rainbow 2s linear';
  setTimeout(() => {
    document.body.style.animation = '';
  }, 2000);

  // Show floating emojis
  const emojis = ['🎮', '🎮', '🎮', '🎮', '🎮', '🎮', '🎮', '🎮', '🎮', '🎮'];
  emojis.forEach((emoji, i) => {
    setTimeout(() => {
      createFloatingEmoji(emoji);
    }, i * 100);
  });

  // Show notification
  showNotification('🎮 隐藏成就解锁：Konami Code 大师！<br>你居然知道这个经典秘籍！');
}

function triggerMatrixEffect() {
  // Create matrix rain effect
  const matrix = document.createElement('div');
  matrix.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 99998;
    pointer-events: none;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.8);
  `;
  document.body.appendChild(matrix);

  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  const columns = Math.floor(window.innerWidth / 20);
  const drops = new Array(columns).fill(0);
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  matrix.appendChild(canvas);
  const context = canvas.getContext('2d');

  function drawMatrix() {
    context.fillStyle = 'rgba(0, 0, 0, 0.05)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      context.fillStyle = `hsl(${120 + Math.random() * 60}, 100%, 50%)`;
      context.font = '15px monospace';
      context.fillText(char, i * 20, drops[i] * 20);

      if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  const interval = setInterval(drawMatrix, 50);
  setTimeout(() => {
    clearInterval(interval);
    matrix.remove();
  }, 3000);

  showNotification('🟢 Matrix 效果已触发！<br>按 Ctrl+Shift+G 再次体验');
}

function triggerAvatarEffect() {
  // Make avatar spin
  const wrapper = document.querySelector('.hero-avatar-wrapper');
  if (wrapper) {
    wrapper.style.animation = 'spin 1s ease-in-out';
    setTimeout(() => {
      wrapper.style.animation = '';
    }, 1000);
  }

  // Show hidden message
  showNotification('🎯 隐藏彩蛋：你发现了头像的秘密！<br>连续点击 5 次触发，看来你很有探索精神～');
}

// ========== Download Business Card ==========
(function initDownloadCard() {
  const downloadBtn = document.getElementById('download-card');
  if (!downloadBtn) return;

  downloadBtn.addEventListener('click', () => {
    // Create canvas for business card
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 500;
    canvas.width = width;
    canvas.height = height;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0070f3');
    gradient.addColorStop(1, '#0051a8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add subtle pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 100 + 50, 0, Math.PI * 2);
      ctx.fill();
    }

    // Left side - Avatar area
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.arc(150, 250, 80, 0, Math.PI * 2);
    ctx.fill();

    // Avatar initial
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 72px "Noto Sans SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('郭', 150, 250);

    // Right side - Info
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fff';

    // Name
    ctx.font = 'bold 42px "Noto Sans SC", sans-serif';
    ctx.fillText('郭洪志', 300, 140);

    // Title
    ctx.font = '20px "Noto Sans SC", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText('沈阳航空航天大学 · 物联网工程', 300, 185);

    // Divider line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(300, 215);
    ctx.lineTo(700, 215);
    ctx.stroke();

    // Contact info
    ctx.font = '18px "Noto Sans SC", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';

    // Phone icon and text
    ctx.fillText('📱  13941002786', 300, 260);

    // Email icon and text
    ctx.fillText('📧  1922726541@qq.com', 300, 300);

    // Location icon and text
    ctx.fillText('📍  辽宁省铁岭市昌图县', 300, 340);

    // Skills tags
    ctx.font = '14px "JetBrains Mono", monospace';
    const skills = ['Python', 'C++', 'SQL', 'Linux', '软件测试'];
    let tagX = 300;
    skills.forEach(skill => {
      const metrics = ctx.measureText(skill);
      const tagWidth = metrics.width + 20;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.roundRect(tagX, 370, tagWidth, 28, 14);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.textBaseline = 'middle';
      ctx.fillText(skill, tagX + 10, 384);

      tagX += tagWidth + 10;
    });

    // Motto at bottom
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = 'italic 14px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('"Talk is cheap. Show me the code." — Linus Torvalds', width / 2, 440);

    // Bottom decorative line
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(0, height - 4, width, 4);

    // Download the canvas as image
    const link = document.createElement('a');
    link.download = '郭洪志-名片.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    // Show feedback
    downloadBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      已下载
    `;
    downloadBtn.classList.add('downloaded');
    setTimeout(() => {
      downloadBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        下载名片
      `;
      downloadBtn.classList.remove('downloaded');
    }, 2000);
  });
})();

// ========== Easter Eggs Init ==========
(function initEasterEggs() {
  // Konami Code: ↑↑↓↓←→←→BA
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', e => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        triggerKonamiEffect();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  // Avatar click easter egg
  const avatar = document.getElementById('avatar-canvas');
  let clickCount = 0;
  let clickTimer = null;

  if (avatar) {
    avatar.style.cursor = 'pointer';
    avatar.addEventListener('click', () => {
      clickCount++;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        if (clickCount >= 5) {
          triggerAvatarEffect();
        }
        clickCount = 0;
      }, 1000);
    });
  }

  // Keyboard shortcut: Ctrl+Shift+G
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'G') {
      e.preventDefault();
      triggerMatrixEffect();
    }
  });
})();

// ========== Dynamic Page Title ==========
(function initDynamicTitle() {
  const originalTitle = document.title;
  const hiddenTitles = [
    '👋 快回来看看～',
    '😮 你怎么走了？',
    '💻 代码还没看完呢',
    '🤖 数字分身想你了',
    '🎮 回来聊聊王者？',
  ];
  let hiddenTitle = hiddenTitles[Math.floor(Math.random() * hiddenTitles.length)];

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.title = hiddenTitle;
    } else {
      document.title = originalTitle;
    }
  });
})();

// ========== Console Easter Egg ==========
(function initConsoleEasterEgg() {
  const s = {
    green: 'color: #10b981; font-size: 13px; font-family: "JetBrains Mono", monospace;',
    blue: 'color: #58a6ff; font-size: 13px; font-family: "JetBrains Mono", monospace;',
    cyan: 'color: #06b6d4; font-size: 13px; font-family: "JetBrains Mono", monospace;',
    yellow: 'color: #f59e0b; font-size: 13px; font-family: "JetBrains Mono", monospace;',
    dim: 'color: #8b949e; font-size: 12px; font-family: "JetBrains Mono", monospace;',
  };

  console.log('%c>>> from ghz import portfolio', s.green);
  console.log('%c>>> ', s.dim + 'font-size: 13px;');
  console.log('%c>>> profile = {', s.green);
  console.log('%c...     "name":     "郭洪志",', s.cyan);
  console.log('%c...     "school":   "沈阳航空航天大学",', s.cyan);
  console.log('%c...     "major":    "物联网工程",', s.cyan);
  console.log('%c...     "status":   "拟录取计算机硕士",', s.cyan);
  console.log('%c...     "skills":   ["Python", "C++", "SQL", "Linux", "软件测试"],', s.cyan);
  console.log('%c...     "motto":    "Talk is cheap. Show me the code.",', s.cyan);
  console.log('%c... }', s.green);
  console.log('%c>>> ', s.dim + 'font-size: 13px;');
  console.log('%c>>> print(f"如果你能看到这里，说明你也是个开发者 👀")', s.green);
  console.log('%c如果你能看到这里，说明你也是个开发者 👀', s.blue);
  console.log('%c>>> ', s.dim + 'font-size: 13px;');
  console.log('%c>>> # 试试一些隐藏彩蛋 🥚', s.yellow);
  console.log('%c>>> portfolio.easter_eggs()', s.green);
  console.log('%c  • 输入 ↑↑↓↓←→←→BA', s.dim);
  console.log('%c  • 连续点击头像 5 次', s.dim);
  console.log('%c  • 按 Ctrl+Shift+G', s.dim);
  console.log('%c  • 右下角聊天框输入 /help', s.dim);
})();

// ========== Click Ripple Effect ==========
(function initClickRipple() {
  document.addEventListener('click', (e) => {
    // Don't ripple on interactive elements
    const tag = e.target.tagName.toLowerCase();
    if (tag === 'a' || tag === 'button' || tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (e.target.closest('a') || e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) return;

    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = (e.clientX - 10) + 'px';
    ripple.style.top = (e.clientY - 10) + 'px';
    document.body.appendChild(ripple);

    ripple.addEventListener('animationend', () => ripple.remove());
  });
})();
