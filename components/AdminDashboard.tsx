import React, { useState } from 'react';
// Fix: Added QuestionWithAnswer to represent question data with correct answers for admin purposes.
import type { User, Question, Student, Exam } from '../types';
import AdminLayout from './admin/AdminLayout';
import DashboardHome from './admin/DashboardHome';
import ManageQuestions from './admin/ManageQuestions';
import ManageStudents from './admin/ManageStudents';
import ManageExams from './admin/ManageExams';
import { EXAM_DATA } from '../constants'; // For initial data

type AdminView = 'home' | 'questions' | 'students' | 'exams';

interface AdminDashboardProps {
  admin: User;
  onLogout: () => void;
}

// Mock correct answers, as they are not part of the base Question type for students.
const MOCK_CORRECT_ANSWERS: Record<string, any> = {
    'Q1': 'Q1A2',
    'Q2': ['Q2A1', 'Q2A3'],
    'Q3': { 'Q3P1': 'Q3M3', 'Q3P2': 'Q3M4', 'Q3P3': 'Q3M1', 'Q3P4': 'Q3M2' },
    'Q4': 'jakarta',
    'Q5': 'Q5A2',
    'Q6': 'cpu',
    'Q7': ['Q7A2', 'Q7A4'],
};

// Augment question data with correct answers for the admin view
const getQuestionsWithAnswers = (questions: Question[]) => {
    return questions.map(q => ({
        ...q,
        correctAnswer: MOCK_CORRECT_ANSWERS[q.id] || null
    }));
};


const AdminDashboard: React.FC<AdminDashboardProps> = ({ admin, onLogout }) => {
    const [view, setView] = useState<AdminView>('home');
    
    // Mock data state
    const [questions, setQuestions] = useState<Question[]>(EXAM_DATA.questions);
    const [students, setStudents] = useState<Student[]>([
        { id: 'S001', name: 'Siswa Uji Coba', username: 'siswa', password: '123' },
        { id: 'S002', name: 'Jane Doe', username: 'jane.doe', password: '123' },
    ]);
    const [exams, setExams] = useState<Exam[]>([EXAM_DATA]);

    const handleAddQuestion = (questionData: Omit<Question, 'id'>) => {
        const newQuestion = { ...questionData, id: `Q${Date.now()}` } as Question;
        setQuestions(prev => [...prev, newQuestion]);
    };
    const handleUpdateQuestion = (updatedQuestion: Question) => {
        setQuestions(prev => prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
    };
    const handleDeleteQuestion = (questionId: string) => {
        setQuestions(prev => prev.filter(q => q.id !== questionId));
    };

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
    
    const handleAddExam = (examData: Omit<Exam, 'id'>) => {
        const newExam = { ...examData, id: `E${Date.now()}`};
        setExams(prev => [...prev, newExam]);
    };
    const handleUpdateExam = (updatedExam: Exam) => {
        setExams(prev => prev.map(e => e.id === updatedExam.id ? updatedExam : e));
    };
    const handleDeleteExam = (examId: string) => {
        setExams(prev => prev.filter(e => e.id !== examId));
    };

    const renderContent = () => {
        switch (view) {
            case 'questions':
                return <ManageQuestions questions={getQuestionsWithAnswers(questions)} onAdd={handleAddQuestion} onUpdate={handleUpdateQuestion} onDelete={handleDeleteQuestion} />;
            case 'students':
                return <ManageStudents students={students} onAdd={handleAddStudent} onUpdate={handleUpdateStudent} onDelete={handleDeleteStudent} />;
            case 'exams':
                return <ManageExams exams={exams} questions={questions} onAdd={handleAddExam} onUpdate={handleUpdateExam} onDelete={handleDeleteExam} />;
            case 'home':
            default:
                return <DashboardHome />;
        }
    };
    
    const NavLink: React.FC<{ targetView: AdminView; icon: string; text: string }> = ({ targetView, icon, text }) => (
        <button
            onClick={() => setView(targetView)}
            className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${view === targetView ? 'bg-gray-900' : 'hover:bg-gray-700'}`}
        >
            <i className={`fas ${icon} w-5 text-center`}></i>
            <span>{text}</span>
        </button>
    );

    return (
        <AdminLayout
            header={
                <div className="p-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-black">Admin Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-black">Welcome, {admin.name}</span>
                        <button onClick={onLogout} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                           <i className="fas fa-sign-out-alt mr-2"></i> Logout
                        </button>
                    </div>
                </div>
            }
            sidebar={
                <>
                    <div className="p-6 text-center border-b border-gray-700">
                        <h2 className="text-2xl font-bold">CBT ADMIN</h2>
                        <p className="text-sm text-gray-400">MIN SINGKAWANG</p>
                    </div>
                    <nav className="flex-grow mt-4">
                       <NavLink targetView="home" icon="fa-home" text="Dashboard" />
                       <NavLink targetView="questions" icon="fa-database" text="Bank Soal" />
                       <NavLink targetView="students" icon="fa-users" text="Data Siswa" />
                       <NavLink targetView="exams" icon="fa-calendar-alt" text="Jadwal Ujian" />
                    </nav>
                </>
            }
        >
            {renderContent()}
        </AdminLayout>
    );
};

export default AdminDashboard;
