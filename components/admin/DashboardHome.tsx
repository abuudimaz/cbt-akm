import React from 'react';
// Fix: Import Student and Question types from the types module.
import type { Student, Question } from '../../types';

interface DashboardHomeProps {
  students: Student[];
  questions: Question[];
}

const StatCard: React.FC<{ title: string; value: number | string; icon: string; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${color}`}>
            <i className={`fas ${icon} text-3xl text-white`}></i>
        </div>
        <div>
            <p className="text-gray-500 text-lg">{title}</p>
            <p className="text-4xl font-bold text-black">{value}</p>
        </div>
    </div>
);

const DashboardHome: React.FC<DashboardHomeProps> = ({ students, questions }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-black mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
            title="Total Siswa" 
            value={students.length} 
            icon="fa-users"
            color="bg-blue-500"
        />
        <StatCard 
            title="Total Soal" 
            value={questions.length} 
            icon="fa-file-alt"
            color="bg-green-500"
        />
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="font-bold text-xl mb-3 text-black">Selamat Datang!</h3>
            <p className="text-black">
                Selamat datang di Panel Admin CBT MIN SINGKAWANG. Dari sini, Anda dapat mengelola data siswa,
                mengatur bank soal, dan memantau aktivitas ujian. Gunakan menu navigasi di sebelah kiri untuk memulai.
            </p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-black mb-4">Aktivitas Terkini</h2>
        <p className="text-gray-600">Fitur log aktivitas akan tersedia di pembaruan mendatang.</p>
        {/* Placeholder for recent activity logs */}
      </div>
    </div>
  );
};

export default DashboardHome;
