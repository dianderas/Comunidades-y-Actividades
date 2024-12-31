import { httpsCallable } from 'firebase/functions';
import { ref } from 'firebase/database';
import { database, functions } from "./config";

import {
  CreateTriviaRoomRequest,
  CreateTriviaRoomResponse,
  EndTriviaRequest,
  EndTriviaResponse,
  JoinTriviaRoomRequest,
  JoinTriviaRoomResponse,
  NextQuestionRequest,
  NextQuestionResponse,
  StartTriviaRequest,
  StartTriviaResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse
} from "./dtos";

export const getRoomRef = (roomId: string) => {
  const roomRef = ref(database, `rooms/${roomId}`)
  return roomRef;
}

export const createTriviaRoom = async (params: CreateTriviaRoomRequest) => {
  const fnCreateTriviaRoom =
    httpsCallable<CreateTriviaRoomRequest, CreateTriviaRoomResponse>(functions, 'createTriviaRoom');

  return await fnCreateTriviaRoom(params);
}

export const joinTriviaRoom = async (params: JoinTriviaRoomRequest) => {
  const fnJoinTriviaRoom =
    httpsCallable<JoinTriviaRoomRequest, JoinTriviaRoomResponse>(functions, 'joinTriviaRoom');

  return await fnJoinTriviaRoom(params);
}

export const startTrivia = async (params: StartTriviaRequest) => {
  const fnStartTrivia =
    httpsCallable<StartTriviaRequest, StartTriviaResponse>(functions, 'startTrivia');

  return await fnStartTrivia(params);
}

export const submitAnswer = async (params: SubmitAnswerRequest) => {
  const fnSubmitAnswer =
    httpsCallable<SubmitAnswerRequest, SubmitAnswerResponse>(functions, 'submitAnswer');

  return await fnSubmitAnswer(params);
}

export const nextQuestion = async (params: NextQuestionRequest) => {
  const fnNextQuestion =
    httpsCallable<NextQuestionRequest, NextQuestionResponse>(functions, 'nextQuestion');

  return await fnNextQuestion(params);
}

export const endTrivia = async (params: EndTriviaRequest) => {
  const fnEndTrivia =
    httpsCallable<EndTriviaRequest, EndTriviaResponse>(functions, 'endTrivia');

  return await fnEndTrivia(params);
}