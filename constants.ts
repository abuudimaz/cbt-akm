import { Exam, QuestionType } from './types';

/**
 * Mock data for the exam. In a real application, this would be fetched from a server.
 * This data is used to populate the exam screen for students.
 */
export const EXAM_DATA: Exam = {
  id: 'EXAM01',
  title: 'Ujian Akhir Semester - Ilmu Pengetahuan Umum',
  durationMinutes: 60,
  questions: [
    {
      id: 'Q1',
      type: QuestionType.SINGLE_CHOICE,
      questionText: 'Siapakah presiden pertama Republik Indonesia?',
      options: [
        { id: 'Q1A1', text: 'B.J. Habibie' },
        { id: 'Q1A2', text: 'Soekarno' },
        { id: 'Q1A3', text: 'Soeharto' },
        { id: 'Q1A4', text: 'Joko Widodo' },
      ],
    },
    {
      id: 'Q2',
      type: QuestionType.MULTIPLE_CHOICE,
      questionText: 'Pilih dua negara yang terletak di benua Amerika Selatan.',
      stimulus: 'Benua Amerika Selatan memiliki banyak negara dengan budaya yang beragam.',
      options: [
        { id: 'Q2A1', text: 'Brazil' },
        { id: 'Q2A2', text: 'Meksiko' },
        { id: 'Q2A3', text: 'Argentina' },
        { id: 'Q2A4', text: 'Kanada' },
      ],
    },
    {
      id: 'Q3',
      type: QuestionType.MATCHING,
      questionText: 'Jodohkan nama pahlawan dengan julukannya.',
      prompts: [
        { id: 'Q3P1', text: 'Ki Hajar Dewantara' },
        { id: 'Q3P2', text: 'R.A. Kartini' },
        { id: 'Q3P3', text: 'Soekarno' },
        { id: 'Q3P4', text: 'Mohammad Hatta' },
      ],
      matches: [
        { id: 'Q3M1', text: 'Proklamator Kemerdekaan' },
        { id: 'Q3M2', text: 'Bapak Koperasi Indonesia' },
        { id: 'Q3M3', text: 'Bapak Pendidikan Nasional' },
        { id: 'Q3M4', text: 'Pahlawan Emansipasi Wanita' },
      ]
    },
    {
      id: 'Q4',
      type: QuestionType.SHORT_ANSWER,
      questionText: 'Apa nama ibu kota negara Indonesia?',
    },
    {
      id: 'Q5',
      type: QuestionType.SINGLE_CHOICE,
      questionText: 'Planet manakah yang dikenal sebagai "Planet Merah"?',
      options: [
        { id: 'Q5A1', text: 'Venus' },
        { id: 'Q5A2', text: 'Mars' },
        { id: 'Q5A3', text: 'Jupiter' },
        { id: 'Q5A4', text: 'Saturnus' },
      ],
    },
    {
        id: 'Q6',
        type: QuestionType.SHORT_ANSWER,
        questionText: "Singkatan dari 'Central Processing Unit' adalah...",
    },
    {
        id: 'Q7',
        type: QuestionType.MULTIPLE_CHOICE,
        questionText: 'Pilih dua samudra yang memiliki wilayah terluas di dunia.',
        options: [
            { id: 'Q7A1', text: 'Samudra Hindia' },
            { id: 'Q7A2', text: 'Samudra Pasifik' },
            { id: 'Q7A3', text: 'Samudra Arktik' },
            { id: 'Q7A4', text: 'Samudra Atlantik' },
        ]
    }
  ],
};
