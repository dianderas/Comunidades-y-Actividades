export interface CreateTriviaRoomRequest {
  communityId: string;
  triviaId: string;
}

export interface CreateTriviaRoomResponse {
  roomId: string;
}

export interface JoinTriviaRoomRequest {
  roomId: string;
  nickname: string;
}

export interface JoinTriviaRoomResponse {
  message: string;
}

export interface StartTriviaRequest {
  roomId: string;
}

export interface StartTriviaResponse {
  message: string;
}

export interface SubmitAnswerRequest {
  roomId: string;
  questionId: string;
  answer: string;
}
export interface SubmitAnswerResponse {
  message: string;
}

export interface NextQuestionRequest {
  roomId: string;
}

export interface NextQuestionResponse {
  message: string;
}

export interface EndTriviaRequest {
  roomId: string;
}

export interface EndTriviaResponse {
  message: string;
}

