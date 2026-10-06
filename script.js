const STORAGE_KEYS = {
  tasks: 'daily-task-items',
  moonCount: 'daily-task-moon-count',
  font: 'daily-task-font',
  textSize: 'daily-task-text-size'
};

const FONT_FAMILIES = {
  palette: '"FC Palette", sans-serif',
  candy: '"FC Candy", sans-serif',
  system: 'Tahoma, "Noto Sans Thai", "Segoe UI", sans-serif'
};

const TEXT_SIZE_SCALES = {
  small: 0.9,
  medium: 1,
  large: 1.1
};

const dailyMessages = [
  'สวัสดีวันนี้ ค่อย ๆ ทำทีละอย่างก็พอ',
  'ทุกก้าวเล็ก ๆ พาเราเข้าใกล้สิ่งที่ตั้งใจ',
  'วันนี้ไม่ต้องสมบูรณ์แบบ แค่เริ่มก็เก่งแล้ว',
  'พักได้ หายใจลึก ๆ แล้วค่อยไปต่อ',
  'ความสม่ำเสมอชนะความรีบร้อนเสมอ',
  'ขอให้วันนี้ใจดีกับตัวเองเป็นพิเศษ',
  'งานหนึ่งชิ้นที่เสร็จ คือความก้าวหน้าหนึ่งก้าว',
  'เริ่มจากสิ่งสำคัญที่สุด แล้วค่อยทำต่อไป',
  'ความตั้งใจของคุณมีความหมาย แม้ยังไม่มีใครเห็น',
  'วันนี้คือโอกาสใหม่ในการลองอีกครั้ง',
  'ไม่ต้องแข่งกับใคร แค่เดินในจังหวะของตัวเอง',
  'ความสำเร็จเริ่มจากการลงมือทำเล็ก ๆ',
  'เก่งมากที่ยังพยายาม แม้วันนี้จะไม่ง่าย',
  'จัดลำดับให้ดี แล้วปล่อยให้เวลาเป็นผู้ช่วย',
  'ทุกวันที่ตั้งใจ คือวันที่มีความหมาย',
  'ให้พื้นที่ตัวเองได้เรียนรู้ระหว่างทาง',
  'ทำเท่าที่ไหว แล้วภูมิใจกับสิ่งที่ทำได้',
  'เป้าหมายใหญ่ เริ่มจากงานเล็กตรงหน้า',
  'วันนี้ไม่จำเป็นต้องเร็ว แค่ไม่หยุดก็พอ',
  'ความก้าวหน้าอาจเงียบ แต่กำลังเกิดขึ้นเสมอ',
  'เริ่มต้นใหม่ได้ทุกครั้งที่คุณพร้อม',
  'อย่าลืมชื่นชมตัวเองที่ผ่านมาถึงวันนี้',
  'ความพยายามวันนี้ คือของขวัญให้ตัวเองในวันหน้า',
  'ค่อย ๆ ทำให้เสร็จ ดีกว่ากังวลว่าจะต้องทำทั้งหมด',
  'วันนี้คุณมีสิทธิ์เริ่มจากเรื่องง่ายที่สุด',
  'พักสักนิดไม่ใช่ถอยหลัง แต่คือการดูแลตัวเอง',
  'สิ่งที่ทำด้วยใจ ย่อมพาคุณไปข้างหน้า',
  'ขอให้วันนี้มีเรื่องเล็ก ๆ ที่ทำให้ยิ้มได้',
  'คุณไม่จำเป็นต้องพร้อมเต็มร้อยเพื่อเริ่มต้น',
  'ทำทีละข้อ แล้ววันธรรมดาจะกลายเป็นวันที่สำเร็จ',
  'ขอบคุณตัวเองที่ยังเลือกก้าวต่อไป'
];

const state = {
  filter: 'all',
  search: '',
  sort: 'newest',
  editingId: null,
  currentPage: 0
};

let firebaseAuth = null;
let currentUser = null;
let authMode = 'login';

const sampleTasks = [
  {
    id: 'sample-task-1',
    title: 'Bake cinnamon rolls',
    description: 'Prepare the dough, glaze the rolls, and set them in the oven before 10 AM.',
    category: 'baking',
    priority: 'high',
    dueDate: '2026-10-10',
    completed: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 5
  },
  {
    id: 'sample-task-2',
    title: 'Buy fresh ingredients',
    description: 'Get flour, butter, eggs, and vanilla extract from the market.',
    category: 'grocery',
    priority: 'medium',
    dueDate: '2026-10-11',
    completed: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 18
  },
  {
    id: 'sample-task-3',
    title: 'Morning walk',
    description: 'Take a 20-minute walk around the neighborhood and enjoy the breeze.',
    category: 'health',
    priority: 'medium',
    dueDate: '2026-10-12',
    completed: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 30
  }
];

const appState = {
  tasks: isAppsScriptRuntime() ? [] : loadTasks(),
  moonCount: isAppsScriptRuntime() ? 0 : loadMoonCount(),
  font: loadFontPreference(),
  textSize: loadTextSize()
};

const taskGrid = document.getElementById('taskGrid');
const taskCounter = document.getElementById('taskCounter');
const totalCounter = document.getElementById('totalCounter');
const remainingCounter = document.getElementById('remainingCounter');
const completedCounter = document.getElementById('completedCounter');
const moonCountDisplay = document.getElementById('moonCount');
const homeRemainingCounter = document.getElementById('homeRemainingCounter');
const homeCompletedCounter = document.getElementById('homeCompletedCounter');
const homeMoonCount = document.getElementById('homeMoonCount');
const homeTaskPreview = document.getElementById('homeTaskPreview');
const dailyMessage = document.getElementById('dailyMessage');
const homeSearchInput = document.getElementById('homeSearchInput');
const homeSortSelect = document.getElementById('homeSortSelect');
const celebrationBanner = document.getElementById('celebrationBanner');
const appRoot = document.querySelector('.app');
const authScreen = document.getElementById('authScreen');
const authForm = document.getElementById('authForm');
const authEmailField = document.getElementById('authEmail');
const authPasswordField = document.getElementById('authPassword');
const authHeading = document.getElementById('authHeading');
const authDescription = document.getElementById('authDescription');
const authError = document.getElementById('authError');
const authSubmitButton = document.getElementById('authSubmitBtn');
const authModeToggle = document.getElementById('authModeToggle');
const resetPasswordButton = document.getElementById('resetPasswordBtn');
const authSignOutButton = document.getElementById('authSignOutBtn');
const accountEmail = document.getElementById('accountEmail');
const logoutButton = document.getElementById('logoutBtn');
const homeLogoutButton = document.getElementById('homeLogoutBtn');
const homeView = document.getElementById('homeView');
const tasksView = document.getElementById('tasksView');
const summaryView = document.getElementById('summaryView');
const paginationControls = document.getElementById('paginationControls');
const previousPageButton = document.getElementById('previousPage');
const nextPageButton = document.getElementById('nextPage');
const pageIndicator = document.getElementById('pageIndicator');
const toast = document.getElementById('toast');
const taskModal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');
const modalTitle = document.getElementById('modalTitle');
const submitTaskBtn = document.getElementById('submitTaskBtn');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const homeAddTaskBtn = document.getElementById('homeAddTaskBtn');
const homeFontSelect = document.getElementById('homeFontSelect');
const appFontSelect = document.getElementById('appFontSelect');
const homeTextSizeSelect = document.getElementById('homeTextSizeSelect');
const appTextSizeSelect = document.getElementById('appTextSizeSelect');
const rainContainer = document.getElementById('rainContainer');

const titleField = document.getElementById('taskTitle');
const categoryField = document.getElementById('taskCategory');
const descriptionField = document.getElementById('taskDescription');
const priorityField = document.getElementById('taskPriority');
const dueDateField = document.getElementById('taskDueDate');

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.tasks);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(sampleTasks));
      return [...sampleTasks];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...sampleTasks];
  } catch (error) {
    console.error('Failed to load tasks:', error);
    return [...sampleTasks];
  }
}

function isAppsScriptRuntime() {
  return typeof google !== 'undefined' && Boolean(google.script && google.script.run);
}

function loadTasksFromSheet(user) {
  if (!isAppsScriptRuntime() || !user) return;

  user.getIdToken().then((idToken) => {
    google.script.run
      .withSuccessHandler((result) => {
        appState.tasks = Array.isArray(result.tasks) ? result.tasks : [];
        appState.moonCount = Number(result.moonCount) || 0;
        state.currentPage = 0;
        accountEmail.textContent = user.email || '';
        accountEmail.classList.remove('hidden');
        logoutButton.classList.remove('hidden');
        homeLogoutButton.classList.remove('hidden');
        authScreen.classList.add('hidden');
        appRoot.classList.remove('hidden');
        renderTasks();
      })
      .withFailureHandler((error) => {
        console.error('Failed to load tasks from Google Sheets:', error);
        authError.textContent = 'โหลดงานไม่สำเร็จ กรุณาตรวจการตั้งค่า Apps Script และลองอีกครั้ง';
        authSignOutButton.classList.remove('hidden');
        authSubmitButton.disabled = false;
        authSubmitButton.textContent = 'เข้าสู่ระบบ';
      })
      .getTasksForCurrentUser(idToken);
  }).catch((error) => {
    console.error('Failed to get Firebase ID token:', error);
    authError.textContent = 'ยืนยันบัญชีไม่สำเร็จ กรุณาเข้าสู่ระบบอีกครั้ง';
  });
}

function setDailyMessage(date = new Date()) {
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date - yearStart) / 86400000);
  dailyMessage.textContent = dailyMessages[dayOfYear % dailyMessages.length];
}

function saveTasks() {
  if (isAppsScriptRuntime()) {
    if (!currentUser) return;
    currentUser.getIdToken().then((idToken) => {
      google.script.run
        .withFailureHandler((error) => {
          console.error('Failed to save tasks to Google Sheets:', error);
          showNotification('บันทึกลง Google Sheets ไม่สำเร็จ');
        })
        .saveTasksForCurrentUser(idToken, appState.tasks, appState.moonCount);
    }).catch((error) => {
      console.error('Failed to get Firebase ID token:', error);
      showNotification('ยืนยันบัญชีไม่สำเร็จ กรุณาเข้าสู่ระบบอีกครั้ง');
    });
    return;
  }

  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(appState.tasks));
}

function loadMoonCount() {
  const saved = Number(localStorage.getItem(STORAGE_KEYS.moonCount) || 0);
  return Number.isFinite(saved) ? saved : 0;
}

function loadFontPreference() {
  const saved = localStorage.getItem(STORAGE_KEYS.font);
  return Object.prototype.hasOwnProperty.call(FONT_FAMILIES, saved) ? saved : 'palette';
}

function loadTextSize() {
  const saved = localStorage.getItem(STORAGE_KEYS.textSize);
  return Object.prototype.hasOwnProperty.call(TEXT_SIZE_SCALES, saved) ? saved : 'medium';
}

function applyFontPreference(font) {
  const selectedFont = Object.prototype.hasOwnProperty.call(FONT_FAMILIES, font) ? font : 'palette';
  appState.font = selectedFont;
  document.documentElement.style.setProperty('--app-font', FONT_FAMILIES[selectedFont]);
  homeFontSelect.value = selectedFont;
  appFontSelect.value = selectedFont;
  localStorage.setItem(STORAGE_KEYS.font, selectedFont);
}

function applyTextSize(size) {
  const selectedSize = Object.prototype.hasOwnProperty.call(TEXT_SIZE_SCALES, size) ? size : 'medium';
  appState.textSize = selectedSize;
  document.documentElement.style.setProperty('--app-font-scale', String(TEXT_SIZE_SCALES[selectedSize]));
  homeTextSizeSelect.value = selectedSize;
  appTextSizeSelect.value = selectedSize;
  localStorage.setItem(STORAGE_KEYS.textSize, selectedSize);
}

function saveMoonCount() {
  if (!isAppsScriptRuntime()) {
    localStorage.setItem(STORAGE_KEYS.moonCount, String(appState.moonCount));
  }
}

function setAuthMode(mode) {
  authMode = mode;
  const isRegister = mode === 'register';
  authHeading.textContent = isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ';
  authDescription.textContent = isRegister
    ? 'สร้างบัญชีเพื่อเก็บรายการงานส่วนตัวของคุณ'
    : 'เข้าสู่ระบบเพื่อดูรายการงานของคุณ';
  authSubmitButton.textContent = isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ';
  authModeToggle.textContent = isRegister
    ? 'มีบัญชีแล้ว? เข้าสู่ระบบ'
    : 'ยังไม่มีบัญชี? สมัครสมาชิก';
  resetPasswordButton.classList.toggle('hidden', isRegister);
  authPasswordField.autocomplete = isRegister ? 'new-password' : 'current-password';
  authError.textContent = '';
}

function getAuthErrorMessage(error) {
  const messages = {
    'auth/email-already-in-use': 'อีเมลนี้มีบัญชีแล้ว ลองเข้าสู่ระบบแทน',
    'auth/invalid-email': 'รูปแบบอีเมลไม่ถูกต้อง',
    'auth/weak-password': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
    'auth/invalid-credential': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    'auth/user-not-found': 'ไม่พบบัญชีนี้ กรุณาสมัครสมาชิกก่อน',
    'auth/too-many-requests': 'ลองหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่',
    'auth/network-request-failed': 'เชื่อมต่อไม่ได้ ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่'
  };
  return messages[error.code] || 'ดำเนินการไม่สำเร็จ กรุณาตรวจข้อมูลแล้วลองอีกครั้ง';
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  authError.textContent = '';

  if (!firebaseAuth) {
    authError.textContent = 'ยังไม่ได้ตั้งค่า Firebase Authentication';
    return;
  }

  const email = authEmailField.value.trim();
  const password = authPasswordField.value;
  authSubmitButton.disabled = true;
  authSubmitButton.textContent = authMode === 'register' ? 'กำลังสมัคร...' : 'กำลังเข้าสู่ระบบ...';

  try {
    if (authMode === 'register') {
      await firebaseAuth.createUserWithEmailAndPassword(email, password);
    } else {
      await firebaseAuth.signInWithEmailAndPassword(email, password);
    }
  } catch (error) {
    authError.textContent = getAuthErrorMessage(error);
    authSubmitButton.disabled = false;
    authSubmitButton.textContent = authMode === 'register' ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ';
  }
}

async function sendPasswordReset() {
  const email = authEmailField.value.trim();
  if (!email) {
    authError.textContent = 'กรอกอีเมลก่อน แล้วกดลืมรหัสผ่านอีกครั้ง';
    authEmailField.focus();
    return;
  }

  try {
    await firebaseAuth.sendPasswordResetEmail(email);
    authError.textContent = 'ส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่อีเมลแล้ว';
  } catch (error) {
    authError.textContent = getAuthErrorMessage(error);
  }
}

function initializeAuthentication() {
  if (!isAppsScriptRuntime()) {
    authScreen.classList.add('hidden');
    appRoot.classList.remove('hidden');
    return;
  }

  appRoot.classList.add('hidden');
  authScreen.classList.remove('hidden');
  const config = window.DAILY_TASK_FIREBASE_CONFIG;
  if (!window.firebase || !config || !config.apiKey || !config.projectId) {
    authError.textContent = 'ยังไม่ได้ตั้งค่า Firebase โปรดทำตามคู่มือการติดตั้ง';
    return;
  }

  if (!firebase.apps.length) firebase.initializeApp(config);
  firebaseAuth = firebase.auth();
  firebaseAuth.onAuthStateChanged((user) => {
    currentUser = user;
    if (!user) {
      appState.tasks = [];
      appState.moonCount = 0;
      accountEmail.textContent = '';
      accountEmail.classList.add('hidden');
      logoutButton.classList.add('hidden');
      homeLogoutButton.classList.add('hidden');
      authScreen.classList.remove('hidden');
      appRoot.classList.add('hidden');
      authSubmitButton.disabled = false;
      setAuthMode('login');
      renderTasks();
      return;
    }

    authDescription.textContent = 'กำลังโหลดรายการงานของคุณ...';
    authSubmitButton.disabled = true;
    loadTasksFromSheet(user);
  });
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(dateValue) {
  if (!dateValue) return 'ไม่มีวันกำหนด';

  const date = new Date(dateValue + 'T00:00:00');
  if (Number.isNaN(date.getTime())) return 'ไม่มีวันกำหนด';

  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

function getVisibleTasks() {
  let result = [...appState.tasks];

  if (state.filter === 'in-progress') {
    result = result.filter((task) => !task.completed);
  }

  if (state.filter === 'completed') {
    result = result.filter((task) => task.completed);
  }

  if (state.search.trim()) {
    const term = state.search.trim().toLowerCase();
    result = result.filter((task) => {
      return [task.title, task.description, task.category]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }

  switch (state.sort) {
    case 'oldest':
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case 'due-date':
      result.sort((a, b) => {
        const aDate = a.dueDate ? new Date(a.dueDate + 'T00:00:00').getTime() : Number.MAX_SAFE_INTEGER;
        const bDate = b.dueDate ? new Date(b.dueDate + 'T00:00:00').getTime() : Number.MAX_SAFE_INTEGER;
        return aDate - bDate;
      });
      break;
    case 'priority': {
      const order = { high: 0, medium: 1, low: 2 };
      result.sort((a, b) => (order[a.priority] ?? 99) - (order[b.priority] ?? 99));
      break;
    }
    case 'newest':
    default:
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
  }

  return result;
}

function updateCounters() {
  const remaining = appState.tasks.filter((task) => !task.completed).length;
  const completed = appState.tasks.filter((task) => task.completed).length;
  const total = appState.tasks.length;

  taskCounter.textContent = `${remaining} งานที่เหลือ`;
  totalCounter.textContent = String(total);
  remainingCounter.textContent = String(remaining);
  completedCounter.textContent = String(completed);
  moonCountDisplay.textContent = String(appState.moonCount);
  homeRemainingCounter.textContent = String(remaining);
  homeCompletedCounter.textContent = String(completed);
  homeMoonCount.textContent = String(appState.moonCount);

  if (total > 0 && remaining === 0) {
    celebrationBanner.textContent = 'เมื่อคุณทำงานเสร็จ จะมีฝนพระจันทร์พร่างพรายตกลงมาจนเต็มหน้าจอ 🌙';
    celebrationBanner.classList.remove('hidden');
    triggerMoonRain();
  } else {
    celebrationBanner.classList.add('hidden');
  }
}

function showNotification(message) {
  toast.textContent = message;
  toast.classList.add('visible');

  clearTimeout(showNotification.timeoutId);
  showNotification.timeoutId = setTimeout(() => {
    toast.classList.remove('visible');
  }, 1800);
}

function triggerMoonRain() {
  rainContainer.innerHTML = '';

  for (let i = 0; i < 18; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'moon-fall';
    piece.textContent = '🌙';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 180}px`);
    piece.style.animationDelay = `${(Math.random() * 0.7).toFixed(2)}s`;
    piece.style.fontSize = `${Math.random() * 1.2 + 1.1}rem`;
    rainContainer.appendChild(piece);
  }

  setTimeout(() => {
    rainContainer.innerHTML = '';
  }, 2500);
}

function renderHomePreview() {
  const previewLimit = window.innerWidth <= 700 ? 1 : 3;
  const recentTasks = getVisibleTasks().slice(0, previewLimit);

  if (!recentTasks.length) {
    homeView.classList.add('has-no-preview');
    homeTaskPreview.innerHTML = `
      <div class="home-preview-empty">
        <span aria-hidden="true">🌙</span>
        <p>ยังไม่มีงานในรายการ</p>
        <small>เข้าสู่แอปเพื่อเริ่มเพิ่มงาน</small>
      </div>
    `;
    return;
  }

  homeView.classList.remove('has-no-preview');
  homeTaskPreview.innerHTML = recentTasks
    .map((task) => `
      <article class="home-preview-card ${task.completed ? 'is-complete' : ''}">
        <div class="home-preview-meta">
          <span>${formatDate(task.dueDate)}</span>
        </div>
        <h3>${escapeHtml(task.title)}</h3>
      </article>
    `)
    .join('');
}

function getPriorityLabel(priority) {
  const labels = {
    low: 'ต่ำ',
    medium: 'กลาง',
    high: 'สูง'
  };

  return labels[priority] || 'กลาง';
}

function getPageSize() {
  const columns = window.innerWidth <= 700 ? 1 : window.innerWidth <= 980 ? 2 : 3;
  const rows = window.innerHeight <= 680 ? 1 : 2;
  return columns * rows;
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();
  renderHomePreview();
  const pageSize = getPageSize();
  const pageCount = Math.max(1, Math.ceil(visibleTasks.length / pageSize));
  state.currentPage = Math.min(state.currentPage, pageCount - 1);
  const pageStart = state.currentPage * pageSize;
  const pageTasks = visibleTasks.slice(pageStart, pageStart + pageSize);

  pageIndicator.textContent = `หน้า ${state.currentPage + 1} / ${pageCount}`;
  previousPageButton.disabled = state.currentPage === 0;
  nextPageButton.disabled = state.currentPage >= pageCount - 1;
  paginationControls.classList.toggle('hidden', pageCount <= 1);

  if (!pageTasks.length) {
    taskGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon" aria-hidden="true">🌙</div>
        <h3>ไม่มีงานในตอนนี้</h3>
        <p>พักเบรกก่อนนะ ☕</p>
      </div>
    `;
    updateCounters();
    return;
  }

  taskGrid.innerHTML = pageTasks
    .map((task) => {
      return `
        <article class="task-card ${task.completed ? 'is-complete' : ''}" data-id="${task.id}">
          <div class="task-top">
            <label class="checkbox-wrap" aria-label="Mark task as complete">
              <input
                class="task-check"
                type="checkbox"
                ${task.completed ? 'checked' : ''}
                data-toggle-id="${task.id}"
                aria-label="Mark ${(task.title || 'task').replace(/"/g, '&quot;')} as complete"
              />
            </label>

            <div class="card-actions">
              <button
                class="card-edit"
                type="button"
                data-edit-id="${task.id}"
                aria-label="Edit task ${escapeHtml(task.title)}"
              >✎</button>
              <button
                class="card-delete"
                type="button"
                data-delete-id="${task.id}"
                aria-label="Delete task ${escapeHtml(task.title)}"
              >🗑</button>
            </div>
          </div>

          <div class="task-status-date">
            <span class="task-status ${task.completed ? 'is-complete' : ''}">
              ${task.completed ? 'เสร็จแล้ว' : 'กำลังทำ'}
            </span>
            <span class="due-date">${formatDate(task.dueDate)}</span>
          </div>

          <div class="task-body">
            <h3 class="task-title">${escapeHtml(task.title)}</h3>
            <p class="task-description">${escapeHtml(task.description || 'ไม่มีรายละเอียด')}</p>
            <div class="meta-row">
              <span class="task-tag">${escapeHtml(task.category || 'ทั่วไป')}</span>
              <span class="task-priority ${task.priority || 'medium'}">${getPriorityLabel(task.priority || 'medium')}</span>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  document.querySelectorAll('.task-check').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => toggleTask(event.target.dataset.toggleId));
  });

  document.querySelectorAll('[data-edit-id]').forEach((button) => {
    button.addEventListener('click', () => openModal(button.dataset.editId));
  });

  document.querySelectorAll('[data-delete-id]').forEach((button) => {
    button.addEventListener('click', () => deleteTask(button.dataset.deleteId));
  });

  updateCounters();
}

function createTask(taskData) {
  const newTask = {
    id: taskData.id || `task-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: taskData.title,
    description: taskData.description,
    category: taskData.category,
    priority: taskData.priority,
    dueDate: taskData.dueDate,
    completed: false,
    createdAt: taskData.createdAt || Date.now()
  };

  appState.tasks.unshift(newTask);
  saveTasks();
}

function updateTask(taskId, taskData) {
  appState.tasks = appState.tasks.map((task) => {
    if (task.id === taskId) {
      return {
        ...task,
        title: taskData.title,
        description: taskData.description,
        category: taskData.category,
        priority: taskData.priority,
        dueDate: taskData.dueDate
      };
    }
    return task;
  });

  saveTasks();
}

function toggleTask(taskId) {
  const task = appState.tasks.find((item) => item.id === taskId);
  if (!task) return;

  const wasCompleted = task.completed;
  task.completed = !task.completed;

  if (!wasCompleted && task.completed) {
    appState.moonCount += 1;
    saveMoonCount();
    showNotification('งานเสร็จแล้ว! คุณได้รับพระจันทร์ 🌙');
  }

  saveTasks();
  renderTasks();
}

function deleteTask(taskId) {
  const task = appState.tasks.find((item) => item.id === taskId);
  if (!task) return;

  const confirmed = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?');
  if (!confirmed) return;

  appState.tasks = appState.tasks.filter((item) => item.id !== taskId);
  saveTasks();
  renderTasks();
}

function openModal(taskId = null) {
  state.editingId = taskId;

  if (taskId) {
    const task = appState.tasks.find((item) => item.id === taskId);
    if (!task) return;

    modalTitle.textContent = 'แก้ไขงาน';
    submitTaskBtn.textContent = 'บันทึกการเปลี่ยนแปลง';
    titleField.value = task.title;
    descriptionField.value = task.description || '';
    categoryField.value = task.category || '';
    priorityField.value = task.priority || 'medium';
    dueDateField.value = task.dueDate || '';
  } else {
    modalTitle.textContent = 'เพิ่มงานใหม่';
    submitTaskBtn.textContent = 'เพิ่มงาน';
    taskForm.reset();
    priorityField.value = 'medium';
  }

  taskModal.classList.remove('hidden');
  taskModal.setAttribute('aria-hidden', 'false');
  titleField.focus();
}

function closeModal() {
  taskModal.classList.add('hidden');
  taskModal.setAttribute('aria-hidden', 'true');
  taskForm.reset();
  state.editingId = null;
}

function handleFormSubmit(event) {
  event.preventDefault();

  const title = titleField.value.trim();
  const description = descriptionField.value.trim();
  const category = categoryField.value.trim();
  const priority = priorityField.value;
  const dueDate = dueDateField.value;

  if (!title) {
    titleField.focus();
    showNotification('กรุณาระบุชื่องาน');
    return;
  }

  const payload = {
    title,
    description,
    category: category || 'general',
    priority,
    dueDate
  };

  if (state.editingId) {
    updateTask(state.editingId, payload);
    showNotification('อัปเดตงานเรียบร้อยแล้ว');
  } else {
    createTask(payload);
    state.currentPage = 0;
    showNotification('เพิ่มงานเรียบร้อยแล้ว');
  }

  closeModal();
  renderTasks();
}

function bindSimpleEvents() {
  document.querySelectorAll('.filter-tab').forEach((button) => {
    button.addEventListener('click', () => {
      state.filter = button.dataset.filter;
      state.currentPage = 0;
      document.querySelectorAll('.filter-tab').forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.filter === state.filter);
      });
      renderTasks();
    });
  });

  [searchInput, homeSearchInput].forEach((input) => {
    input.addEventListener('input', (event) => {
      state.search = event.target.value;
      searchInput.value = state.search;
      homeSearchInput.value = state.search;
      state.currentPage = 0;
      renderTasks();
    });
  });

  [sortSelect, homeSortSelect].forEach((select) => {
    select.addEventListener('change', (event) => {
      state.sort = event.target.value;
      sortSelect.value = state.sort;
      homeSortSelect.value = state.sort;
      state.currentPage = 0;
      renderTasks();
    });
  });

  [homeFontSelect, appFontSelect].forEach((select) => {
    select.addEventListener('change', () => applyFontPreference(select.value));
  });

  [homeTextSizeSelect, appTextSizeSelect].forEach((select) => {
    select.addEventListener('change', () => applyTextSize(select.value));
  });

  previousPageButton.addEventListener('click', () => {
    state.currentPage = Math.max(0, state.currentPage - 1);
    renderTasks();
  });

  nextPageButton.addEventListener('click', () => {
    state.currentPage += 1;
    renderTasks();
  });

  document.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => switchView(button.dataset.view));
  });

  addTaskBtn.addEventListener('click', () => openModal());
  homeAddTaskBtn.addEventListener('click', () => openModal());

  taskForm.addEventListener('submit', handleFormSubmit);

  document.querySelectorAll('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  authForm.addEventListener('submit', handleAuthSubmit);
  authModeToggle.addEventListener('click', () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  });
  resetPasswordButton.addEventListener('click', sendPasswordReset);

  [logoutButton, homeLogoutButton, authSignOutButton].forEach((button) => {
    button.addEventListener('click', () => {
      if (firebaseAuth) firebaseAuth.signOut();
    });
  });
}

function syncFilterControls() {
  document.querySelectorAll('.filter-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.filter === state.filter);
  });
}

function syncToolbarControls() {
  searchInput.value = state.search;
  homeSearchInput.value = state.search;
  sortSelect.value = state.sort;
  homeSortSelect.value = state.sort;
}

function resetFilters() {
  state.filter = 'all';
  state.search = '';
  state.sort = 'newest';
  state.currentPage = 0;
  syncFilterControls();
  syncToolbarControls();
}

function switchView(view) {
  const views = {
    home: homeView,
    tasks: tasksView,
    summary: summaryView
  };

  Object.entries(views).forEach(([name, element]) => {
    const isActive = name === view;
    element.classList.toggle('is-active', isActive);
    element.setAttribute('aria-hidden', String(!isActive));
  });

  appRoot.classList.toggle('home-active', view === 'home');

  document.querySelectorAll('.view-tab').forEach((button) => {
    const isActive = button.dataset.view === view;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

bindSimpleEvents();
applyFontPreference(appState.font);
applyTextSize(appState.textSize);
switchView('home');
setDailyMessage();
renderTasks();
initializeAuthentication();
window.addEventListener('resize', renderTasks);
