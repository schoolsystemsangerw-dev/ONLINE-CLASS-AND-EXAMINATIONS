<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartEdu Portal - Learning & Interactive Exam Platform</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Lucide Icons CDN -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <!-- Custom styling & fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass-panel {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(51, 65, 85, 0.6);
        }
    </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex flex-col">

    <!-- Navigation Header -->
    <header class="border-b border-slate-800 bg-slate-950/80 sticky top-0 z-40 backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/20">
                    S
                </div>
                <div>
                    <h1 class="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">SmartEdu Platform</h1>
                    <p class="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase" id="school-branding-sub">Portal & Interactive Exams</p>
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div id="user-badge" class="hidden items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
                    <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span id="auth-status" class="text-xs font-semibold text-slate-300">Not Signed In</span>
                </div>
                <button id="logout-btn" class="hidden bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs px-3 py-1.5 rounded-xl font-bold transition">
                    Logout
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content Body -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">

        <!-- AUTH & REGISTRATION SECTION -->
        <section id="auth-section" class="max-w-md mx-auto my-8">
            <div class="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
                
                <!-- Auth Tabs -->
                <div class="flex bg-slate-900/80 p-1 rounded-2xl mb-6 border border-slate-800">
                    <button id="tab-login" class="flex-1 py-2 text-xs font-bold rounded-xl transition bg-indigo-600 text-white shadow-md">Sign In</button>
                    <button id="tab-register" class="flex-1 py-2 text-xs font-bold text-slate-400 hover:text-white transition">Register Account</button>
                </div>

                <!-- Login Form -->
                <form id="login-form" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-1">Email Address</label>
                        <input type="email" id="login-email" required class="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition text-white" placeholder="yourname@school.com">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-1">Password</label>
                        <input type="password" id="login-password" required class="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition text-white" placeholder="••••••••">
                    </div>
                    <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-indigo-600/30 text-sm">
                        Access Portal
                    </button>
                </form>

                <!-- Registration Form -->
                <form id="register-form" class="space-y-4 hidden">
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-1">Account Role</label>
                        <select id="reg-role" class="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition text-white">
                            <option value="student">Student</option>
                            <option value="teacher">Teacher / School Admin</option>
                            <option value="owner">System Owner (Super Admin)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-1">Full Name</label>
                        <input type="text" id="reg-name" required class="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none text-white" placeholder="Marie Claire">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-1">Email</label>
                        <input type="email" id="reg-email" required class="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none text-white" placeholder="email@domain.com">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-1">Phone Number</label>
                        <input type="tel" id="reg-phone" required class="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none text-white" placeholder="+250 780 000 000">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-1">Password</label>
                        <input type="password" id="reg-password" required class="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none text-white" placeholder="••••••••">
                    </div>

                    <!-- Extra Fields for Teachers -->
                    <div id="teacher-fields" class="space-y-4 hidden pt-2 border-t border-slate-700/60">
                        <div>
                            <label class="block text-xs font-bold text-indigo-400 mb-1">School Name</label>
                            <input type="text" id="reg-school" class="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none text-white" placeholder="Hope Academy">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-indigo-400 mb-1">Mobile Money Payment Ref ID</label>
                            <input type="text" id="reg-payment-ref" class="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none text-white" placeholder="Transaction Code (e.g. 1049283721)">
                            <p class="text-[11px] text-slate-400 mt-1">Teachers require System Owner payment approval before access is enabled.</p>
                        </div>
                    </div>

                    <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-600/30 text-sm">
                        Create Account
                    </button>
                </form>

            </div>
        </section>

        <!-- OWNER (SUPER ADMIN) DASHBOARD -->
        <section id="owner-dashboard" class="hidden space-y-6">
            <div class="bg-slate-800/60 border border-slate-700 rounded-3xl p-6">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h2 class="text-xl font-bold text-white flex items-center gap-2">
                            <i data-lucide="shield-check" class="text-indigo-400"></i> Owner Control Panel
                        </h2>
                        <p class="text-xs text-slate-400">Manage platform registrations and payment approvals</p>
                    </div>
                </div>

                <h3 class="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">Pending Payment Approvals</h3>
                <div id="owner-pending-list" class="space-y-3">
                    <!-- Dynamic insertion from JS -->
                </div>
            </div>
        </section>

        <!-- TEACHER DASHBOARD -->
        <section id="teacher-dashboard" class="hidden space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <!-- Quick Class Generator -->
                <div class="bg-slate-800/60 border border-slate-700 rounded-3xl p-6">
                    <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <i data-lucide="plus-circle" class="text-indigo-400"></i> Create Class
                    </h3>
                    <form id="create-class-form" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-400 mb-1">Class Name</label>
                            <input type="text" id="class-name" required class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white" placeholder="Primary 5 English">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-400 mb-1">Subject</label>
                            <input type="text" id="class-subject" required class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white" placeholder="English Grammar & Writing">
                        </div>
                        <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-sm transition">
                            Generate Class Code
                        </button>
                    </form>
                </div>

                <!-- Teacher Classes & Exams List -->
                <div class="md:col-span-2 bg-slate-800/60 border border-slate-700 rounded-3xl p-6">
                    <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <i data-lucide="book-open" class="text-emerald-400"></i> My Active Classes & Exams
                    </h3>
                    <div id="teacher-classes-cards" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <!-- Dynamic insertion from JS -->
                    </div>
                </div>

            </div>
        </section>

        <!-- STUDENT DASHBOARD -->
        <section id="student-dashboard" class="hidden space-y-6">
            <div class="bg-slate-800/60 border border-slate-700 rounded-3xl p-6 max-w-2xl mx-auto space-y-6">
                <div>
                    <h3 class="text-lg font-bold text-white mb-1 flex items-center gap-2">
                        <i data-lucide="key" class="text-indigo-400"></i> Join Classroom & Load Exams
                    </h3>
                    <p class="text-xs text-slate-400">Enter your teacher's class code to view active exams.</p>
                </div>

                <form id="join-class-form" class="flex gap-3">
                    <input type="text" id="join-code" required class="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white uppercase text-center font-mono tracking-widest text-lg focus:outline-none focus:border-indigo-500" placeholder="e.g. ENG-5821">
                    <button type="submit" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition flex items-center gap-2">
                        <i data-lucide="search" class="w-4 h-4"></i> Search Exams
                    </button>
                </form>

                <div id="student-exams-section" class="pt-4 border-t border-slate-700/60 hidden">
                    <h4 id="student-class-title" class="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4">Available Exams</h4>
                    <div id="student-exams-list" class="space-y-3">
                        <!-- Dynamic insertion -->
                    </div>
                </div>
            </div>
        </section>

        <!-- INTERACTIVE EXAM TAKING INTERFACE -->
        <section id="exam-taking-section" class="hidden max-w-3xl mx-auto space-y-6">
            <!-- Exam Sticky Bar -->
            <div class="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 sticky top-20 z-30 backdrop-blur-md flex justify-between items-center shadow-xl">
                <div>
                    <h2 id="active-exam-title" class="text-lg font-extrabold text-white">Exam Title</h2>
                    <p id="active-exam-class" class="text-xs text-slate-400">Subject Name</p>
                </div>
                <div class="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
                    <i data-lucide="clock" class="w-4 h-4 text-amber-400 animate-spin"></i>
                    <span id="exam-timer" class="font-mono font-bold text-amber-400 text-lg">00:00</span>
                </div>
            </div>

            <!-- Exam Questions Card -->
            <form id="exam-submission-form" class="space-y-6">
                <div id="exam-questions-container" class="space-y-4">
                    <!-- Dynamic insertion of questions -->
                </div>

                <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl text-base shadow-xl shadow-emerald-600/20 transition flex items-center justify-center gap-2">
                    <i data-lucide="check-circle" class="w-5 h-5"></i> Submit Exam Answers
                </button>
            </form>
        </section>

        <!-- EXAM RESULT SUMMARY VIEW -->
        <section id="exam-result-section" class="hidden max-w-lg mx-auto text-center py-8">
            <div class="bg-slate-800/80 border border-slate-700 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
                <div id="result-icon-container" class="w-20 h-20 rounded-full mx-auto flex items-center justify-center">
                    <!-- Dynamic Lucide icon -->
                </div>
                
                <div>
                    <h2 class="text-2xl font-extrabold text-white" id="result-title">Exam Completed!</h2>
                    <p class="text-xs text-slate-400 mt-1" id="result-subtitle">Your responses have been automatically graded.</p>
                </div>

                <div class="bg-slate-900/90 rounded-2xl p-6 border border-slate-700/80 space-y-2">
                    <div class="text-xs uppercase font-bold tracking-wider text-slate-400">Your Final Score</div>
                    <div class="text-4xl font-extrabold text-indigo-400" id="result-score-text">0 / 0</div>
                    <div class="text-lg font-bold text-slate-300" id="result-percent-text">0%</div>
                </div>

                <button id="btn-return-dashboard" class="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl text-sm transition">
                    Return to Student Dashboard
                </button>
            </div>
        </section>

    </main>

    <!-- TEACHER EXAM BUILDER MODAL -->
    <div id="exam-builder-modal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div class="p-6 border-b border-slate-800 flex justify-between items-center">
                <div>
                    <h3 class="text-lg font-bold text-white">Exam Builder</h3>
                    <p class="text-xs text-slate-400" id="modal-class-subtitle">Create a test for this class</p>
                </div>
                <button id="close-modal-btn" class="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <form id="create-exam-form" class="flex-1 overflow-y-auto p-6 space-y-6">
                <input type="hidden" id="exam-class-id">
                
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="sm:col-span-2">
                        <label class="block text-xs font-bold text-slate-400 mb-1">Exam Title</label>
                        <input type="text" id="exam-title" required class="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white" placeholder="Mid-Term Grammar Assessment">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-1">Duration (Minutes)</label>
                        <input type="number" id="exam-duration" min="1" max="180" required value="15" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white">
                    </div>
                </div>

                <div class="border-t border-slate-800 pt-4 space-y-4">
                    <div class="flex justify-between items-center">
                        <h4 class="text-sm font-bold text-indigo-400 uppercase tracking-wider">Questions List</h4>
                        <button type="button" id="add-question-btn" class="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1">
                            <i data-lucide="plus" class="w-3.5 h-3.5"></i> Add Question
                        </button>
                    </div>

                    <div id="questions-builder-container" class="space-y-6">
                        <!-- Dynamic Question Blocks -->
                    </div>
                </div>

                <div class="pt-4 border-t border-slate-800 flex justify-end gap-3">
                    <button type="button" id="cancel-exam-btn" class="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition">Cancel</button>
                    <button type="submit" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-lg shadow-emerald-600/30">
                        Publish Exam
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        // Storage Manager using browser LocalStorage
        const DB = {
            getProfiles: () => JSON.parse(localStorage.getItem('portal_profiles') || '[]'),
            setProfiles: (data) => localStorage.setItem('portal_profiles', JSON.stringify(data)),
            
            getClasses: () => JSON.parse(localStorage.getItem('portal_classes') || '[]'),
            setClasses: (data) => localStorage.setItem('portal_classes', JSON.stringify(data)),
            
            getExams: () => JSON.parse(localStorage.getItem('portal_exams') || '[]'),
            setExams: (data) => localStorage.setItem('portal_exams', JSON.stringify(data)),

            getSubmissions: () => JSON.parse(localStorage.getItem('portal_submissions') || '[]'),
            setSubmissions: (data) => localStorage.setItem('portal_submissions', JSON.stringify(data)),
            
            getCurrentUser: () => JSON.parse(localStorage.getItem('portal_current_user') || 'null'),
            setCurrentUser: (user) => localStorage.setItem('portal_current_user', JSON.stringify(user))
        };

        // Global App State
        let currentUser = DB.getCurrentUser();
        let examTimerInterval = null;
        let activeExamData = null;

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
                userBadge.classList.remove('hidden');
                userBadge.classList.add('flex');
                authStatus.textContent = `${currentUser.name} (${currentUser.role.toUpperCase()})`;
                logoutBtn.classList.remove('hidden');

                // Check teacher approval status
                if (currentUser.role === 'teacher' && currentUser.account_status === 'pending') {
                    alert('Your account is awaiting payment verification by the System Owner.');
                    DB.setCurrentUser(null);
                    checkSession();
                    return;
                }

                showRoleDashboard(currentUser.role);
            } else {
                userBadge.classList.add('hidden');
                logoutBtn.classList.add('hidden');
                showAuthSection();
            }

            if (window.lucide) lucide.createIcons();
        }

        // Show/Hide Sections
        function hideAllSections() {
            document.getElementById('auth-section').classList.add('hidden');
            document.getElementById('owner-dashboard').classList.add('hidden');
            document.getElementById('teacher-dashboard').classList.add('hidden');
            document.getElementById('student-dashboard').classList.add('hidden');
            document.getElementById('exam-taking-section').classList.add('hidden');
            document.getElementById('exam-result-section').classList.add('hidden');
        }

        function showAuthSection() {
            hideAllSections();
            document.getElementById('auth-section').classList.remove('hidden');
        }

        function showRoleDashboard(role) {
            hideAllSections();
            if (role === 'owner') {
                document.getElementById('owner-dashboard').classList.remove('hidden');
                renderOwnerDashboard();
            } else if (role === 'teacher') {
                document.getElementById('teacher-dashboard').classList.remove('hidden');
                renderTeacherDashboard();
            } else if (role === 'student') {
                document.getElementById('student-dashboard').classList.remove('hidden');
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

            tabLogin.addEventListener('click', () => {
                tabLogin.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition bg-indigo-600 text-white shadow-md';
                tabRegister.className = 'flex-1 py-2 text-xs font-bold text-slate-400 hover:text-white transition';
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            });

            tabRegister.addEventListener('click', () => {
                tabRegister.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition bg-indigo-600 text-white shadow-md';
                tabLogin.className = 'flex-1 py-2 text-xs font-bold text-slate-400 hover:text-white transition';
                registerForm.classList.remove('hidden');
                loginForm.classList.add('hidden');
            });

            roleSelect.addEventListener('change', (e) => {
                if (e.target.value === 'teacher') {
                    teacherFields.classList.remove('hidden');
                } else {
                    teacherFields.classList.add('hidden');
                }
            });
        }

        // Form Event Listeners
        function setupEventListeners() {
            // Register Form Submit
            document.getElementById('register-form').addEventListener('submit', (e) => {
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
                    school: role === 'teacher' ? document.getElementById('reg-school').value : '',
                    payment_ref: role === 'teacher' ? document.getElementById('reg-payment-ref').value : ''
                };

                profiles.push(newUser);
                DB.setProfiles(profiles);

                if (role === 'teacher') {
                    alert('Teacher account registered! Pending payment approval by System Owner.');
                } else {
                    alert('Account created successfully! You can now log in.');
                }

                document.getElementById('tab-login').click();
            });

            // Login Form Submit
            document.getElementById('login-form').addEventListener('submit', (e) => {
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

            // Logout Button
            document.getElementById('logout-btn').addEventListener('click', () => {
                if (examTimerInterval) clearInterval(examTimerInterval);
                DB.setCurrentUser(null);
                checkSession();
            });

            // Create Class Form
            document.getElementById('create-class-form')?.addEventListener('submit', (e) => {
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

            // Student Search Class Exams Form
            document.getElementById('join-class-form')?.addEventListener('submit', (e) => {
                e.preventDefault();
                const code = document.getElementById('join-code').value.trim().toUpperCase();
                const classes = DB.getClasses();
                const matchedClass = classes.find(c => c.class_code === code);

                const examsSection = document.getElementById('student-exams-section');
                const examsListContainer = document.getElementById('student-exams-list');
                const classTitle = document.getElementById('student-class-title');

                if (!matchedClass) {
                    alert('No class found with that Class Code. Please verify with your teacher.');
                    examsSection.classList.add('hidden');
                    return;
                }

                classTitle.textContent = `${matchedClass.class_name} (${matchedClass.subject})`;
                examsSection.classList.remove('hidden');

                renderStudentExams(matchedClass.id);
            });

            // Modal Controls
            document.getElementById('close-modal-btn')?.addEventListener('click', closeModal);
            document.getElementById('cancel-exam-btn')?.addEventListener('click', closeModal);

            // Add Question Button in Modal
            document.getElementById('add-question-btn')?.addEventListener('click', () => {
                addQuestionToBuilder();
            });

            // Exam Creation Form Submission
            document.getElementById('create-exam-form')?.addEventListener('submit', handleExamPublish);

            // Student Exam Submission Handler
            document.getElementById('exam-submission-form')?.addEventListener('submit', (e) => {
                e.preventDefault();
                submitStudentExam();
            });

            // Return to Student Dashboard Handler
            document.getElementById('btn-return-dashboard')?.addEventListener('click', () => {
                showRoleDashboard('student');
            });
        }

        // Render Owner Dashboard
        function renderOwnerDashboard() {
            const profiles = DB.getProfiles().filter(p => p.account_status === 'pending');
            const container = document.getElementById('owner-pending-list');

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
            const classes = DB.getClasses().filter(c => c.teacher_email === currentUser.email);
            const container = document.getElementById('teacher-classes-cards');
            const allExams = DB.getExams();

            if (classes.length === 0) {
                container.innerHTML = `<p class="text-xs text-slate-500 italic py-4 text-center col-span-2">No classes created yet. Fill out the form on the left to create your first class.</p>`;
                return;
            }

            container.innerHTML = classes.map(c => {
                const classExams = allExams.filter(e => e.class_id === c.id);
                return `
                <div class="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80 space-y-3 flex flex-col justify-between">
                    <div>
                        <h4 class="font-bold text-white text-sm">${c.class_name}</h4>
                        <p class="text-xs text-slate-400 mb-2">${c.subject}</p>
                        <div class="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                            <span class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Class Code:</span>
                            <span class="font-mono font-bold text-indigo-400 text-sm">${c.class_code}</span>
                        </div>
                    </div>

                    <div class="pt-2 border-t border-slate-800">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-[11px] font-bold text-slate-400">Exams (${classExams.length})</span>
                            <button onclick="window.openExamBuilder('${c.id}', '${c.class_name}')" class="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                                <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i> Add Exam
                            </button>
                        </div>
                        <div class="space-y-1">
                            ${classExams.map(ex => `
                                <div class="bg-slate-950/60 p-2 rounded-lg text-xs flex justify-between items-center text-slate-300 border border-slate-800">
                                    <span class="truncate max-w-[140px] font-medium">${ex.title}</span>
                                    <span class="text-[10px] text-slate-500">${ex.questions.length} Qs • ${ex.duration}m</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `}).join('');

            if (window.lucide) lucide.createIcons();
        }

        // Exam Builder Modal Functions
        window.openExamBuilder = function(classId, className) {
            document.getElementById('exam-class-id').value = classId;
            document.getElementById('modal-class-subtitle').textContent = `Building test for: ${className}`;
            document.getElementById('questions-builder-container').innerHTML = '';
            
            // Add initial empty question
            addQuestionToBuilder();
            
            document.getElementById('exam-builder-modal').classList.remove('hidden');
        };

        function closeModal() {
            document.getElementById('exam-builder-modal').classList.add('hidden');
            document.getElementById('create-exam-form').reset();
        }

        function addQuestionToBuilder() {
            const container = document.getElementById('questions-builder-container');
            const qIndex = container.children.length;

            const qCard = document.createElement('div');
            qCard.className = 'q-block bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 relative';
            qCard.innerHTML = `
                <div class="flex justify-between items-center">
                    <span class="text-xs font-bold text-indigo-400 uppercase tracking-wider">Question ${qIndex + 1}</span>
                    ${qIndex > 0 ? `<button type="button" onclick="this.closest('.q-block').remove()" class="text-rose-400 hover:text-rose-300 text-xs font-bold">Remove</button>` : ''}
                </div>
                <div>
                    <input type="text" required class="q-title w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white" placeholder="Enter question statement...">
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <input type="text" required class="q-opt-a w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white" placeholder="Option A">
                    <input type="text" required class="q-opt-b w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white" placeholder="Option B">
                    <input type="text" required class="q-opt-c w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white" placeholder="Option C">
                    <input type="text" required class="q-opt-d w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white" placeholder="Option D">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-400 mb-1">Correct Option Answer</label>
                    <select class="q-correct w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white">
                        <option value="A">Option A</option>
                        <option value="B">Option B</option>
                        <option value="C">Option C</option>
                        <option value="D">Option D</option>
                    </select>
                </div>
            `;
            container.appendChild(qCard);
        }

        function handleExamPublish(e) {
            e.preventDefault();
            const classId = document.getElementById('exam-class-id').value;
            const title = document.getElementById('exam-title').value;
            const duration = parseInt(document.getElementById('exam-duration').value, 10);

            const qBlocks = document.querySelectorAll('.q-block');
            const questions = [];

            qBlocks.forEach((block, idx) => {
                questions.push({
                    id: idx,
                    question: block.querySelector('.q-title').value,
                    options: {
                        A: block.querySelector('.q-opt-a').value,
                        B: block.querySelector('.q-opt-b').value,
                        C: block.querySelector('.q-opt-c').value,
                        D: block.querySelector('.q-opt-d').value
                    },
                    correct: block.querySelector('.q-correct').value
                });
            });

            const newExam = {
                id: Date.now().toString(),
                class_id: classId,
                title,
                duration,
                questions
            };

            const exams = DB.getExams();
            exams.push(newExam);
            DB.setExams(exams);

            closeModal();
            renderTeacherDashboard();
            alert('Exam published successfully!');
        }

        // Student Available Exams Renderer
        function renderStudentExams(classId) {
            const exams = DB.getExams().filter(e => e.class_id === classId);
            const submissions = DB.getSubmissions().filter(s => s.student_email === currentUser.email);
            const container = document.getElementById('student-exams-list');

            if (exams.length === 0) {
                container.innerHTML = `<p class="text-xs text-slate-500 italic py-2 text-center">No active exams published for this class yet.</p>`;
                return;
            }

            container.innerHTML = exams.map(ex => {
                const existingSub = submissions.find(s => s.exam_id === ex.id);
                return `
                    <div class="bg-slate-900 p-4 rounded-2xl border border-slate-700/80 flex justify-between items-center">
                        <div>
                            <h5 class="font-bold text-white text-sm">${ex.title}</h5>
                            <p class="text-xs text-slate-400">${ex.questions.length} Questions • ${ex.duration} Mins limit</p>
                        </div>
                        ${existingSub ? `
                            <div class="bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-400">
                                Completed: ${existingSub.score} / ${existingSub.total} (${existingSub.percentage}%)
                            </div>
                        ` : `
                            <button onclick="window.startExam('${ex.id}')" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-xl font-bold transition flex items-center gap-1">
                                <i data-lucide="play" class="w-3.5 h-3.5"></i> Start Exam
                            </button>
                        `}
                    </div>
                `;
            }).join('');

            if (window.lucide) lucide.createIcons();
        }

        // Interactive Student Exam Engine
        window.startExam = function(examId) {
            const exams = DB.getExams();
            activeExamData = exams.find(e => e.id === examId);
            if (!activeExamData) return;

            hideAllSections();
            document.getElementById('exam-taking-section').classList.remove('hidden');

            document.getElementById('active-exam-title').textContent = activeExamData.title;
            const classObj = DB.getClasses().find(c => c.id === activeExamData.class_id);
            document.getElementById('active-exam-class').textContent = classObj ? `${classObj.class_name} • ${classObj.subject}` : 'Class Exam';

            // Populate Questions
            const qContainer = document.getElementById('exam-questions-container');
            qContainer.innerHTML = activeExamData.questions.map((q, idx) => `
                <div class="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 backdrop-blur-xl space-y-4">
                    <div class="text-sm font-bold text-white flex gap-2">
                        <span class="text-indigo-400">Q${idx + 1}.</span>
                        <span>${q.question}</span>
                    </div>

                    <div class="space-y-2">
                        ${Object.entries(q.options).map(([key, text]) => `
                            <label class="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                                <input type="radio" name="question_${q.id}" value="${key}" class="w-4 h-4 text-indigo-600 bg-slate-950 border-slate-700 focus:ring-indigo-500">
                                <span class="text-xs text-slate-300 font-medium"><strong class="text-slate-400 mr-1">${key}.</strong> ${text}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `).join('');

            // Start Timer
            let timeRemaining = activeExamData.duration * 60;
            const timerEl = document.getElementById('exam-timer');

            if (examTimerInterval) clearInterval(examTimerInterval);

            const updateTimerDisplay = () => {
                const mins = Math.floor(timeRemaining / 60);
                const secs = timeRemaining % 60;
                timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            };

            updateTimerDisplay();

            examTimerInterval = setInterval(() => {
                timeRemaining--;
                updateTimerDisplay();

                if (timeRemaining <= 0) {
                    clearInterval(examTimerInterval);
                    alert('Time is up! Your exam answers are automatically being submitted.');
                    submitStudentExam();
                }
            }, 1000);

            if (window.lucide) lucide.createIcons();
        };

        // Automated Exam Grading & Submission
        function submitStudentExam() {
            if (examTimerInterval) clearInterval(examTimerInterval);
            if (!activeExamData) return;

            let totalScore = 0;
            const totalQuestions = activeExamData.questions.length;

            activeExamData.questions.forEach(q => {
                const selectedRadio = document.querySelector(`input[name="question_${q.id}"]:checked`);
                if (selectedRadio && selectedRadio.value === q.correct) {
                    totalScore++;
                }
            });

            const percentage = Math.round((totalScore / totalQuestions) * 100);

            const submission = {
                id: Date.now().toString(),
                exam_id: activeExamData.id,
                student_email: currentUser.email,
                score: totalScore,
                total: totalQuestions,
                percentage,
                submitted_at: new Date().toISOString()
            };

            const submissions = DB.getSubmissions();
            submissions.push(submission);
            DB.setSubmissions(submissions);

            // Display Results
            hideAllSections();
            document.getElementById('exam-result-section').classList.remove('hidden');

            const iconContainer = document.getElementById('result-icon-container');
            const resultTitle = document.getElementById('result-title');

            if (percentage >= 50) {
                iconContainer.className = "w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
                iconContainer.innerHTML = `<i data-lucide="award" class="w-10 h-10"></i>`;
                resultTitle.textContent = "Congratulations! You Passed!";
            } else {
                iconContainer.className = "w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-rose-500/10 text-rose-400 border border-rose-500/30";
                iconContainer.innerHTML = `<i data-lucide="alert-circle" class="w-10 h-10"></i>`;
                resultTitle.textContent = "Exam Completed";
            }

            document.getElementById('result-score-text').textContent = `${totalScore} / ${totalQuestions}`;
            document.getElementById('result-percent-text').textContent = `${percentage}% Grade`;

            if (window.lucide) lucide.createIcons();
            activeExamData = null;
        }
    </script>
</body>
</html>
