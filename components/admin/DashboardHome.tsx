import React from 'react';

const DashboardHome: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-black mb-4">Selamat Datang, Admin!</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-black">
                    Ini adalah dasbor administrasi untuk Computer-Based Test (CBT) MIN Singkawang.
                    Gunakan menu navigasi di sebelah kiri untuk mengelola bank soal, data siswa, atau jadwal ujian.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-blue-100 p-4 rounded-lg text-center">
                        <i className="fas fa-database text-4xl text-blue-600 mb-2"></i>
                        <h3 className="font-bold text-lg text-black">Kelola Soal</h3>
                        <p className="text-sm text-black">Tambah, edit, dan hapus soal dari bank soal.</p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg text-center">
                        <i className="fas fa-users text-4xl text-green-600 mb-2"></i>
                        <h3 className="font-bold text-lg text-black">Kelola Siswa</h3>
                        <p className="text-sm text-black">Tambah, edit, dan hapus data siswa.</p>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-lg text-center">
                        <i className="fas fa-calendar-alt text-4xl text-yellow-600 mb-2"></i>
                        <h3 className="font-bold text-lg text-black">Kelola Ujian</h3>
                        <p className="text-sm text-black">Atur jadwal dan konfigurasi ujian.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;