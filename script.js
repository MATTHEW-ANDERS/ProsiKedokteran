// --- Navigasi Halaman Utama ---
function switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(el => {
        el.classList.remove('active');
        el.classList.add('hidden');
    });

    const target = document.getElementById('view-' + viewId);
    target.classList.remove('hidden');
    target.classList.add('active');

    // Sesuaikan background body luar agar sinkron dengan tipe halamannya
    if (target.classList.contains('container-web')) {
        document.body.style.backgroundColor = '#e9ecef'; // Abu-abu background web
    } else if (target.classList.contains('auth-wrapper')) {
        document.body.style.backgroundColor = '#FFF0F4'; // Background luar pink senada dengan login
    } else {
        document.body.style.backgroundColor = '#d3d9df'; // Background luar untuk Mobile View Simulator
    }

    window.scrollTo(0, 0);
}

// --- Logika Login ---
function handleLogin(event) {
    event.preventDefault();
    const user = document.getElementById('login-username').value.toLowerCase();
    const pass = document.getElementById('login-password').value;

    if (pass !== '123') { alert('Password salah! (Gunakan 123)'); return; }

    if (user === 'user') { switchView('dashboard-user'); }
    else if (user === 'admin') { switchView('dashboard-admin'); }
    else if (user === 'medis') { switchView('dashboard-medis'); }
    else { alert('Username tidak ditemukan!'); }

    document.getElementById('form-login').reset();
}

function logout() { switchView('login'); }

function confirmLogout() {
    document.getElementById('logout-modal').classList.remove('hidden');
}

function closeLogoutModal() {
    document.getElementById('logout-modal').classList.add('hidden');
}

function executeLogout() {
    closeLogoutModal();
    logout();
}

// --- Logika Multi-Step Kuesioner ---
function startKuesioner() {
    switchView('form-mingguan');
    document.querySelectorAll('.kuesioner-step').forEach(el => el.classList.add('hidden'));
    document.getElementById('step-1').classList.remove('hidden');
    document.getElementById('step-counter').innerText = '1';

    // Reset progress bar
    const progressBar = document.getElementById('kuesioner-progress');
    if (progressBar) progressBar.style.width = '20%';
}

function nextStep(current, next) {
    document.getElementById('step-' + current).classList.add('hidden');
    document.getElementById('step-' + next).classList.remove('hidden');
    document.getElementById('step-counter').innerText = next;

    // Update progress bar
    const progressBar = document.getElementById('kuesioner-progress');
    if (progressBar) progressBar.style.width = (next / 5 * 100) + '%';
}

function selectPill(groupId, element) {
    const group = document.getElementById(groupId);
    group.querySelectorAll('.pill').forEach(p => p.classList.remove('selected'));
    element.classList.add('selected');
}

function toggleMuntahFieldPill(value) {
    const container = document.getElementById('muntah-frekuensi-container');
    if (value === 'ya') {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }
}

// --- Logika Gamifikasi (Bunga Bertumbuh) ---
let formSubmittedCount = 0;
const flowerStages = [
    { emoji: '🌱', text: 'Status: Bibit Baru' },
    { emoji: '🌿', text: 'Status: Tunas Tumbuh (Minggu 1)' },
    { emoji: '🌷', text: 'Status: Mulai Kuncup (Minggu 2)' },
    { emoji: '🌸', text: 'Status: Bunga Mekar! (Minggu 3+)' }
];

function submitKuesioner() {
    alert("Kuesioner dikirim! Bunga Anda tumbuh!");
    formSubmittedCount++;
    let stageIndex = formSubmittedCount;
    if (stageIndex >= flowerStages.length) stageIndex = flowerStages.length - 1;

    // Animasi bunga
    const flowerEl = document.getElementById('flower-emoji');
    flowerEl.innerText = flowerStages[stageIndex].emoji;
    flowerEl.style.transform = "scale(1.2)";
    setTimeout(() => flowerEl.style.transform = "scale(1)", 300);
    document.getElementById('flower-status').innerText = flowerStages[stageIndex].text;

    // Tambah riwayat ke dashboard
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const riwayatList = document.getElementById('riwayat-list');
    const riwayatKosong = document.getElementById('riwayat-kosong');
    if (riwayatKosong) riwayatKosong.style.display = 'none';

    const riwayatItem = document.createElement('div');
    riwayatItem.className = 'riwayat-item';
    riwayatItem.innerHTML = `
        <div>
            <div class="riwayat-info">Minggu Ke-${formSubmittedCount}</div>
            <div class="riwayat-date">${dateStr} • ${timeStr}</div>
        </div>
        <div class="riwayat-status">Selesai ✅</div>
    `;
    riwayatList.insertBefore(riwayatItem, riwayatList.firstChild);

    document.getElementById('step-5').classList.add('hidden');
    switchView('dashboard-user');
}

// --- Logika Fitur Suplemen ---
function minumSuplemen() {
    const btn = document.getElementById('btn-suplemen');
    btn.innerText = "Selesai (Sudah diminum) ✅";
    btn.style.background = "#ddd";
    btn.style.color = "#666";
    btn.disabled = true;
}

function toggleSuplemenUser(checkbox) {
    const cardSuplemen = document.getElementById('card-suplemen');
    if (checkbox.checked) { cardSuplemen.style.display = "block"; alert("Suplemen Harian Aktif."); }
    else { cardSuplemen.style.display = "none"; alert("Suplemen dinonaktifkan."); }
}

function toggleAuthMode(mode) {
    const slider = document.getElementById('tab-slider');
    const container = document.getElementById('auth-sliding-container');
    const btnLogin = document.getElementById('btn-tab-login');
    const btnReg = document.getElementById('btn-tab-register');
    const title = document.getElementById('auth-title');

    if (mode === 'login') {
        slider.style.transform = 'translateX(0)';
        container.style.transform = 'translateX(0)';
        btnLogin.style.color = 'var(--primary)';
        btnReg.style.color = '#888';
        title.innerText = 'Sayang Bunda';
    } else {
        slider.style.transform = 'translateX(calc(100% + 12px))';
        container.style.transform = 'translateX(-50%)';
        btnReg.style.color = 'var(--primary)';
        btnLogin.style.color = '#888';
        title.innerText = 'Sayang Bunda';
    }
}