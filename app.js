// Storage Manager using browser LocalStorage
const DB = {
    getProfiles: () => JSON.parse(localStorage.getItem('portal_profiles') || '[]'),
    setProfiles: (data) => localStorage.setItem('portal_profiles', JSON.stringify(data)),
    
    getClasses: () => JSON.parse(localStorage.getItem('portal_classes') || '[]'),
    setClasses: (data) => localStorage.setItem('portal_classes', JSON.stringify(data)),
    
    getExams: () => JSON.parse(localStorage.getItem('portal_exams') || '[]'),
    setExams: (data) => localStorage.setItem('portal_exams', JSON.stringify(data)),
    
    getCurrentUser: () => JSON.parse(localStorage.getItem('portal_current_user') || 'null'),
    setCurrentUser: (user) => localStorage.setItem('portal_current_user', JSON.stringify(user))
};

// Global App State
let currentUser = DB.getCurrentUser();

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
    
    setupAuthTabs();
    setupEventListeners();
    checkSession();
});

// Session Checker
function checkSession() {
    currentUser = DB.getCurrentUser();
    const userBadge = document.getElementById('user-badge');
    const authStatus = document.getElementById('auth-status');
    const logoutBtn = document.getElementById('logout-btn');

    if (currentUser) {
        if (userBadge) {
            userBadge.classList.remove('hidden');
            userBadge.classList.add('flex');
        }
        if (authStatus) authStatus.textContent = `${currentUser.name} (${currentUser.role.toUpperCase()})`;
        if (logoutBtn) logoutBtn.classList.remove('hidden');

        // Check teacher approval status
        if (currentUser.role === 'teacher' && currentUser.account_status === 'pending') {
            alert('Your account is awaiting payment verification by the System Owner.');
            DB.setCurrentUser(null);
            checkSession();
            return;
        }

        showRoleDashboard(currentUser.role);
    } else {
        if (userBadge) userBadge.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
        showAuthSection();
    }
}

// Show/Hide Sections
function hideAllSections() {
    ['auth-section', 'owner-dashboard', 'teacher-dashboard', 'student-dashboard'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
}

function showAuthSection() {
    hideAllSections();
    const authSec = document.getElementById('auth-section');
    if (authSec) authSec.classList.remove('hidden');
}

function showRoleDashboard(role) {
    hideAllSections();
    if (role === 'owner') {
        const ownerDb = document.getElementById('owner-dashboard');
        if (ownerDb) ownerDb.classList.remove('hidden');
        renderOwnerDashboard();
    } else if (role === 'teacher') {
        const teacherDb = document.getElementById('teacher-dashboard');
        if (teacherDb) teacherDb.classList.remove('hidden');
        renderTeacherDashboard();
    } else if (role === 'student') {
        const studentDb = document.getElementById('student-dashboard');
        if (studentDb) studentDb.classList.remove('hidden');
    }
}

// Auth Tab Switching
function setupAuthTabs() {
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const roleSelect = document.getElementById('reg-role');
    const teacherFields = document.getElementById('teacher-fields');

    if (tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => {
            tabLogin.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition bg-indigo-600 text-white shadow-md';
            tabRegister.className = 'flex-1 py-2 text-xs font-bold text-slate-400 hover:text-white transition';
            if (loginForm) loginForm.classList.remove('hidden');
            if (registerForm) registerForm.classList.add('hidden');
        });

        tabRegister.addEventListener('click', () => {
            tabRegister.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition bg-indigo-600 text-white shadow-md';
            tabLogin.className = 'flex-1 py-2 text-xs font-bold text-slate-400 hover:text-white transition';
            if (registerForm) registerForm.classList.remove('hidden');
            if (loginForm) loginForm.classList.add('hidden');
        });
    }

    if (roleSelect && teacherFields) {
        roleSelect.addEventListener('change', (e) => {
            if (e.target.value === 'teacher') {
                teacherFields.classList.remove('hidden');
            } else {
                teacherFields.classList.add('hidden');
            }
        });
    }
}

// Form Event Listeners
function setupEventListeners() {
    // Register Form Submit
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const role = document.getElementById('reg-role').value;
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const phone = document.getElementById('reg-phone').value;
            const password = document.getElementById('reg-password').value;
            
            const profiles = DB.getProfiles();

            if (profiles.some(p => p.email === email)) {
                alert('An account with this email already exists.');
                return;
            }

            const newUser = {
                id: Date.now().toString(),
                role,
                name,
                email,
                phone,
                password,
                account_status: role === 'teacher' ? 'pending' : 'active',
                school: role === 'teacher' ? (document.getElementById('reg-school')?.value || '') : '',
                payment_ref: role === 'teacher' ? (document.getElementById('reg-payment-ref')?.value || '') : ''
            };

            profiles.push(newUser);
            DB.setProfiles(profiles);

            if (role === 'teacher') {
                alert('Teacher account registered! Pending payment approval by System Owner.');
            } else {
                alert('Account created successfully! You can now log in.');
            }

            document.getElementById('tab-login')?.click();
        });
    }

    // Login Form Submit
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const profiles = DB.getProfiles();
            const user = profiles.find(p => p.email === email && p.password === password);

            if (!user) {
                alert('Invalid email or password.');
                return;
            }

            DB.setCurrentUser(user);
            checkSession();
        });
    }

    // Logout Button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            DB.setCurrentUser(null);
            checkSession();
        });
    }

    // Create Class Form
    const createClassForm = document.getElementById('create-class-form');
    if (createClassForm) {
        createClassForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('class-name').value;
            const subject = document.getElementById('class-subject').value;
            const code = subject.substring(0, 3).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);

            const classes = DB.getClasses();
            classes.push({
                id: Date.now().toString(),
                teacher_email: currentUser.email,
                class_name: name,
                subject: subject,
                class_code: code
            });

            DB.setClasses(classes);
            e.target.reset();
            renderTeacherDashboard();
        });
    }
}

// Render Owner Dashboard
function renderOwnerDashboard() {
    const profiles = DB.getProfiles().filter(p => p.account_status === 'pending');
    const container = document.getElementById('owner-pending-list');
    if (!container) return;

    if (profiles.length === 0) {
        container.innerHTML = `<p class="text-xs text-slate-500 italic py-4 text-center">No pending teacher payment approvals.</p>`;
        return;
    }

    container.innerHTML = profiles.map(p => `
        <div class="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80 flex justify-between items-center">
            <div>
                <h4 class="font-bold text-sm text-white">${p.name} (${p.school || 'Teacher'})</h4>
                <p class="text-xs text-slate-400">Phone: ${p.phone} | Email: ${p.email}</p>
                <p class="text-xs font-bold text-amber-400 mt-1">MoMo Ref ID: ${p.payment_ref}</p>
            </div>
            <button onclick="window.approveUser('${p.email}')" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-2 rounded-xl font-bold transition">
                Approve Payment
            </button>
        </div>
    `).join('');
}

// Global scope window assignment for inline button handlers
window.approveUser = function(email) {
    const profiles = DB.getProfiles();
    const user = profiles.find(p => p.email === email);
    if (user) {
        user.account_status = 'active';
        DB.setProfiles(profiles);
        renderOwnerDashboard();
        alert(`Account for ${user.name} has been approved!`);
    }
};

// Render Teacher Dashboard
function renderTeacherDashboard() {
    const classes = DB.getClasses().filter(c => c.teacher_email === currentUser?.email);
    const container = document.getElementById('teacher-classes-cards');
    if (!container) return;

    if (classes.length === 0) {
        container.innerHTML = `<p class="text-xs text-slate-500 italic py-4 text-center col-span-2">No classes created yet. Fill out the form on the left to create your first class.</p>`;
        return;
    }

    container.innerHTML = classes.map(c => `
        <div class="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80">
            <h4 class="font-bold text-white text-sm">${c.class_name}</h4>
            <p class="text-xs text-slate-400 mb-3">${c.subject}</p>
            <div class="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Class Code:</span>
                <span class="font-mono font-bold text-indigo-400 text-sm">${c.class_code}</span>
            </div>
        </div>
    `).join('');
}
