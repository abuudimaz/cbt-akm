import React, { useState, useEffect, useCallback, useRef } from 'react';
// Fix: Import types from the types module.
import type { User, Exam, UserAnswers, Answer } from '../types';
import Timer from './Timer';
import QuestionRenderer from './QuestionRenderer';
import QuestionNavigator, { isAnsweredEffectively } from './QuestionNavigator';
import Modal from './Modal';

interface ExamScreenProps {
  user: User;
  exam: Exam;
  onFinish: (answers: UserAnswers, time: number) => void;
}

type SaveStatus = 'idle' | 'saving' | 'saved';

const ExamHeader: React.FC<{ user: User; title: string; saveStatus: SaveStatus }> = ({ user, title, saveStatus }) => (
    <header className="w-full bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
            <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Kementerian_Agama_new_logo.png/535px-Kementerian_Agama_new_logo.png" 
                alt="Logo Kemenag" 
                className="h-12" 
            />
            <div>
                <h1 className="text-xl font-bold">MIN SINGKAWANG</h1>
                <p className="text-sm">{title}</p>
            </div>
        </div>
        <div className="flex items-center space-x-4">
             <div className="flex items-center text-sm text-white transition-opacity duration-500" style={{ opacity: saveStatus !== 'idle' ? 1 : 0 }}>
                {saveStatus === 'saving' && (
                    <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        <span>Saving...</span>
                    </>
                )}
                {saveStatus === 'saved' && (
                    <>
                        <i className="fas fa-check-circle mr-2"></i>
                        <span>Saved successfully</span>
                    </>
                )}
            </div>
           <div className="text-right">
             <p className="font-semibold">{user.name}</p>
             <p className="text-xs">{user.username}</p>
           </div>
        </div>
    </header>
);


const ExamScreen: React.FC<ExamScreenProps> = ({ user, exam, onFinish }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<UserAnswers>({});
    const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60);

    // Warning/Confirmation Modals
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    
    // Save/Load Progress State
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
    const [showLoadProgressModal, setShowLoadProgressModal] = useState(false);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const savedAnswersRef = useRef<UserAnswers | null>(null);
    const storageKey = `cbt-progress-${user.username}-${exam.id}`;
    
    // Ref to hold the latest answers for use in callbacks
    const answersRef = useRef(answers);
    useEffect(() => {
        answersRef.current = answers;
    }, [answers]);

    const timeLeftRef = useRef(timeLeft);
    useEffect(() => {
        timeLeftRef.current = timeLeft;
    }, [timeLeft]);

    const handleFinish = useCallback(() => {
        if(document.fullscreenElement) {
            document.exitFullscreen();
        }
        localStorage.removeItem(storageKey);
        onFinish(answersRef.current, timeLeftRef.current);
    }, [onFinish, storageKey]);

    // Effect for loading progress from localStorage on mount
    useEffect(() => {
        const savedProgress = localStorage.getItem(storageKey);
        if (savedProgress) {
            try {
                const parsedAnswers = JSON.parse(savedProgress);
                if (Object.keys(parsedAnswers).length > 0) {
                    savedAnswersRef.current = parsedAnswers;
                    setShowLoadProgressModal(true);
                }
            } catch (error) {
                console.error("Failed to parse saved progress:", error);
                localStorage.removeItem(storageKey);
            }
        }
    }, [storageKey]);

    // Effect for fullscreen and visibility listeners
    useEffect(() => {
        try {
            document.documentElement.requestFullscreen();
        } catch (e) {
            console.warn("Fullscreen mode could not be enabled:", e);
        }
        
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                setWarningMessage('Anda telah keluar dari mode layar penuh. Ujian akan dihentikan jika Anda tidak kembali ke mode layar penuh.');
                setShowWarningModal(true);
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                setWarningMessage('Anda telah beralih tab atau window. Tindakan ini dilarang dan dapat menyebabkan ujian Anda dihentikan.');
                setShowWarningModal(true);
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        };
    }, []);

    // Refs for debounce timeouts
    const saveTimeoutRef = useRef<number | null>(null);
    const statusResetTimeoutRef = useRef<number | null>(null);

    // Update answers state and trigger debounced auto-save
    const handleAnswerChange = useCallback((questionId: string, answer: Answer) => {
        setAnswers(prevAnswers => ({
             ...prevAnswers,
             [questionId]: answer,
        }));
        
        setSaveStatus('saving');

        // Clear previous timeouts to reset the debounce and status-reset timers
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        if (statusResetTimeoutRef.current) clearTimeout(statusResetTimeoutRef.current);

        // Set a new debounce timer for saving
        saveTimeoutRef.current = window.setTimeout(() => {
            // answersRef always has the latest answers due to its own useEffect
            try {
                localStorage.setItem(storageKey, JSON.stringify(answersRef.current));
                setSaveStatus('saved');
                
                // After saving, set a timer to hide the 'Saved' message
                statusResetTimeoutRef.current = window.setTimeout(() => {
                    setSaveStatus('idle');
                }, 2000); // Hide after 2 seconds
            } catch (error) {
                console.error("Auto-save failed:", error);
                setSaveStatus('idle'); // Reset on error
            }
        }, 1500); // Debounce time: 1.5 seconds

    }, [storageKey]);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            if (statusResetTimeoutRef.current) clearTimeout(statusResetTimeoutRef.current);
        };
    }, []);

    const navigateToQuestion = (index: number) => {
        if (index >= 0 && index < exam.questions.length) {
            setCurrentQuestionIndex(index);
        }
    };
    
    const handleManualSave = useCallback(() => {
        // Clear any pending auto-save to prevent race conditions
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        if (statusResetTimeoutRef.current) clearTimeout(statusResetTimeoutRef.current);
        
        try {
            localStorage.setItem(storageKey, JSON.stringify(answers));
            setShowSaveConfirmation(true);
            setTimeout(() => setShowSaveConfirmation(false), 2000); // Hide after 2 seconds
        } catch (error) {
            console.error("Failed to save progress:", error);
        }
    }, [answers, storageKey]);

    const handleLoadProgressChoice = (load: boolean) => {
        if (load && savedAnswersRef.current) {
            setAnswers(savedAnswersRef.current);
        } else {
            // If starting new, clear the old progress
            localStorage.removeItem(storageKey);
        }
        setShowLoadProgressModal(false);
    };

    const currentQuestion = exam.questions[currentQuestionIndex];
    
    // Exam Statistics Calculation
    const totalQuestions = exam.questions.length;
    const answeredCount = exam.questions.filter(q => isAnsweredEffectively(answers[q.id])).length;
    const remainingCount = totalQuestions - answeredCount;

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <ExamHeader user={user} title={exam.title} saveStatus={saveStatus} />
            <div className="flex-grow flex p-4 gap-4 overflow-hidden">
                {/* Main Content */}
                <main className="flex-grow w-2/3 flex flex-col bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
                    <QuestionRenderer
                        question={currentQuestion}
                        userAnswer={answers[currentQuestion.id] || null}
                        onAnswerChange={handleAnswerChange}
                    />
                </main>

                {/* Sidebar */}
                <aside className="w-1/3 flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                        <h2 className="font-bold text-lg mb-2 text-black">Sisa Waktu</h2>
                        <Timer initialTime={timeLeft} onTimeUp={handleFinish} setTimeLeft={setTimeLeft} />
                    </div>
                     <div className="bg-white p-4 rounded-lg shadow-lg">
                        <h2 className="font-bold text-lg mb-3 text-center border-b pb-2 text-black">Statistik Ujian</h2>
                        <div className="space-y-3 text-md">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center text-black">
                                    <i className="fas fa-layer-group w-5 text-center mr-2 text-blue-600"></i>
                                    <span>Total Soal:</span>
                                </div>
                                <span className="font-bold">{totalQuestions}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center text-black">
                                    <i className="fas fa-check-circle w-5 text-center mr-2 text-blue-600"></i>
                                    <span>Sudah Dijawab:</span>
                                </div>
                                <span className="font-bold text-blue-600">{answeredCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center text-black">
                                    <i className="fas fa-edit w-5 text-center mr-2 text-blue-600"></i>
                                    <span>Belum Dijawab:</span>
                                </div>
                                <span className="font-bold text-blue-600">{remainingCount}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white flex-grow p-4 rounded-lg shadow-lg">
                        <QuestionNavigator
                            questions={exam.questions}
                            answers={answers}
                            currentQuestionIndex={currentQuestionIndex}
                            onNavigate={navigateToQuestion}
                        />
                    </div>
                    <div className="flex flex-col space-y-2 mt-auto">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => navigateToQuestion(currentQuestionIndex - 1)}
                                disabled={currentQuestionIndex === 0}
                                className="w-full py-2 px-4 bg-white border border-blue-500 text-black font-semibold rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <i className="fas fa-chevron-left mr-2"></i> Soal Sebelumnya
                            </button>
                             <button
                                onClick={() => navigateToQuestion(currentQuestionIndex + 1)}
                                disabled={currentQuestionIndex === exam.questions.length - 1}
                                className="w-full py-2 px-4 bg-white border border-blue-500 text-black font-semibold rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Soal Berikutnya <i className="fas fa-chevron-right ml-2"></i>
                            </button>
                        </div>
                         <button
                            onClick={handleManualSave}
                            className="w-full py-2 px-4 bg-blue-100 text-blue-800 font-semibold rounded-md hover:bg-blue-200 transition-colors relative flex items-center justify-center"
                        >
                            <i className="fas fa-save mr-2"></i>
                            Simpan Progres
                            {showSaveConfirmation && (
                                <span className="ml-3 bg-blue-200 text-blue-900 px-2 py-0.5 rounded-md text-xs font-bold">Tersimpan!</span>
                            )}
                        </button>
                         <button
                            onClick={() => setShowConfirmModal(true)}
                            className="w-full py-3 px-4 bg-blue-600 text-white font-bold text-lg rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                           <i className="fas fa-paper-plane"></i>
                           Kumpulkan & Selesaikan
                        </button>
                    </div>
                </aside>
            </div>
             <Modal
                isOpen={showLoadProgressModal}
                onClose={() => handleLoadProgressChoice(false)}
                title="Progres Tersimpan Ditemukan"
            >
                <p>Kami menemukan progres ujian yang belum selesai. Apakah Anda ingin melanjutkan sesi terakhir atau memulai dari awal?</p>
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={() => handleLoadProgressChoice(false)}
                        className="px-4 py-2 bg-transparent border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 font-semibold transition-colors flex items-center"
                    >
                        <i className="fas fa-trash-alt mr-2"></i>
                        Mulai Baru (Hapus Progres)
                    </button>
                     <button
                        onClick={() => handleLoadProgressChoice(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold transition-colors flex items-center"
                    >
                        <i className="fas fa-play mr-2"></i>
                        Lanjutkan Ujian
                    </button>
                </div>
            </Modal>
             <Modal
                isOpen={showWarningModal}
                onClose={() => setShowWarningModal(false)}
                title="Peringatan!"
            >
                <p className="text-blue-600">{warningMessage}</p>
                <button
                    onClick={() => {
                        setShowWarningModal(false);
                        document.documentElement.requestFullscreen().catch(console.warn);
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                    Kembali ke Ujian
                </button>
            </Modal>
             <Modal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title="Konfirmasi Selesai Ujian"
            >
                <p>Apakah Anda yakin ingin menyelesaikan ujian ini? Jawaban tidak dapat diubah setelahnya.</p>
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={() => setShowConfirmModal(false)}
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md"
                    >
                        Batal
                    </button>
                     <button
                        onClick={() => {
                            setShowConfirmModal(false);
                            handleFinish();
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Ya, Kumpulkan
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default ExamScreen;