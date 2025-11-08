import React, { useState } from 'react';
import { EXAM_DATA, STUDENTS_DATA } from '../constants';
// Fix: Import all necessary types from the types module.
import type { User, AdminView, Student, Question } from '../types';
import AdminLayout from './admin/AdminLayout';
import DashboardHome from './admin/DashboardHome';
import ManageStudents from './admin/ManageStudents';
import ManageQuestions from './admin/ManageQuestions';

interface AdminDashboardProps {
  admin: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ admin, onLogout }) => {
  const [currentView, setCurrentView] = useState<AdminView>('home');
  const [students, setStudents] = useState<Student[]>(STUDENTS_DATA);
  const [questions, setQuestions] = useState<Question[]>(EXAM_DATA.questions);

  // Student CRUD
  const handleAddStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...student,
      // Fix: Generate a more robust unique ID for new students.
      id: `S${Date.now()}`,
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };

  // Question CRUD
  const handleAddQuestion = (question: Omit<Question, 'id'>) => {
    const newQuestion = {
      ...question,
      // Fix: Generate a more robust unique ID for new questions.
      id: `Q${Date.now()}`,
    } as Question;
    setQuestions(prev => [...prev, newQuestion]);
  };

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    setQuestions(prev => prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
  };


  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <DashboardHome students={students} questions={questions} />;
      case 'students':
        return (
          <ManageStudents
            students={students}
            onAdd={handleAddStudent}
            onUpdate={handleUpdateStudent}
            onDelete={handleDeleteStudent}
          />
        );
      case 'questions':
        return (
          <ManageQuestions
            questions={questions}
            onAdd={handleAddQuestion}
            onUpdate={handleUpdateQuestion}
            onDelete={handleDeleteQuestion}
          />
        );
      default:
        return <DashboardHome students={students} questions={questions} />;
    }
  };

  return (
    <AdminLayout admin={admin} onLogout={onLogout} setView={setCurrentView} currentView={currentView}>
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminDashboard;
