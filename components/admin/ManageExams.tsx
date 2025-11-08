import React, { useState } from 'react';
import type { Exam, Question } from '../../types';
import Modal from '../Modal';
import ExamForm from './ExamForm';

interface ManageExamsProps {
    exams: Exam[];
    questions: Question[];
    onAdd: (exam: Omit<Exam, 'id'>) => void;
    onUpdate: (exam: Exam) => void;
    onDelete: (examId: string) => void;
}

const ManageExams: React.FC<ManageExamsProps> = ({ exams, questions, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExam, setEditingExam] = useState<Exam | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleAddClick = () => {
        setEditingExam(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (exam: Exam) => {
        setEditingExam(exam);
        setIsModalOpen(true);
    };

    const handleFormSubmit = (examData: Exam | Omit<Exam, 'id'>) => {
        if ('id' in examData) {
            onUpdate(examData as Exam);
        } else {
            onAdd(examData);
        }
        setIsModalOpen(false);
    };
    
    const confirmDelete = () => {
        if (deletingId) {
            onDelete(deletingId);
            setDeletingId(null);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-black">Kelola Ujian</h1>
                <button
                    onClick={handleAddClick}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                    <i className="fas fa-plus mr-2"></i> Tambah Ujian
                </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-4">ID</th>
                            <th className="p-4">Judul Ujian</th>
                            <th className="p-4">Durasi (Menit)</th>
                            <th className="p-4">Jumlah Soal</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.map(exam => (
                            <tr key={exam.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-mono text-sm">{exam.id}</td>
                                <td className="p-4 text-black">{exam.title}</td>
                                <td className="p-4 text-black">{exam.durationMinutes}</td>
                                <td className="p-4 text-black">{exam.questions.length}</td>
                                <td className="p-4 text-center">
                                    <button onClick={() => handleEditClick(exam)} className="text-blue-600 hover:text-blue-800 mr-4"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => setDeletingId(exam.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingExam ? 'Edit Ujian' : 'Tambah Ujian Baru'}>
                <ExamForm 
                    initialData={editingExam}
                    allQuestions={questions}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
            
            <Modal isOpen={!!deletingId} onClose={() => setDeletingId(null)} title="Konfirmasi Hapus">
                <p>Apakah Anda yakin ingin menghapus ujian ini? Tindakan ini tidak dapat dibatalkan.</p>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={() => setDeletingId(null)} className="px-4 py-2 border rounded-md">Batal</button>
                    <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Ya, Hapus</button>
                </div>
            </Modal>
        </div>
    );
};

export default ManageExams;
