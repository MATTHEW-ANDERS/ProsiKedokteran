// Data Simulasi (Mock Data) Responden
const mockData = [
    {
        id: 1,
        nama: "Siti Aminah",
        nohp: "081234567890",
        status: "Sudah Mengisi",
        tanggal: "08 April 2026",
        jawaban: { bb: "60 kg", polaMakan: "Gizi Seimbang", mual: "Tidak", olahraga: "Senam" }
    },
    {
        id: 2,
        nama: "Rina Marlina",
        nohp: "082233445566",
        status: "Belum Mengisi",
        tanggal: "-",
        jawaban: { bb: "-", polaMakan: "-", mual: "-", olahraga: "-" }
    },
    {
        id: 3,
        nama: "Dewi Lestari",
        nohp: "085566778899",
        status: "Sudah Mengisi",
        tanggal: "05 April 2026",
        jawaban: { bb: "55 kg", polaMakan: "Porsi Kecil", mual: "Ya", olahraga: "Tidak Berolahraga" }
    },
    {
        id: 4,
        nama: "Ayu Wandira",
        nohp: "087711223344",
        status: "Sudah Mengisi",
        tanggal: "07 April 2026",
        jawaban: { bb: "62 kg", polaMakan: "Kurang Serat", mual: "Tidak", olahraga: "Kegiatan Rumah Tangga" }
    },
    {
        id: 5,
        nama: "Bunga Pertiwi",
        nohp: "089988776655",
        status: "Belum Mengisi",
        tanggal: "-",
        jawaban: { bb: "-", polaMakan: "-", mual: "-", olahraga: "-" }
    }
];

// Fungsi untuk me-render data ke dalam tabel HTML
function renderTable() {
    const tableBody = document.getElementById('tableBody');
    let htmlContent = '';
    
    let totalSudah = 0;
    let totalBelum = 0;

    mockData.forEach((user, index) => {
        // Hitung statistik
        if (user.status === "Sudah Mengisi") totalSudah++;
        else totalBelum++;

        // Atur warna badge (label status)
        const badgeClass = user.status === "Sudah Mengisi" ? "badge sudah" : "badge belum";

        htmlContent += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${user.nama}</strong></td>
                <td>${user.nohp}</td>
                <td><span class="${badgeClass}">${user.status}</span></td>
                <td>${user.tanggal}</td>
                <td>
                    <button class="btn-detail" onclick="lihatDetail(${user.id})">Lihat Data</button>
                </td>
            </tr>
        `;
    });

    // Masukkan ke HTML
    tableBody.innerHTML = htmlContent;

    // Perbarui angka statistik di atas tabel
    document.getElementById('totalResponden').innerText = mockData.length;
    document.getElementById('totalSudah').innerText = totalSudah;
    document.getElementById('totalBelum').innerText = totalBelum;
}

// Fungsi untuk melihat detail jawaban saat tombol ditekan
function lihatDetail(id) {
    const user = mockData.find(u => u.id === id);
    if (user.status === "Belum Mengisi") {
        alert(`${user.nama} belum mengisi kuesioner bulan ini.`);
        return;
    }
    
    const detail = `
        Data Kuesioner: ${user.nama}
        ------------------------------
        Berat Badan: ${user.jawaban.bb}
        Pola Makan: ${user.jawaban.polaMakan}
        Keluhan Mual: ${user.jawaban.mual}
        Olahraga: ${user.jawaban.olahraga}
    `;
    alert(detail);
}

// ==========================================
// FUNGSI EXPORT KE EXCEL / GOOGLE SHEETS (CSV)
// ==========================================
function exportToCSV() {
    // 1. Buat Baris Header untuk Excel
    const headers = ["No", "Nama Bunda", "No HP", "Status Pengisian", "Pembaruan Terakhir", "Berat Badan", "Pola Makan", "Keluhan Mual", "Olahraga"];
    
    // 2. Petakan data ke dalam baris array
    const rows = mockData.map((user, index) => [
        index + 1,
        user.nama,
        `'${user.nohp}`, // Tambah petik agar Excel tidak menghapus angka 0 di depan No HP
        user.status,
        user.tanggal,
        user.jawaban.bb,
        user.jawaban.polaMakan,
        user.jawaban.mual,
        user.jawaban.olahraga
    ]);

    // 3. Gabungkan Header dan Baris Data menjadi format CSV
    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");

    // 4. Proses Trigger Download File
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Data_Responden_Sayang_Bunda.csv"); // Nama file yang didownload
    document.body.appendChild(link);
    
    link.click(); // Otomatis mengklik tombol download tersembunyi
    document.body.removeChild(link);
}

// Panggil fungsi render saat halaman dibuka
window.onload = renderTable;