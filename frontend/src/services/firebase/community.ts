import { collection, documentId, getDocs, query, where } from "firebase/firestore";
import { httpsCallable } from 'firebase/functions';
import { Community } from "../../stores/zubstand";
import { db, functions } from "./config";

interface ComuniityMember {
  id: string;
  nickname: string;
  avatar: string;
  email: string;
  createdAt: string;
}

interface CommunityDetailsResponse {
  communityId: string;
  createdAt: string;
  description: string;
  settings: { privacy: string }
  inviteToken: string;
  members: ComuniityMember[];
}

interface CommunityDetailsRequest {
  communityId: string;
}

interface CommunitytoInviteRequest {
  token: string;
}

export interface CommunitytoInviteResponse {
  id: string;
  name: string;
  avatar: string;
}

interface CreateCommunityRequest {
  name: string;
  avatar: string;
  ownerId?: string;
}

interface addMemberRequest {
  communityId: string;
  userId: string;
}

interface addMemberResponse {
  success: boolean;
  message: string;
}

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

export const addMemberToCommunity = async ({ communityId, userId }: addMemberRequest) => {
  const fnAddMemberToCommunity =
    httpsCallable<addMemberRequest, addMemberResponse>(functions, 'addMemberToCommunity');

  return await fnAddMemberToCommunity({ communityId, userId })
}