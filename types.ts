// This file defines the core data structures and types used throughout the application.

/**
 * Represents a generic user, for both students and admins.
 */
export interface User {
  username: string;
  name: string;
}

/**
 * Represents a student with login credentials.
 */
export interface Student {
  id: string;
  name: string;
  username: string;
  password?: string;
}

/**
 * Enum for the different types of questions available in an exam.
 */
export enum QuestionType {
  SINGLE_CHOICE = 'Single Choice',
  MULTIPLE_CHOICE = 'Multiple Choice',
  MATCHING = 'Matching',
  SHORT_ANSWER = 'Short Answer',
}

/**
 * Base interface for all question types.
 */
interface BaseQuestion {
  id: string;
  type: QuestionType;
  questionText: string;
  stimulus?: string;
}

/**
 * Represents a single choice option in a multiple-choice or single-choice question.
 */
interface Option {
  id: string;
  text: string;
}

/**
 * Represents a single-choice question.
 */
export interface SingleChoiceQuestion extends BaseQuestion {
  type: QuestionType.SINGLE_CHOICE;
  options: Option[];
}

/**
 * Represents a multiple-choice question where more than one answer can be correct.
 */
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: QuestionType.MULTIPLE_CHOICE;
  options: Option[];
}

/**
 * Represents an item in a matching question (either a prompt or a match).
 */
interface MatchItem {
  id: string;
  text: string;
}

/**
 * Represents a matching question where prompts must be matched with correct answers.
 */
export interface MatchingQuestion extends BaseQuestion {
  type: QuestionType.MATCHING;
  prompts: MatchItem[];
  matches: MatchItem[];
}

/**
 * Represents a short-answer question requiring a text-based answer.
 */
export interface ShortAnswerQuestion extends BaseQuestion {
  type: QuestionType.SHORT_ANSWER;
}

/**
 * A union type representing any possible question format.
 * NOTE: The correct answer is handled separately and not exposed to the student client.
 */
export type Question = SingleChoiceQuestion | MultipleChoiceQuestion | MatchingQuestion | ShortAnswerQuestion;

/**
 * Represents an exam, including its metadata and a list of questions.
 */
export interface Exam {
  id: string;
  title: string;
  durationMinutes: number;
  questions: Question[];
}

/**
 * A union type for a user's answer to a question.
 * Can be a string (single choice, short answer), an array of strings (multiple choice),
 * or a record (matching), or null if unanswered.
 */
export type Answer = string | string[] | Record<string, string> | null;

/**
 * A record mapping question IDs to the user's answers for an entire exam.
 */
export type UserAnswers = Record<string, Answer>;
