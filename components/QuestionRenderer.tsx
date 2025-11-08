import React from 'react';
// Fix: Import QuestionType as a value and other types for type checking.
import { QuestionType } from '../types';
import type { SingleChoiceQuestion, MultipleChoiceQuestion, MatchingQuestion, ShortAnswerQuestion, Question, Answer } from '../types';

interface QuestionRendererProps {
  question: Question;
  userAnswer: Answer;
  onAnswerChange: (questionId: string, answer: Answer) => void;
}

const Stimulus: React.FC<{ text?: string }> = ({ text }) => {
  if (!text) return null;
  return (
    <div className="mb-6 p-4 border-l-4 border-blue-500 bg-blue-50 text-black rounded-r-lg whitespace-pre-wrap">
      {text}
    </div>
  );
};

const QuestionText: React.FC<{ text: string; number: number }> = ({ text, number }) => (
  <div className="flex items-start mb-6">
    <span className="text-xl font-bold text-blue-600 mr-3">{number}.</span>
    <p className="text-xl text-black flex-1">{text}</p>
  </div>
);

const renderSingleChoice = (question: SingleChoiceQuestion, userAnswer: Answer, onAnswerChange: Function) => (
  <div className="space-y-3">
    {question.options.map((option, index) => (
      <label key={option.id} className="flex items-center p-4 border border-blue-300 rounded-lg cursor-pointer transition-colors hover:bg-blue-50 focus-within:ring-2 focus-within:ring-blue-500">
        <input
          type="radio"
          name={question.id}
          value={option.id}
          checked={userAnswer === option.id}
          onChange={() => onAnswerChange(question.id, option.id)}
          className="h-5 w-5 text-blue-600 border-blue-300 focus:ring-blue-500"
        />
        <span className="ml-4 text-lg text-black">{String.fromCharCode(65 + index)}. {option.text}</span>
      </label>
    ))}
  </div>
);

const renderMultipleChoice = (question: MultipleChoiceQuestion, userAnswer: Answer, onAnswerChange: Function) => {
    const currentAnswers = (userAnswer as string[] | null) || [];
    const handleChange = (optionId: string) => {
        const newAnswers = currentAnswers.includes(optionId)
            ? currentAnswers.filter(id => id !== optionId)
            : [...currentAnswers, optionId];
        onAnswerChange(question.id, newAnswers.length > 0 ? newAnswers : null);
    };

    return (
        <div className="space-y-3">
        {question.options.map((option, index) => (
            <label key={option.id} className="flex items-center p-4 border border-blue-300 rounded-lg cursor-pointer transition-colors hover:bg-blue-50 focus-within:ring-2 focus-within:ring-blue-500">
                <input
                    type="checkbox"
                    value={option.id}
                    checked={currentAnswers.includes(option.id)}
                    onChange={() => handleChange(option.id)}
                    className="h-5 w-5 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                />
                <span className="ml-4 text-lg text-black">{String.fromCharCode(65 + index)}. {option.text}</span>
            </label>
        ))}
        </div>
    );
};

const renderMatching = (question: MatchingQuestion, userAnswer: Answer, onAnswerChange: Function) => {
    const currentAnswers = (userAnswer as Record<string, string> | null) || {};
    const handleMatchChange = (promptId: string, matchId: string) => {
        const newAnswers = { ...currentAnswers, [promptId]: matchId };
        onAnswerChange(question.id, newAnswers);
    };

    // Shuffle matches for the dropdown options to prevent order bias
    const shuffledMatches = React.useMemo(() => [...question.matches].sort(() => Math.random() - 0.5), [question.matches]);

    return (
        <div className="space-y-4 border border-blue-200 rounded-lg p-4 bg-blue-50/50">
            {question.prompts.map((prompt, index) => (
                <div key={prompt.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center border-b border-blue-100 pb-4 last:border-b-0 last:pb-0">
                    {/* Prompt Text */}
                    <div className="flex items-center">
                        <span className="font-semibold text-black mr-2">{index + 1}.</span>
                        <p className="text-lg text-black flex-1">{prompt.text}</p>
                    </div>

                    {/* Dropdown for Matches */}
                    <div>
                        <select
                            value={currentAnswers[prompt.id] || ''}
                            onChange={(e) => handleMatchChange(prompt.id, e.target.value)}
                            className="w-full p-3 bg-white border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
                            aria-label={`Jawaban untuk ${prompt.text}`}
                        >
                            <option value="" disabled>-- Jodohkan --</option>
                            {shuffledMatches.map((match) => (
                                <option key={match.id} value={match.id}>
                                    {match.text}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
        </div>
    );
};

const renderShortAnswer = (question: ShortAnswerQuestion, userAnswer: Answer, onAnswerChange: Function) => (
  <div>
    <input
      type="text"
      value={(userAnswer as string) || ''}
      onChange={(e) => onAnswerChange(question.id, e.target.value)}
      className="w-full px-4 py-3 text-lg bg-white border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
      placeholder="Ketik jawabanmu di sini..."
    />
  </div>
);

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, userAnswer, onAnswerChange }) => {
  return (
    <div>
      <Stimulus text={question.stimulus} />
      <QuestionText text={question.questionText} number={parseInt(question.id.replace('Q', ''))} />
      
      <div className="mt-4">
        {question.type === QuestionType.SINGLE_CHOICE && renderSingleChoice(question as SingleChoiceQuestion, userAnswer, onAnswerChange)}
        {question.type === QuestionType.MULTIPLE_CHOICE && renderMultipleChoice(question as MultipleChoiceQuestion, userAnswer, onAnswerChange)}
        {question.type === QuestionType.MATCHING && renderMatching(question as MatchingQuestion, userAnswer, onAnswerChange)}
        {question.type === QuestionType.SHORT_ANSWER && renderShortAnswer(question as ShortAnswerQuestion, userAnswer, onAnswerChange)}
      </div>
    </div>
  );
};

export default QuestionRenderer;