import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { User, Exam, UserAnswers, Answer } from '../types';
import Timer from './Timer';
import QuestionRenderer from './QuestionRenderer';
import QuestionNavigator from './QuestionNavigator';
import Modal from './Modal';

interface ExamScreenProps {
  user: User;
  exam: Exam;
  onFinish: (answers: UserAnswers, timeLeft: number) => void;
}

const ExamScreen: React.FC<ExamScreenProps> = ({ user, exam, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  // State for resume and auto-save functionality
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [loadedAnswers, setLoadedAnswers] = useState<UserAnswers | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const saveTimeoutRef = useRef<number | null>(null);

  const currentQuestion = exam.questions[currentQuestionIndex];
  const storageKey = `cbt-progress-${user.username}-${exam.id}`;

  const initializeEmptyAnswers = useCallback(() => {
    const initialAnswers: UserAnswers = {};
    exam.questions.forEach(q => {
      initialAnswers[q.id] = null;
    });
    setAnswers(initialAnswers);
  }, [exam.questions]);

  // Effect to check for saved progress on initial load
  useEffect(() => {
    const savedProgress = localStorage.getItem(storageKey);

    if (savedProgress) {
      try {
        const parsedAnswers = JSON.parse(savedProgress);
        setLoadedAnswers(parsedAnswers);
        setIsResumeModalOpen(true);
      } catch (e) {
        console.error("Failed to parse saved progress, starting new exam.", e);
        localStorage.removeItem(storageKey);
        initializeEmptyAnswers();
      }
    } else {
      initializeEmptyAnswers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, initializeEmptyAnswers]);

  // Effect for auto-saving answers with debounce
  useEffect(() => {
    if (Object.keys(answers).length === 0) {
      return; // Don't save initial empty state
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSaveStatus('saving');

    saveTimeoutRef.current = window.setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(answers));
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000); // Reset status after 2s
      } catch (error) {
        console.error("Failed to save progress to localStorage", error);
        setSaveStatus('idle'); // Reset on error
      }
    }, 1000); // 1-second debounce

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [answers, storageKey]);

  const handleAnswerChange = (questionId: string, answer: Answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };
  
  const handleManualSave = () => {
    try {
        localStorage.setItem(storageKey, JSON.stringify(answers));
        setShowSaveConfirmation(true);
        setTimeout(() => setShowSaveConfirmation(false), 2000); // Message disappears after 2s
    } catch (error) {
        console.error("Failed to manually save progress to localStorage", error);
    }
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < exam.questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleFinish = () => {
    onFinish(answers, timeLeft);
    localStorage.removeItem(storageKey); // Clear progress on finish
  };

  const handleTimeUp = () => {
    handleFinish();
  };

  const handleResume = () => {
    if (loadedAnswers) {
        setAnswers(loadedAnswers);
    }
    setIsResumeModalOpen(false);
  };

  const handleStartNew = () => {
    localStorage.removeItem(storageKey);
    initializeEmptyAnswers();
    setIsResumeModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white shadow-md flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-black">{exam.title}</h1>
          <p className="text-sm text-gray-600">Peserta: {user.name} ({user.username})</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-6">
            {saveStatus === 'saving' && <span className="text-sm text-blue-600 flex items-center gap-2 transition-opacity duration-300"><i className="fas fa-spinner fa-spin"></i>Menyimpan...</span>}
            {saveStatus === 'saved' && <span className="text-sm text-white bg-blue-500 px-2 py-1 rounded-md flex items-center gap-2 transition-opacity duration-300"><i className="fas fa-check-circle"></i>Saved successfully</span>}
          </div>
          <div className="text-center">
              <p className="text-sm text-black">Sisa Waktu</p>
              <Timer initialTime={exam.durationMinutes * 60} onTimeUp={handleTimeUp} setTimeLeft={setTimeLeft} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Question Panel */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            {currentQuestion && (
              <QuestionRenderer
                question={currentQuestion}
                userAnswer={answers[currentQuestion.id]}
                onAnswerChange={handleAnswerChange}
              />
            )}
          </div>
        </main>

        {/* Navigator Panel */}
        <aside className="w-1/3 max-w-sm p-4 bg-white shadow-lg overflow-y-auto flex flex-col">
          <QuestionNavigator
            questions={exam.questions}
            answers={answers}
            currentQuestionIndex={currentQuestionIndex}
            onNavigate={goToQuestion}
          />
          <div className="mt-auto pt-4 border-t space-y-2">
            <button
              onClick={handleManualSave}
              disabled={showSaveConfirmation}
              className="w-full bg-yellow-500 text-white font-bold py-3 rounded-md hover:bg-yellow-600 transition-colors disabled:bg-green-500"
            >
              {showSaveConfirmation ? 'Progres Tersimpan!' : 'Simpan Progres'}
            </button>
            <button
              onClick={() => setIsFinishModalOpen(true)}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Selesaikan Ujian
            </button>
          </div>
        </aside>
      </div>
      
       {/* Footer Navigation */}
      <footer className="flex justify-between items-center p-4 bg-white border-t flex-shrink-0">
          <button
            onClick={() => goToQuestion(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 border rounded-md bg-white text-black hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-arrow-left mr-2"></i> Sebelumnya
          </button>
          <button
            onClick={() => goToQuestion(currentQuestionIndex + 1)}
            disabled={currentQuestionIndex === exam.questions.length - 1}
            className="px-6 py-2 border rounded-md bg-white text-black hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Berikutnya <i className="fas fa-arrow-right ml-2"></i>
          </button>
      </footer>

      {/* Finish Exam Confirmation Modal */}
      <Modal
        isOpen={isFinishModalOpen}
        onClose={() => setIsFinishModalOpen(false)}
        title="Konfirmasi Selesai Ujian"
      >
        <p className="text-black">Apakah Anda yakin ingin menyelesaikan ujian? Anda tidak akan bisa mengubah jawaban Anda setelah ini.</p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => setIsFinishModalOpen(false)}
            className="px-4 py-2 border rounded-md text-black"
          >
            Batal
          </button>
          <button
            onClick={handleFinish}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Ya, Selesaikan
          </button>
        </div>
      </Modal>

      {/* Resume Progress Modal */}
      <Modal
        isOpen={isResumeModalOpen}
        onClose={handleStartNew} // Default to starting new if closed without choice
        title="Progres Tersimpan Ditemukan"
      >
        <p className="text-black">Kami menemukan progres ujian yang belum selesai. Apakah Anda ingin melanjutkannya?</p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleStartNew}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
          >
            Mulai Baru (Hapus Progres)
          </button>
          <button
            onClick={handleResume}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Lanjutkan Ujian
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ExamScreen;