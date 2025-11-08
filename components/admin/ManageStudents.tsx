import React, { useState } from 'react';
// Fix: Import Student type from the types module.
import type { Student } from '../../types';
import Modal from '../Modal';
import StudentForm from './StudentForm';

interface ManageStudentsProps {
    students: Student[];
    onAdd: (student: Omit<Student, 'id'>) => void;
    onUpdate: (student: Student) => void;
    onDelete: (studentId: string) => void;
}

const ManageStudents: React.FC<ManageStudentsProps> = ({ students, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleAddClick = () => {
        setEditingStudent(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (student: Student) => {
        setEditingStudent(student);
        setIsModalOpen(true);
    };

    const handleFormSubmit = (studentData: Student | Omit<Student, 'id'>) => {
        if ('id' in studentData) {
            onUpdate(studentData as Student);
        } else {
            onAdd(studentData);
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
                <h1 className="text-3xl font-bold text-black">Kelola Data Siswa</h1>
                <button
                    onClick={handleAddClick}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                    <i className="fas fa-plus mr-2"></i> Tambah Siswa
                </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-4">ID</th>
                            <th className="p-4">Nama Lengkap</th>
                            <th className="p-4">Username</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-mono text-sm">{student.id}</td>
                                <td className="p-4 text-black">{student.name}</td>
                                <td className="p-4 text-black">{student.username}</td>
                                <td className="p-4 text-center">
                                    <button onClick={() => handleEditClick(student)} className="text-blue-600 hover:text-blue-800 mr-4"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => setDeletingId(student.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStudent ? 'Edit Siswa' : 'Tambah Siswa Baru'}>
                <StudentForm 
                    initialData={editingStudent} 
                    onSubmit={handleFormSubmit} 
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
            
            <Modal isOpen={!!deletingId} onClose={() => setDeletingId(null)} title="Konfirmasi Hapus">
                <p className="text-black">Apakah Anda yakin ingin menghapus siswa ini? Semua data terkait siswa ini akan hilang.</p>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={() => setDeletingId(null)} className="px-4 py-2 border rounded-md">Batal</button>
                    <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Ya, Hapus</button>
                </div>
            </Modal>
        </div>
    );
};

export default ManageStudents;
