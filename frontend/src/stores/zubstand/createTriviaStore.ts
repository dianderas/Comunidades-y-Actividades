import { create } from "zustand";

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
  addQuestion: () => void;
  removeQuestion: (questionId: string) => void;
  duplicateQuestion: (questionId: string) => void;
  setActiveQuestion: (questionId: string) => void;
  updateQuestion: (questionId: string, updatedQuestion: Partial<Question>) => void;
  addOptionToToQuestion: (questionId: string, option: QuestionOption) => void;
  removeOptionFromQuestion: (questionId: string, optionIndex: number) => void;
}

export const useCreateTriviaStore = create<CreateTriviaStore>((set) => ({
  questions: [
    {
      id: 'defaultQuizId',
      question: '',
      type: 'quiz',
      timeLimit: 20,
      points: 'standard',
      options: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
    },
  ],
  activeQuestionId: 'defaultQuizId',

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
  }
}))