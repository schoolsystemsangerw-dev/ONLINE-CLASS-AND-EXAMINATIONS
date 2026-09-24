// Supabase Initialization
const SUPABASE_URL = 'https://ggiwmwinrcxrkqcevqnz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SYYnHD1Ws3cz5lva25quxQ_ey7XgL4v';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Session State Helper
const Session = {
    getUser: () => JSON.parse(localStorage.getItem('portal_current_user') || 'null'),
    setUser: (user) => localStorage.setItem('portal_current_user', JSON.stringify(user)),
    clear: () => localStorage.removeItem('portal_current_user')
};

let currentUser = Session.getUser();
let jitsiApi = null; // Master instance for Live Video Classes

// Master Admin Access Control
const MASTER_ADMIN_EMAIL = 'schoolsystems.ange.rw@gmail.com';

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
        // Re-verify user record with Supabase DB
        const { data: dbUser } = await supabaseClient
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
        if (authStatus) {
            const displayRole = currentUser.email.toLowerCase() === MASTER_ADMIN_EMAIL ? 'SYSTEM OWNER' : currentUser.role.toUpperCase();
            authStatus.textContent = `${currentUser.name} (${displayRole})`;
        }
        if (logoutBtn) logoutBtn.classList.remove('hidden');

        // Check teacher approval status
        if (currentUser.role === 'teacher' && currentUser.account_status === 'pending') {
            alert('Your account is awaiting payment verification by the System Owner.');
            Session.clear();
            checkSession();
            return;
        }

        // Handle Master Owner Routing
        if (currentUser.email.toLowerCase() === MASTER_ADMIN_EMAIL) {
            showRoleDashboard('owner');
        } else {
            showRoleDashboard(currentUser.role);
        }
    } else {
        if (userBadge) userBadge.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
        showAuthSection();
    }
}

// Navigation Controls
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

// Event Listeners & Form Handlers
function setupEventListeners() {
    // Registration Handler
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
                role: email.toLowerCase() === MASTER_ADMIN_EMAIL ? 'owner' : role,
                name,
                email,
                phone,
                password,
                account_status: role === 'teacher' ? 'pending' : 'active',
                school: role === 'teacher' ? (document.getElementById('reg-school')?.value || '') : '',
                school_location: role === 'teacher' ? (document.getElementById('reg-school-location')?.value || '') : '',
                position: role === 'teacher' ? (document.getElementById('reg-position')?.value || '') : '',
                school_logo_url: role === 'teacher' ? (document.getElementById('reg-school-logo')?.value || '') : '',
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

    // Login Handler
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

    // Logout Handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            Session.clear();
            checkSession();
        });
    }

    // Class Generator
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

    // Student Join Class
    const joinClassForm = document.getElementById('join-class-form');
    if (joinClassForm) {
        joinClassForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const classCodeInput = document.getElementById('join-class-code') || document.getElementById('join-code');
            const classCode = classCodeInput ? classCodeInput.value.trim().toUpperCase() : '';

            if (!classCode) {
                alert('Please enter a valid class code.');
                return;
            }

            const { data: classData, error: classError } = await supabaseClient
                .from('classes')
                .select('*')
                .eq('class_code', classCode)
                .maybeSingle();

            if (classError || !classData) {
                alert('Invalid Class Code! Please check the code with your teacher.');
                return;
            }

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

// System Owner Dashboard
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
        <div class="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div class="flex items-start gap-3">
                ${p.school_logo_url ? `<img src="${p.school_logo_url}" class="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-950 p-1 flex-shrink-0">` : ''}
                <div class="space-y-1">
                    <h4 class="font-bold text-sm text-white">${p.name} <span class="text-xs font-normal text-indigo-400">(${p.position || 'Teacher'})</span></h4>
                    <p class="text-xs text-indigo-300 font-semibold">${p.school || 'Unspecified School'} ${p.school_location ? `• ${p.school_location}` : ''}</p>
                    <p class="text-xs text-slate-400">Phone: <span class="text-slate-200 font-mono">${p.phone || 'N/A'}</span> | Email: ${p.email}</p>
                    <p class="text-xs font-bold text-amber-400">MoMo Ref ID: ${p.payment_ref || 'N/A'}</p>
                </div>
            </div>
            <button onclick="window.approveUser('${p.email}')" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2.5 rounded-xl font-bold transition shadow-lg shadow-emerald-600/20 self-end md:self-center">
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

// Teacher Dashboard
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
        <div class="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 space-y-4">
            <div class="flex items-start justify-between gap-3">
                <div class="space-y-1">
                    <h4 class="font-bold text-white text-sm">${c.class_name}</h4>
                    <p class="text-xs text-slate-400">${c.subject}</p>
                </div>
                ${currentUser.school_logo_url ? `<img src="${currentUser.school_logo_url}" class="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-950 p-1 flex-shrink-0" alt="School Logo">` : ''}
            </div>

            <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                <p class="text-slate-300"><span class="text-slate-500">School:</span> ${currentUser.school || 'N/A'} ${currentUser.school_location ? `(${currentUser.school_location})` : ''}</p>
                <p class="text-slate-300"><span class="text-slate-500">Teacher:</span> ${currentUser.name} (${currentUser.position || 'Teacher'})</p>
                <p class="text-slate-300"><span class="text-slate-500">Phone:</span> <span class="font-mono text-indigo-300">${currentUser.phone || 'N/A'}</span></p>
            </div>

            <div class="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Class Code:</span>
                <span class="font-mono font-bold text-indigo-400 text-sm">${c.class_code}</span>
            </div>

            <button onclick="window.startLiveStream('${c.class_code}', '${c.class_name}')" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-md">
                <i data-lucide="video" class="w-4 h-4"></i> Start Live Class / Screen Share
            </button>
        </div>
    `).join('');
    
    if (window.lucide) lucide.createIcons();
}

// Student Dashboard
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

    if (classError || !classes || classes.length === 0) return;

    // Fetch teacher profile details for these classes
    const teacherEmails = [...new Set(classes.map(c => c.teacher_email))];
    const { data: teacherProfiles } = await supabaseClient
        .from('profiles')
        .select('*')
        .in('email', teacherEmails);

    const teacherMap = {};
    if (teacherProfiles) {
        teacherProfiles.forEach(t => {
            teacherMap[t.email] = t;
        });
    }

    container.innerHTML = classes.map(c => {
        const teacher = teacherMap[c.teacher_email] || {};
        return `
            <div class="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 space-y-4">
                <div class="flex items-start justify-between gap-3">
                    <div class="space-y-1">
                        <h4 class="font-bold text-white text-sm">${c.class_name}</h4>
                        <p class="text-xs text-slate-400">${c.subject}</p>
                    </div>
                    ${teacher.school_logo_url ? `<img src="${teacher.school_logo_url}" class="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-950 p-1 flex-shrink-0" alt="School Logo">` : ''}
                </div>

                <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                    <p class="text-slate-300"><span class="text-slate-500">School:</span> ${teacher.school || 'N/A'} ${teacher.school_location ? `(${teacher.school_location})` : ''}</p>
                    <p class="text-slate-300"><span class="text-slate-500">Teacher:</span> ${teacher.name || 'N/A'} ${teacher.position ? `(${teacher.position})` : ''}</p>
                    <p class="text-slate-300"><span class="text-slate-500">Phone:</span> <span class="font-mono text-indigo-300">${teacher.phone || 'N/A'}</span></p>
                    <p class="text-slate-300"><span class="text-slate-500">Email:</span> ${teacher.email || c.teacher_email}</p>
                </div>

                <div class="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Class Code:</span>
                    <span class="font-mono font-bold text-indigo-400 text-sm">${c.class_code}</span>
                </div>

                <button onclick="window.startLiveStream('${c.class_code}', '${c.class_name}')" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-md">
                    <i data-lucide="video" class="w-4 h-4"></i> Join Live Class
                </button>
            </div>
        `;
    }).join('');

    if (window.lucide) lucide.createIcons();
}

// Jitsi Video Classroom Engine
window.startLiveStream = function(classCode, className) {
    const modal = document.getElementById('live-stream-modal');
    const title = document.getElementById('live-stream-title');
    const container = document.getElementById('jitsi-container');

    if (!modal || !container) return;

    title.textContent = `Live Class: ${className} (${classCode})`;
    modal.classList.remove('hidden');
    container.innerHTML = '';

    const domain = 'meet.jit.si';
    const roomName = `SmartEdu_Class_${classCode.replace(/[^a-zA-Z0-9]/g, '')}`;

    const options = {
        roomName: roomName,
        width: '100%',
        height: '100%',
        parentNode: container,
        userInfo: {
            displayName: currentUser ? currentUser.name : 'Guest User'
        },
        configOverwrite: {
            startWithAudioMuted: true,
            disableDeepLinking: true
        },
        interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false
        }
    };

    jitsiApi = new JitsiMeetExternalAPI(domain, options);
};

// Close Live Stream Session
window.closeLiveStream = function() {
    const modal = document.getElementById('live-stream-modal');
    const container = document.getElementById('jitsi-container');

    if (jitsiApi) {
        jitsiApi.dispose();
        jitsiApi = null;
    }

    if (container) container.innerHTML = '';
    if (modal) modal.classList.add('hidden');
};
