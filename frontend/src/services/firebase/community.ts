import { collection, documentId, getDocs, query, where } from "firebase/firestore";
import { httpsCallable } from 'firebase/functions';
import { Community } from "../../stores/zubstand";
import { db, functions } from "./config";
import {
  AddMemberRequest, AddMemberResponse, CommunityDetailsRequest, CommunityDetailsResponse,
  CommunitytoInviteRequest, CommunitytoInviteResponse, CreateCommunityRequest, CreateSeasonRequest,
  CreateSeasonResponse,
  ToggleSeasonStatusRequest,
  ToggleSeasonStatusResponse
} from "./dtos";


export const createCommunity = async ({
  name,
  avatar,
  ownerId,
}: CreateCommunityRequest) => {
  if (!ownerId) {
    throw new Error("User not authenticated");
  }

  const fnCreateCommunity = httpsCallable<CreateCommunityRequest, { communityId: string }>(functions, "createCommunity");

  return await fnCreateCommunity({
    name,
    avatar: avatar || '',
  });
};

export const getUserCommunities = async (userId: string): Promise<Community[]> => {
  const q = query(
    collection(db, "community_members"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);
  const communityIds = snapshot.docs.map((doc) => doc.data().communityId);

  if (communityIds.length === 0) {
    return [];
  }

  const communityQuery = query(
    collection(db, "communities"),
    where(documentId(), "in", communityIds)
  );

  const communitySnapshot = await getDocs(communityQuery);
  return communitySnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    avatar: doc.data().avatar,
  }));
};

export const getCommunityDetails = async (communityId: string) => {

  const fnGetCommunityDetails =
    httpsCallable<CommunityDetailsRequest, CommunityDetailsResponse>(functions, "getCommunityDetails");

  return await fnGetCommunityDetails({ communityId });

};

export const getCommunityByInviteToken = async (token: string) => {
  const fnFetchCommunityByInviteToken =
    httpsCallable<CommunitytoInviteRequest, CommunitytoInviteResponse>(functions, "getCommunityByInviteToken");

  return await fnFetchCommunityByInviteToken({ token });
}

export const addMemberToCommunity = async ({ communityId, userId }: AddMemberRequest) => {
  const fnAddMemberToCommunity =
    httpsCallable<AddMemberRequest, AddMemberResponse>(functions, 'addMemberToCommunity');

  return await fnAddMemberToCommunity({ communityId, userId });
}

export const createSeason = async ({ communityId, name }: CreateSeasonRequest) => {
  const fnCreateSeason =
    httpsCallable<CreateSeasonRequest, CreateSeasonResponse>(functions, 'createSeason');

  return await fnCreateSeason({ communityId, name });
}

export const toggleSeasonStatus = async ({ communityId, seasonId }: ToggleSeasonStatusRequest) => {
  const fnToggleSeasonStatus =
    httpsCallable<ToggleSeasonStatusRequest, ToggleSeasonStatusResponse>(functions, 'toggleSeasonStatus');

  return await fnToggleSeasonStatus({ communityId, seasonId });
}