import React, { useState } from 'react';
import type { User, Question, Student, Exam } from '../types';
import AdminLayout from './admin/AdminLayout';
import DashboardHome from './admin/DashboardHome';
import ManageQuestions from './admin/ManageQuestions';
import ManageStudents from './admin/ManageStudents';
import ManageExams from './admin/ManageExams';
import { EXAM_DATA } from '../constants'; // For initial questions

// Mock data
const initialStudents: Student[] = [
    { id: 'S001', name: 'Siswa Uji Coba', username: 'siswa1' },
    { id: 'S002', name: 'Budi Santoso', username: 'budi' },
    { id: 'S003', name: 'Ani Yudhoyono', username: 'ani' },
];

// NOTE: In a real app, correct answers would be securely managed on a backend.
// Mock data for correct answers, not exposed to students.
const correctAnswers: { [key: string]: any } = {
    'Q1': 'Q1A2',
    'Q2': ['Q2A1', 'Q2A3'],
    'Q3': { 'Q3P1': 'Q3M3', 'Q3P2': 'Q3M4', 'Q3P3': 'Q3M1', 'Q3P4': 'Q3M2' },
    'Q4': 'jakarta',
    'Q5': 'Q5A2',
    'Q6': 'cpu',
    'Q7': ['Q7A2', 'Q7A4'],
};

// Augment questions with correct answers for admin view
const initialQuestions: (Question & { correctAnswer: any })[] = EXAM_DATA.questions.map(q => ({
    ...q,
    correctAnswer: correctAnswers[q.id],
}));

const initialExams: Exam[] = [EXAM_DATA];


interface AdminDashboardProps {
  admin: User;
  onLogout: () => void;
}

type AdminView = 'home' | 'questions' | 'students' | 'exams';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ admin, onLogout }) => {
    const [currentView, setCurrentView] = useState<AdminView>('home');
    const [questions, setQuestions] = useState(initialQuestions);
    const [students, setStudents] = useState(initialStudents);
    const [exams, setExams] = useState(initialExams);

    // Question CRUD
    const handleAddQuestion = (questionData: Omit<Question, 'id'>) => {
        const newQuestion = { ...questionData, id: `Q${Date.now()}` };
        // Fix: Ensure correct answer is part of the new question object.
        setQuestions(prev => [...prev, newQuestion as Question & { correctAnswer: any }]);
    };
    const handleUpdateQuestion = (updatedQuestion: Question) => {
        setQuestions(prev => prev.map(q => q.id === updatedQuestion.id ? (updatedQuestion as Question & { correctAnswer: any }) : q));
    };
    const handleDeleteQuestion = (questionId: string) => {
        setQuestions(prev => prev.filter(q => q.id !== questionId));
    };

    // Student CRUD
    const handleAddStudent = (studentData: Omit<Student, 'id'>) => {
        const newStudent = { ...studentData, id: `S${Date.now()}` };
        setStudents(prev => [...prev, newStudent]);
    };
    const handleUpdateStudent = (updatedStudent: Student) => {
        setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    };
    const handleDeleteStudent = (studentId: string) => {
        setStudents(prev => prev.filter(s => s.id !== studentId));
    };

    // Exam CRUD
    const handleAddExam = (examData: Omit<Exam, 'id'>) => {
        const newExam = { ...examData, id: `EXAM${Date.now()}` };
        setExams(prev => [...prev, newExam]);
    };
    const handleUpdateExam = (updatedExam: Exam) => {
        setExams(prev => prev.map(e => e.id === updatedExam.id ? updatedExam : e));
    };
    const handleDeleteExam = (examId: string) => {
        setExams(prev => prev.filter(e => e.id !== examId));
    };


    const renderContent = () => {
        switch (currentView) {
            case 'questions':
                return <ManageQuestions questions={questions} onAdd={handleAddQuestion} onUpdate={handleUpdateQuestion} onDelete={handleDeleteQuestion} />;
            case 'students':
                return <ManageStudents students={students} onAdd={handleAddStudent} onUpdate={handleUpdateStudent} onDelete={handleDeleteStudent} />;
            case 'exams':
                return <ManageExams exams={exams} questions={questions} onAdd={handleAddExam} onUpdate={handleUpdateExam} onDelete={handleDeleteExam} />;
            case 'home':
            default:
                return <DashboardHome />;
        }
    };
    
    const Sidebar = (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-6 text-center">Admin Menu</h2>
            <nav>
                <ul>
                    <li className="mb-2">
                        <button onClick={() => setCurrentView('home')} className={`w-full text-left px-4 py-2 rounded-md ${currentView === 'home' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                            <i className="fas fa-home mr-2"></i> Dasbor
                        </button>
                    </li>
                    <li className="mb-2">
                        <button onClick={() => setCurrentView('questions')} className={`w-full text-left px-4 py-2 rounded-md ${currentView === 'questions' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                           <i className="fas fa-database mr-2"></i> Bank Soal
                        </button>
                    </li>
                    <li className="mb-2">
                        <button onClick={() => setCurrentView('students')} className={`w-full text-left px-4 py-2 rounded-md ${currentView === 'students' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                            <i className="fas fa-users mr-2"></i> Data Siswa
                        </button>
                    </li>
                    <li className="mb-2">
                        <button onClick={() => setCurrentView('exams')} className={`w-full text-left px-4 py-2 rounded-md ${currentView === 'exams' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                            <i className="fas fa-calendar-alt mr-2"></i> Jadwal Ujian
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
    
    const Header = (
        <div className="flex justify-between items-center p-4">
            <h1 className="text-xl font-semibold text-black">Admin Dashboard - MIN Singkawang</h1>
            <div>
                <span className="text-black mr-4">Welcome, {admin.name}</span>
                <button onClick={onLogout} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    <i className="fas fa-sign-out-alt mr-2"></i> Logout
                </button>
            </div>
        </div>
    );

    return (
        <AdminLayout header={Header} sidebar={Sidebar}>
            {renderContent()}
        </AdminLayout>
    );
};

export default AdminDashboard;
