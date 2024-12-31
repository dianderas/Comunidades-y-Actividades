interface QuestionOption {
  value: string;
  isCorrect?: boolean;
}

interface TriviaRequest {
  id: string;
  question: string;
  type: 'quiz' | 'boolean' | 'typetext'
  timeLimit: number;
  points: 'standard' | 'double';
  options: QuestionOption[];
}

interface BetRequest {
  name: string;
}

type ActivityMetadata = TriviaRequest | BetRequest;

export interface CreateOrUpdateRequest {
  activityId?: string;
  name: string;
  communityId: string;
  details: ActivityMetadata
  seasonId?: string;
  type: string;
}

export interface CreateOrUpdateResponse {
  activityId: string;
  name: string;
  type: string;
  seasonName: string;
  action: 'updated' | 'created';
}

export interface GetFullTriviaRequest {
  activityId: string;
  communityId: string;
}

export interface GetFullTriviaResponse {
  activity: {
    id: string;
    communityId: string;
    details: string;
    name: string;
    seasonId?: string;
    status: string;
    type: string;
    createdAt: string;
  }
  details: {
    id: string;
    questions: {
      id: string;
      options: {
        isCorrect: boolean;
        value: string;
      }[];
      points: string;
      question: string;
      timeLimit: number;
      type: string;
      createdAt: string;
    }[];
  }
}
