import React, { useState, useEffect } from 'react';
import type { Exam, Question } from '../../types';

interface ExamFormProps {
    initialData: Exam | null;
    allQuestions: Question[];
    onSubmit: (examData: Exam | Omit<Exam, 'id'>) => void;
    onCancel: () => void;
}

const ExamForm: React.FC<ExamFormProps> = ({ initialData, allQuestions, onSubmit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [durationMinutes, setDurationMinutes] = useState(60);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDurationMinutes(initialData.durationMinutes);
            setSelectedQuestionIds(initialData.questions.map(q => q.id));
        } else {
            setTitle('');
            setDurationMinutes(60);
            setSelectedQuestionIds([]);
        }
    }, [initialData]);

    const handleQuestionToggle = (questionId: string) => {
        setSelectedQuestionIds(prev => {
            const newQuestionIds = prev.includes(questionId)
                ? prev.filter(id => id !== questionId)
                : [...prev, questionId];
            return newQuestionIds;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedQuestions = allQuestions.filter(q => selectedQuestionIds.includes(q.id));
        
        const examData = {
            title,
            durationMinutes,
            questions: selectedQuestions,
        };

        if (initialData) {
            onSubmit({ ...initialData, ...examData });
        } else {
            onSubmit(examData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-black">Judul Ujian</label>
                <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2 border rounded-md mt-1" />
            </div>
            <div>
                <label htmlFor="durationMinutes" className="block text-sm font-medium text-black">Durasi (Menit)</label>
                <input type="number" id="durationMinutes" name="durationMinutes" value={durationMinutes} onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))} required className="w-full p-2 border rounded-md mt-1" />
            </div>
            <div>
                <label className="block text-sm font-medium text-black">Pilih Soal ({selectedQuestionIds.length} dipilih)</label>
                <div className="max-h-60 overflow-y-auto border rounded-md p-2 mt-1">
                    {allQuestions.map(q => (
                        <div key={q.id} className="flex items-center gap-2 p-1">
                            <input
                                type="checkbox"
                                id={`q-${q.id}`}
                                checked={selectedQuestionIds.includes(q.id)}
                                onChange={() => handleQuestionToggle(q.id)}
                                className="h-4 w-4 rounded"
                            />
                            <label htmlFor={`q-${q.id}`} className="text-sm text-black truncate">{`[${q.id}] ${q.questionText}`}</label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan</button>
            </div>
        </form>
    );
};

export default ExamForm;
