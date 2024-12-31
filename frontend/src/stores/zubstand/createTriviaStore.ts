import { create } from "zustand";
import { GetFullTriviaResponse } from "../../services/firebase/dtos/activity";

interface QuestionOption {
  value: string;
  isCorrect?: boolean;
}

interface Question {
  id: string;
  question: string;
  type: 'quiz' | 'boolean' | 'typetext'
  timeLimit: number;
  points: 'standard' | 'double';
  options: QuestionOption[];
}

interface CreateTriviaStore {
  questions: Question[];
  activeQuestionId: string | null;
  setTrivia: (triviaData: GetFullTriviaResponse) => void;
  addQuestion: () => void;
  removeQuestion: (questionId: string) => void;
  duplicateQuestion: (questionId: string) => void;
  setActiveQuestion: (questionId: string) => void;
  updateQuestion: (questionId: string, updatedQuestion: Partial<Question>) => void;
  addOptionToToQuestion: (questionId: string, option: QuestionOption) => void;
  removeOptionFromQuestion: (questionId: string, optionIndex: number) => void;
  resetStore: () => void;
}

const defaultQuestions: Question[] = [
  {
    id: 'defaultQuizId',
    question: '',
    type: 'quiz',
    timeLimit: 20,
    points: 'standard',
    options: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
  },
];

const defaultFirstQuestionId = 'firstDefaultQuizId';

export const useCreateTriviaStore = create<CreateTriviaStore>((set) => ({
  questions: defaultQuestions,
  activeQuestionId: defaultFirstQuestionId,

  setTrivia: (triviaData) => {
    const formattedQuestions = triviaData.details.questions.map((question) => ({
      id: question.id,
      question: question.question,
      type: question.type,
      timeLimit: question.timeLimit,
      points: question.points,
      options: question.options,
      createdAt: question.createdAt,
    }));

    set(() => ({
      questions: formattedQuestions as Question[],
      activeQuestionId: formattedQuestions.length > 0 ? formattedQuestions[0].id : null,
    }));
  },

  addQuestion: () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: '',
      type: 'quiz',
      timeLimit: 20,
      points: 'standard',
      options: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }]
    }
    set((state) => ({ questions: [...state.questions, newQuestion], activeQuestionId: newQuestion.id }))
  },
  removeQuestion: (questionId) => {
    set((state) => {
      const updatedQuestions = state.questions.filter((question) => question.id !== questionId);

      const newActiveQuestionId =
        state.activeQuestionId === questionId
          ? updatedQuestions[0]?.id ?? null
          : state.activeQuestionId;

      return {
        questions: [...updatedQuestions],
        activeQuestionId: newActiveQuestionId,
      };
    });
  },
  duplicateQuestion: (questionId) => {
    set((state) => {
      const questionToDuplicate = state.questions.find((question) => question.id === questionId);
      if (!questionToDuplicate) return state;

      const duplicatedQuestion: Question = {
        ...questionToDuplicate,
        id: Date.now().toString(),
      };

      return {
        questions: [...state.questions, duplicatedQuestion],
        activeQuestionId: duplicatedQuestion.id,
      };
    });
  },
  setActiveQuestion: (questionId) => {
    set(() => ({ activeQuestionId: questionId }));
  },
  updateQuestion: (questionId, updatedQuestion) => {
    set((state) => ({
      questions: state.questions.map((question) =>
        question.id === questionId ? { ...question, ...updatedQuestion } : question)
    }))
  },
  addOptionToToQuestion: (questionId, option) => {
    set((state) => ({
      questions: state.questions.map((question) =>
        question.id === questionId ? { ...question, options: [...question.options, option] } : question
      )
    }))
  },
  removeOptionFromQuestion: (questionId, optionIndex) => {
    set((state) => ({
      questions: state.questions.map((question) =>
        question.id === questionId
          ? { ...question, options: question.options.filter((_, index) => index !== optionIndex) }
          : question)
    }))
  },
  resetStore: () => set({
    questions: defaultQuestions,
    activeQuestionId: defaultFirstQuestionId,
  })
}))