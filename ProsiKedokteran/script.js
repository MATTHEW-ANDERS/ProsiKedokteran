const questions = [
    { text: "Berapa Berat Badan Anda hari ini? (kg)", type: "FITB", inputType: "number" },
    {
        text: "Bagaimana Pola Makan Anda?", type: "MC", options:
            ["Gizi Seimbang: Makan 3x sehari dengan komposisi lengkap (Karbohidrat, Protein, Sayur, dan Buah)",
                "Kurang Serat: Sering melewatkan sayur dan buah-buahan",
                "Tinggi Gula/Garam: Sering konsumsi makanan instan, junk food, atau minuman manis",
                "Tidak Teratur: Sering melewatkan waktu makan (misal: tidak sarapan)",
                "Porsi Kecil: Makan sering tapi dalam porsi yang sangat sedikit (biasanya karena mual)"
            ]
    },
    { text: "Apakah Anda Mengkonsumsi Protein?", type: "MC", options: ["Ayam", "Sapi", "Ikan", "Telur", "Protein Nabati"] },
    { text: "Obat Apa Yang Sedang Anda Dikonsumsi?", type: "FITB", inputType: "text" },
    { text: "Apakah Sudah Konsumsi Suplemen?", type: "MC", options: ["Ya", "Tidak"] },
    { text: "Apakah ada keluhan mual?", type: "MC", options: ["Ya", "Tidak"] },
    { text: "Berapa Kali Anda Muntah Hari Ini?", type: "MC", options: ["Tidak Pernah", "1-3 Kali", "> 3 Kali"] },
    { text: "Apakah Anda Berolahraga?", type: "MC", options: ["Tidak Berolahraga", "Kegiatan Rumah Tangga", "Lari", "Senam", "Angkat Beban", "Olahraga Fisik Lainnya"], followUpTrigger: "Olahraga Fisik Lainnya", followUpText: "Sebutkan jenis olahraga fisik yang dilakukan:" },
    { text: "Apakah Domisili Masih di Tempat yang Sama?", type: "MC", options: ["Ya", "Tidak"] }
];

let currentStep = 0;
let tempAnswers = {}; 

// --- Variabel Bunga & Dompet (Terhubung dengan LocalStorage) ---
let questionnaireFilledCount = parseInt(localStorage.getItem('flowerProgress')) || 0; 
const targetFlowerCount = 6; 

let userPoints = parseInt(localStorage.getItem('userPoints')) || 0;
let pointHistory = JSON.parse(localStorage.getItem('pointHistory')) || [];
// ---------------------------------------------------------------

function showPage(pageId) {
    const pages = ['authPage', 'dashboardPage', 'kuesionerPage', 'profilePage', 'historyPage'];
    pages.forEach(p => document.getElementById(p).classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    document.getElementById('profileIcon').style.display = (pageId === 'profilePage' || pageId === 'authPage') ? 'none' : 'flex';
}

function startKuesioner() {
    currentStep = 0;
    tempAnswers = {};
    updateKuesionerUI();
    showPage('kuesionerPage');
}

function handleMCClick(btnElement, selectedOption) {
    const q = questions[currentStep];
    const extraContainer = document.getElementById('extraInputContainer');

    const allBtns = document.querySelectorAll('.opt-btn');
    allBtns.forEach(btn => btn.classList.remove('selected'));
    btnElement.classList.add('selected');

    if (q.followUpTrigger && selectedOption === q.followUpTrigger) {
        extraContainer.innerHTML = `
            <p style="font-size: 14px; margin-bottom: 10px; color: #666;">${q.followUpText}</p>
            <input type="text" class="big-input" id="followUpInput" placeholder="Misal: Berenang, Sepakbola...">
        `;
        document.getElementById('followUpInput').focus();
    } else {
        extraContainer.innerHTML = '';
    }
}

function updateKuesionerUI() {
    const q = questions[currentStep];
    document.getElementById('questionText').innerText = q.text;
    const inputArea = document.getElementById('inputArea');
    const btnNext = document.getElementById('btnNext');
    inputArea.innerHTML = '';

    btnNext.style.display = "block";

    if (currentStep === questions.length - 1) {
        btnNext.innerText = "Kirim";
    } else {
        btnNext.innerText = "Selanjutnya";
    }

    if (q.type === "FITB") {
        const type = q.inputType || "text";
        inputArea.innerHTML = `<input type="${type}" class="big-input" id="answerInput" placeholder="Ketik di sini...">`;
    } else {
        q.options.forEach(opt => {
            let displayHTML = opt;
            if(opt.includes(': ')) {
                const splitIndex = opt.indexOf(': ');
                const title = opt.substring(0, splitIndex + 1); 
                const desc = opt.substring(splitIndex + 2); 
                displayHTML = `<span class="opt-title">${title}</span><span class="opt-desc">${desc}</span>`;
            }
            inputArea.innerHTML += `<button class="opt-btn" onclick="handleMCClick(this, '${opt}')">${displayHTML}</button>`;
        });
        inputArea.innerHTML += `<div id="extraInputContainer" style="margin-top:20px;"></div>`;
    }

    const progress = ((currentStep + 1) / questions.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('stepIndicator').innerText = `Pertanyaan ${currentStep + 1} dari ${questions.length}`;
    document.getElementById('btnPrev').style.visibility = currentStep === 0 ? 'hidden' : 'visible';
}

function nextStep() {
    if (currentStep < questions.length - 1) {
        currentStep++;
        updateKuesionerUI();
    } else {
        alert("Data Berhasil Disimpan!");
        showPage('dashboardPage');
        
        // --- LOGIKA SETELAH MENGISI KUESIONER ---
        // 1. Tambah Poin + Catat Histori
        earnPoints(50, "Selesai Mengisi Kuesioner Rutin");
        
        // 2. Tumbuhkan Bunga
        completeQuestionnaireSim();
    }
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        updateKuesionerUI();
    }
}

// ==========================================
// FUNGSI DOMPET & HISTORI POIN
// ==========================================

function updateWalletUI() {
    // 1. Perbarui Angka di Dashboard
    document.getElementById('pointsDisplay').innerText = userPoints;

    // 2. Perbarui Daftar Histori
    const historyList = document.getElementById('historyList');
    const emptyState = document.getElementById('emptyHistoryState');
    
    historyList.innerHTML = '';

    if (pointHistory.length === 0) {
        historyList.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        historyList.style.display = 'block';
        emptyState.style.display = 'none';
        
        pointHistory.forEach(item => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.innerHTML = `
                <div class="history-info">
                    <h4>${item.activity}</h4>
                    <p>${item.date}</p>
                </div>
                <div class="history-points">+${item.points}</div>
            `;
            historyList.appendChild(li);
        });
    }
}

function earnPoints(amount, activityName) {
    userPoints += amount; // Tambah saldo poin
    
    const now = new Date();
    const dateString = now.toLocaleDateString('id-ID') + ' ' + now.toLocaleTimeString('id-ID');
    
    // Masukkan ke array histori paling atas
    pointHistory.unshift({
        points: amount,
        activity: activityName,
        date: dateString
    });
    
    // Batasi histori maksimal 15 riwayat terakhir agar ringan
    if (pointHistory.length > 15) {
        pointHistory.pop();
    }
    
    // Simpan ke Browser
    localStorage.setItem('userPoints', userPoints);
    localStorage.setItem('pointHistory', JSON.stringify(pointHistory));
    
    // Perbarui Tampilan
    updateWalletUI();
}


// ==========================================
// FUNGSI BUNGA DASHBOARD 
// ==========================================

function updateFlowerGrowthUI() {
    const flowerImage = document.getElementById('flowerImage');
    const flowerProgresText = document.getElementById('flowerProgresText');
    
    const basePath = "../ProsiKedokteran/assets/";
    let imageSrc = basePath + "bunga-tahap-1.png"; 
    let text = "";

    let percentage = Math.round((questionnaireFilledCount / targetFlowerCount) * 100);

    if (questionnaireFilledCount === 0) {
        imageSrc = basePath + "bunga-tahap-1.png";
        text = `Progres Bunga Anda: 0% (Belum Ada Progres)`;
    } 
    else if (questionnaireFilledCount <= 2) {
        imageSrc = basePath + "bunga-tahap-1.png";
        text = `Progres Bunga Anda: ${percentage}% (Baru Tumbuh)`;
    } 
    else if (questionnaireFilledCount <= 5) {
        imageSrc = basePath + "bunga-tahap-2.png";
        text = `Progres Bunga Anda: ${percentage}% (Sedang Tumbuh)`;
    } 
    else if (questionnaireFilledCount >= 6) {
        imageSrc = basePath + "bunga-tahap-3.png";
        text = `Progres Bunga Anda: 100% (Mekar Sepenuhnya! 🎉)`;
    }

    flowerImage.src = imageSrc;
    flowerProgresText.innerText = text;

    // Bonus jika bunga mekar pertama kali (agar poin tidak berulang terus saat di 100%)
    if (questionnaireFilledCount === targetFlowerCount && percentage === 100) {
        // Cek apakah bonus bunga mekar sudah diberikan (simpan state di localStorage)
        const bonusClaimed = localStorage.getItem('flowerBonusClaimed');
        if(!bonusClaimed) {
            setTimeout(() => {
                alert("Selamat! Bunga telah mekar sepenuhnya (100%) dan Anda mendapatkan Bonus Poin! 🌸🎉");
                earnPoints(100, "Bonus Bunga Mekar 100%"); // Kasih poin tambahan
                localStorage.setItem('flowerBonusClaimed', 'true');
            }, 300); 
        }
    }
}

function completeQuestionnaireSim() {
    questionnaireFilledCount++; 
    if (questionnaireFilledCount > targetFlowerCount) {
        questionnaireFilledCount = targetFlowerCount; 
    }
    
    // Simpan progres bunga ke memori browser
    localStorage.setItem('flowerProgress', questionnaireFilledCount);
    
    updateFlowerGrowthUI(); 
}

// ==========================================
// Inisialisasi Saat Buka Aplikasi
// ==========================================
function initializeDashboard() {
    updateWalletUI();       // Muat poin
    updateFlowerGrowthUI(); // Muat gambar bunga
}

initializeDashboard();

// Fungsi login & logout
// Fungsi login dengan pemisah Role (User vs Admin)
function login() { 
    // Ambil nilai yang diketik di kolom input
    const userVal = document.getElementById('loginUser').value;
    const passVal = document.getElementById('loginPass').value;

    // Cek apakah input kosong
    if (userVal === "" || passVal === "") {
        alert("Mohon isi Username dan Kata Sandi terlebih dahulu!");
        return;
    }

    // Simulasi Cek Role Admin
    if (userVal.toLowerCase() === "admin" && passVal === "admin123") {
        alert("Login berhasil sebagai Admin!");
        // Arahkan ke file admin (pastikan file admin.html ada di folder yang sama)
        window.location.href = "admin.html"; 
    } 
    // Simulasi Cek Role User (Bunda)
    else {
        alert(`Selamat datang, Bunda ${userVal}!`);
        // Simpan nama user sementara untuk ditampilkan di dashboard jika mau
        showPage('dashboardPage'); 
        document.getElementById('mainNav').classList.remove('hidden');
        
        // Opsional: Kosongkan form setelah login
        document.getElementById('loginUser').value = "";
        document.getElementById('loginPass').value = "";
    }
}
function logout() { document.getElementById('mainNav').classList.add('hidden'); showPage('authPage'); }
function switchAuth(type) {
    document.getElementById('loginForm').classList.toggle('hidden', type === 'regis');
    document.getElementById('regisForm').classList.toggle('hidden', type === 'login');
    document.getElementById('tabLogin').classList.toggle('active', type === 'login');
    document.getElementById('tabRegis').classList.toggle('active', type === 'regis');
}

// Fungsi tambahan untuk reset data saat pengetesan
function resetData() {
    if(confirm("Apakah Anda yakin ingin mereset dompet poin dan progres bunga? (Hanya untuk keperluan demo/testing)")){
        localStorage.clear();
        userPoints = 0;
        pointHistory = [];
        questionnaireFilledCount = 0;
        
        updateWalletUI();
        updateFlowerGrowthUI();
        
        alert("Semua data telah direset menjadi 0.");
        showPage('dashboardPage');
    }
}