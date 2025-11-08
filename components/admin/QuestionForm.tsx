import React, { useState, useEffect } from 'react';
// Fix: Import QuestionType as a value and other types for type checking.
import { QuestionType } from '../../types';
import type { Question, SingleChoiceQuestion, MultipleChoiceQuestion, MatchingQuestion, ShortAnswerQuestion } from '../../types';

interface QuestionFormProps {
    initialData: Question | null;
    onSubmit: (questionData: Question | Omit<Question, 'id'>) => void;
    onCancel: () => void;
}

// Fix: Removed incorrect return type `Omit<Question, 'id'>` which was causing type errors due to how TypeScript handles Omit on union types.
// The return type is now correctly inferred by TypeScript.
const getNewQuestionTemplate = (type: QuestionType) => {
    const base = {
        questionText: '',
        stimulus: '',
    };
    switch (type) {
        case QuestionType.SINGLE_CHOICE:
            return { ...base, type, options: [{id: 'O1', text: ''}], correctAnswer: '' };
        case QuestionType.MULTIPLE_CHOICE:
            return { ...base, type, options: [{id: 'O1', text: ''}], correctAnswer: [] };
        case QuestionType.MATCHING:
            return { ...base, type, prompts: [{id: 'P1', text: ''}], matches: [{id: 'M1', text: ''}], correctAnswer: {} };
        case QuestionType.SHORT_ANSWER:
            return { ...base, type, correctAnswer: '' };
        default:
             return { ...base, type: QuestionType.SINGLE_CHOICE, options: [{id: 'O1', text: ''}], correctAnswer: '' };
    }
};


const QuestionForm: React.FC<QuestionFormProps> = ({ initialData, onSubmit, onCancel }) => {
    // Fix: Using `any` for the state type is a pragmatic solution to handle the complex and dynamic shape of the question object in the form,
    // which avoids issues with TypeScript's handling of discriminated unions and properties that only exist on certain types in the union.
    const [question, setQuestion] = useState<any>(initialData || getNewQuestionTemplate(QuestionType.SINGLE_CHOICE));
    
    useEffect(() => {
        setQuestion(initialData || getNewQuestionTemplate(QuestionType.SINGLE_CHOICE));
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'type') {
            setQuestion(getNewQuestionTemplate(value as QuestionType));
        } else {
            setQuestion(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleOptionChange = (index: number, text: string) => {
        const q = question as SingleChoiceQuestion | MultipleChoiceQuestion;
        const newOptions = [...q.options];
        newOptions[index].text = text;
        setQuestion({ ...q, options: newOptions });
    };
    
    const addOption = () => {
        const q = question as SingleChoiceQuestion | MultipleChoiceQuestion;
        const newOptions = [...q.options, {id: `O${Date.now()}`, text: ''}];
        setQuestion({ ...q, options: newOptions });
    };
    
    const removeOption = (index: number) => {
        const q = question as SingleChoiceQuestion | MultipleChoiceQuestion;
        const newOptions = q.options.filter((_, i) => i !== index);
        setQuestion({ ...q, options: newOptions });
    };

    // Fix: Widen type to include Record<string, string> for matching questions.
    const handleCorrectAnswerChange = (value: string | string[] | Record<string, string>) => {
        setQuestion(prev => ({ ...prev, correctAnswer: value as any }));
    };

    const handleMatchingListChange = (type: 'prompts' | 'matches', index: number, text: string) => {
        const q = question as MatchingQuestion;
        const newList = [...q[type]];
        newList[index].text = text;
        setQuestion({ ...q, [type]: newList });
    };

    const addMatchingListItem = (type: 'prompts' | 'matches') => {
        const q = question as MatchingQuestion;
        const prefix = type === 'prompts' ? 'P' : 'M';
        const newList = [...q[type], { id: `${prefix}${Date.now()}`, text: '' }];
        setQuestion({ ...q, [type]: newList });
    };

    const removeMatchingListItem = (type: 'prompts' | 'matches', index: number) => {
        const q = question as MatchingQuestion;
        const newList = q[type].filter((_, i) => i !== index);
        setQuestion({ ...q, [type]: newList });
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(question);
    };

    const renderOptions = () => {
        const q = question as SingleChoiceQuestion | MultipleChoiceQuestion;
        return (
            <div>
                <label className="block text-sm font-medium text-black">Pilihan Jawaban</label>
                {q.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2 mt-2">
                        {q.type === QuestionType.SINGLE_CHOICE && (
                            <input type="radio" name="correctAnswer" value={option.id} checked={(q.correctAnswer as string) === option.id} onChange={(e) => handleCorrectAnswerChange(e.target.value)} className="h-5 w-5" />
                        )}
                        {q.type === QuestionType.MULTIPLE_CHOICE && (
                            <input type="checkbox" value={option.id} checked={(q.correctAnswer as string[]).includes(option.id)} onChange={(e) => {
                                const current = q.correctAnswer as string[];
                                const newCorrect = current.includes(option.id) ? current.filter(id => id !== option.id) : [...current, option.id];
                                handleCorrectAnswerChange(newCorrect);
                            }} className="h-5 w-5 rounded" />
                        )}
                        <input type="text" value={option.text} onChange={(e) => handleOptionChange(index, e.target.value)} className="flex-grow p-2 border rounded-md" placeholder={`Opsi ${index + 1}`} />
                        <button type="button" onClick={() => removeOption(index)} className="text-red-500 hover:text-red-700 p-2"><i className="fas fa-trash"></i></button>
                    </div>
                ))}
                <button type="button" onClick={addOption} className="mt-2 text-blue-600 hover:text-blue-800 text-sm">+ Tambah Pilihan</button>
            </div>
        );
    };

    const renderMatchingFields = () => {
        const q = question as MatchingQuestion;
        return (
            <div className="grid grid-cols-2 gap-4">
                <div>
                     <label className="block text-sm font-medium text-black">Kolom Pernyataan (Prompts)</label>
                     {q.prompts.map((p, i) => (
                         <div key={i} className="flex items-center gap-2 mt-1">
                            <input type="text" value={p.text} onChange={e => handleMatchingListChange('prompts', i, e.target.value)} className="flex-grow p-2 border rounded-md" />
                            <button type="button" onClick={() => removeMatchingListItem('prompts', i)} className="text-red-500"><i className="fas fa-trash"></i></button>
                         </div>
                     ))}
                     <button type="button" onClick={() => addMatchingListItem('prompts')} className="mt-2 text-blue-600 text-sm">+ Tambah Pernyataan</button>
                </div>
                 <div>
                     <label className="block text-sm font-medium text-black">Kolom Jawaban (Matches)</label>
                     {q.matches.map((m, i) => (
                         <div key={i} className="flex items-center gap-2 mt-1">
                            <input type="text" value={m.text} onChange={e => handleMatchingListChange('matches', i, e.target.value)} className="flex-grow p-2 border rounded-md" />
                            <button type="button" onClick={() => removeMatchingListItem('matches', i)} className="text-red-500"><i className="fas fa-trash"></i></button>
                         </div>
                     ))}
                     <button type="button" onClick={() => addMatchingListItem('matches')} className="mt-2 text-blue-600 text-sm">+ Tambah Jawaban</button>
                </div>
                 <div className="col-span-2">
                    <label className="block text-sm font-medium text-black">Kunci Jawaban Jodohkan</label>
                    {q.prompts.map(p => (
                        <div key={p.id} className="flex items-center gap-2 mt-1">
                            <span className="w-1/3 truncate">{p.text || 'Pernyataan'}</span>
                            <span>=</span>
                            <select
                                value={q.correctAnswer[p.id] || ''}
                                onChange={e => handleCorrectAnswerChange({ ...q.correctAnswer, [p.id]: e.target.value })}
                                className="flex-grow p-2 border rounded-md"
                            >
                                <option value="">Pilih...</option>
                                {q.matches.map(m => <option key={m.id} value={m.id}>{m.text}</option>)}
                            </select>
                        </div>
                    ))}
                 </div>
            </div>
        );
    };

    const renderShortAnswerFields = () => {
        const q = question as ShortAnswerQuestion;
        return (
            <div>
                <label className="block text-sm font-medium text-black">Kunci Jawaban</label>
                <input type="text" value={q.correctAnswer} onChange={(e) => handleCorrectAnswerChange(e.target.value)} className="w-full p-2 border rounded-md mt-1" placeholder="Jawaban yang benar (case-insensitive)" />
            </div>
        );
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-black">Tipe Soal</label>
                <select id="type" name="type" value={question.type} onChange={handleChange} className="w-full p-2 border rounded-md mt-1">
                    {Object.values(QuestionType).map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="questionText" className="block text-sm font-medium text-black">Teks Pertanyaan</label>
                <textarea id="questionText" name="questionText" value={question.questionText} onChange={handleChange} required rows={3} className="w-full p-2 border rounded-md mt-1" />
            </div>
             <div>
                <label htmlFor="stimulus" className="block text-sm font-medium text-black">Teks Stimulus (Opsional)</label>
                <textarea id="stimulus" name="stimulus" value={question.stimulus} onChange={handleChange} rows={3} className="w-full p-2 border rounded-md mt-1" />
            </div>
            
            {(question.type === QuestionType.SINGLE_CHOICE || question.type === QuestionType.MULTIPLE_CHOICE) && renderOptions()}
            {question.type === QuestionType.MATCHING && renderMatchingFields()}
            {question.type === QuestionType.SHORT_ANSWER && renderShortAnswerFields()}

            <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan</button>
            </div>
        </form>
    );
};

export default QuestionForm;