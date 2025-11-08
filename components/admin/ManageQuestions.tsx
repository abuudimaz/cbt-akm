import React, { useState } from 'react';
// Fix: Import QuestionType as a value and other types for type checking.
import { QuestionType } from '../../types';
import type { Question } from '../../types';
import Modal from '../Modal';
import QuestionForm from './QuestionForm';

interface ManageQuestionsProps {
    questions: (Question & { correctAnswer?: any })[];
    onAdd: (question: Omit<Question, 'id'>) => void;
    onUpdate: (question: Question) => void;
    onDelete: (questionId: string) => void;
}

const ManageQuestions: React.FC<ManageQuestionsProps> = ({ questions, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<QuestionType | 'all'>('all');

    const handleAddClick = () => {
        setEditingQuestion(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (question: Question) => {
        setEditingQuestion(question);
        setIsModalOpen(true);
    };

    const handleFormSubmit = (questionData: Question | Omit<Question, 'id'>) => {
        if ('id' in questionData) {
            onUpdate(questionData as Question);
        } else {
            onAdd(questionData);
        }
        setIsModalOpen(false);
    };

    const confirmDelete = () => {
        if (deletingId) {
            onDelete(deletingId);
            setDeletingId(null);
        }
    };

    const filteredQuestions = filterType === 'all'
        ? questions
        : questions.filter(q => q.type === filterType);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-black">Bank Soal</h1>
                <button
                    onClick={handleAddClick}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                    <i className="fas fa-plus mr-2"></i> Tambah Soal
                </button>
            </div>

            <div className="mb-4">
                <label htmlFor="filterType" className="mr-2 text-black">Filter Tipe Soal:</label>
                <select 
                    id="filterType"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as QuestionType | 'all')}
                    className="p-2 border rounded-md"
                >
                    <option value="all">Semua Tipe</option>
                    {Object.values(QuestionType).map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-4">ID</th>
                            <th className="p-4 w-1/2">Teks Pertanyaan</th>
                            <th className="p-4">Tipe</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredQuestions.map(question => (
                            <tr key={question.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-mono text-sm">{question.id}</td>
                                <td className="p-4 text-black truncate max-w-md">{question.questionText}</td>
                                <td className="p-4 text-black"><span className="bg-gray-200 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">{question.type}</span></td>
                                <td className="p-4 text-center">
                                    <button onClick={() => handleEditClick(question)} className="text-blue-600 hover:text-blue-800 mr-4"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => setDeletingId(question.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingQuestion ? 'Edit Soal' : 'Tambah Soal Baru'}>
                <QuestionForm 
                    initialData={editingQuestion} 
                    onSubmit={handleFormSubmit} 
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
            
            <Modal isOpen={!!deletingId} onClose={() => setDeletingId(null)} title="Konfirmasi Hapus">
                <p className="text-black">Apakah Anda yakin ingin menghapus soal ini? Soal ini mungkin sedang digunakan dalam ujian.</p>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={() => setDeletingId(null)} className="px-4 py-2 border rounded-md">Batal</button>
                    <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Ya, Hapus</button>
                </div>
            </Modal>
        </div>
    );
};

export default ManageQuestions;
