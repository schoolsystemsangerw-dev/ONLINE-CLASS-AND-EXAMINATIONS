// Updated Supabase Initialization:
const SUPABASE_URL = 'https://ggiwmwinrcxrkqcevqnz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SYYnHD1Ws3cz5lva25quxQ_ey7XgL4v';

// Rename the variable to 'supabaseClient' to avoid conflicting with the library
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Session State Helper
const Session = {
    getUser: () => JSON.parse(localStorage.getItem('portal_current_user') || 'null'),
    setUser: (user) => localStorage.setItem('portal_current_user', JSON.stringify(user)),
    clear: () => localStorage.removeItem('portal_current_user')
};

let currentUser = Session.getUser();

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
    
    setupAuthTabs();
    setupEventListeners();
    checkSession();
});

// Session Checker
async function checkSession() {
    currentUser = Session.getUser();
    const userBadge = document.getElementById('user-badge');
    const authStatus = document.getElementById('auth-status');
    const logoutBtn = document.getElementById('logout-btn');

    if (currentUser) {
        // Re-verify status with Supabase DB
        const { data: dbUser, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('email', currentUser.email)
            .maybeSingle();

        if (dbUser) {
            currentUser = dbUser;
            Session.setUser(dbUser);
        }

        if (userBadge) {
            userBadge.classList.remove('hidden');
            userBadge.classList.add('flex');
        }
        if (authStatus) authStatus.textContent = `${currentUser.name} (${currentUser.role.toUpperCase()})`;
        if (logoutBtn) logoutBtn.classList.remove('hidden');

        // Check teacher approval status
        if (currentUser.role === 'teacher' && currentUser.account_status === 'pending') {
            alert('Your account is awaiting payment verification by the System Owner.');
            Session.clear();
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

// Section Navigation Controls
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
        renderStudentDashboard();
    }
}

// Auth UI Navigation
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

// Form Action Handlers
function setupEventListeners() {
    // Account Registration (Supabase Insert)
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const role = document.getElementById('reg-role').value;
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const phone = document.getElementById('reg-phone').value;
            const password = document.getElementById('reg-password').value;

            // Check if profile exists
            const { data: existingUser } = await supabaseClient
                .from('profiles')
                .select('email')
                .eq('email', email)
                .maybeSingle();

            if (existingUser) {
                alert('An account with this email already exists.');
                return;
            }

            const newUser = {
                role,
                name,
                email,
                phone,
                password,
                account_status: role === 'teacher' ? 'pending' : 'active',
                school: role === 'teacher' ? (document.getElementById('reg-school')?.value || '') : '',
                payment_ref: role === 'teacher' ? (document.getElementById('reg-payment-ref')?.value || '') : ''
            };

            const { error } = await supabaseClient.from('profiles').insert([newUser]);

            if (error) {
                alert('Registration failed: ' + error.message);
                return;
            }

            if (role === 'teacher') {
                alert('Teacher account registered! Pending payment approval by System Owner.');
            } else {
                alert('Account created successfully! You can now log in.');
            }

            document.getElementById('tab-login')?.click();
        });
    }

    // Account Sign In (Supabase Query)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const { data: user, error } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('email', email)
                .eq('password', password)
                .maybeSingle();

            if (error || !user) {
                alert('Invalid email or password.');
                return;
            }

            Session.setUser(user);
            checkSession();
        });
    }

    // Logout Action
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            Session.clear();
            checkSession();
        });
    }

    // Class Generator (Supabase Insert)
    const createClassForm = document.getElementById('create-class-form');
    if (createClassForm) {
        createClassForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('class-name').value;
            const subject = document.getElementById('class-subject').value;
            const code = subject.substring(0, 3).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);

            const newClass = {
                teacher_email: currentUser.email,
                class_name: name,
                subject: subject,
                class_code: code
            };

            const { error } = await supabaseClient.from('classes').insert([newClass]);

            if (error) {
                alert('Error creating class: ' + error.message);
                return;
            }

            e.target.reset();
            renderTeacherDashboard();
        });
    }

    // Join Classroom Handler (Student Action)
    const joinClassForm = document.getElementById('join-class-form');
    if (joinClassForm) {
        joinClassForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevents page reload/jumping
            
            // Checks for both join-class-code and join-code to match HTML
            const classCodeInput = document.getElementById('join-class-code') || document.getElementById('join-code');
            const classCode = classCodeInput ? classCodeInput.value.trim().toUpperCase() : '';

            if (!classCode) {
                alert('Please enter a valid class code.');
                return;
            }

            // 1. Verify class exists in Supabase
            const { data: classData, error: classError } = await supabaseClient
                .from('classes')
                .select('*')
                .eq('class_code', classCode)
                .maybeSingle();

            if (classError || !classData) {
                alert('Invalid Class Code! Please check the code with your teacher.');
                return;
            }

            // 2. Enroll student into class
            const { error: enrollError } = await supabaseClient
                .from('enrollments')
                .insert([{
                    student_email: currentUser.email,
                    class_code: classCode
                }]);

            if (enrollError) {
                if (enrollError.code === '23505') {
                    alert('You have already joined this class!');
                } else {
                    alert('Failed to join class: ' + enrollError.message);
                }
                return;
            }

            alert(`Successfully joined ${classData.class_name}!`);
            if (classCodeInput) classCodeInput.value = '';
            renderStudentDashboard();
        });
    }
}

// Render System Owner Dashboard
async function renderOwnerDashboard() {
    const container = document.getElementById('owner-pending-list');
    if (!container) return;

    const { data: pendingTeachers, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('account_status', 'pending');

    if (error || !pendingTeachers || pendingTeachers.length === 0) {
        container.innerHTML = `<p class="text-xs text-slate-500 italic py-4 text-center">No pending teacher payment approvals.</p>`;
        return;
    }

    container.innerHTML = pendingTeachers.map(p => `
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

// Approve Teacher Account Payment
window.approveUser = async function(email) {
    const { error } = await supabaseClient
        .from('profiles')
        .update({ account_status: 'active' })
        .eq('email', email);

    if (error) {
        alert('Approval failed: ' + error.message);
        return;
    }

    renderOwnerDashboard();
    alert(`Account approved successfully!`);
};

// Render Teacher Classes
async function renderTeacherDashboard() {
    const container = document.getElementById('teacher-classes-cards');
    if (!container) return;

    const { data: classes, error } = await supabaseClient
        .from('classes')
        .select('*')
        .eq('teacher_email', currentUser?.email);

    if (error || !classes || classes.length === 0) {
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

// Render Student Enrolled Classes
async function renderStudentDashboard() {
    const container = document.getElementById('student-classes-cards');
    if (!container) return;

    const { data: enrollments, error: enrollError } = await supabaseClient
        .from('enrollments')
        .select('class_code')
        .eq('student_email', currentUser?.email);

    if (enrollError || !enrollments || enrollments.length === 0) {
        container.innerHTML = `<p class="text-xs text-slate-500 italic py-4 text-center col-span-2">You haven't joined any classes yet. Enter a code above to get started.</p>`;
        return;
    }

    const classCodes = enrollments.map(e => e.class_code);

    const { data: classes, error: classError } = await supabaseClient
        .from('classes')
        .select('*')
        .in('class_code', classCodes);

    if (classError || !classes) return;

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
