import { httpsCallable } from 'firebase/functions';
import { functions } from "./config";
import { CreateOrUpdateRequest, CreateOrUpdateResponse, GetFullTriviaRequest, GetFullTriviaResponse } from "./dtos/activity";

export const createOrUpdateActivity = async (params: CreateOrUpdateRequest) => {
  const fnCreateOrUpdateActivity =
    httpsCallable<CreateOrUpdateRequest, CreateOrUpdateResponse>(functions, 'createOrUpdateActivity');

  return await fnCreateOrUpdateActivity(params);
}

export const getFullTrivia = async (params: GetFullTriviaRequest) => {
  const fnGetFullTriviay =
    httpsCallable<GetFullTriviaRequest, GetFullTriviaResponse>(functions, 'getFullTrivia');

  return await fnGetFullTriviay(params);
}