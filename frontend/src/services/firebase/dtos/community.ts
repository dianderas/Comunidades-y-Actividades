interface ComuniityMember {
  id: string;
  nickname: string;
  avatar: string;
  email: string;
  createdAt: string;
}

export interface Season {
  id: string;
  name: string;
  status: string;
}

interface BaseInfoActivity {
  id: string;
  name: string;
  seasonName: string;
  type: string;
}

export interface CommunityDetailsResponse {
  communityId: string;
  createdAt: string;
  description: string;
  settings: { privacy: string }
  inviteToken: string;
  members: ComuniityMember[];
  activities: BaseInfoActivity[];
  seasons: Season[];
}

export interface CommunityDetailsRequest {
  communityId: string;
}

export interface CommunitytoInviteRequest {
  token: string;
}

export interface CommunitytoInviteResponse {
  id: string;
  name: string;
  avatar: string;
}

export interface CreateCommunityRequest {
  name: string;
  avatar: string;
  ownerId?: string;
}

export interface AddMemberRequest {
  communityId: string;
  userId: string;
}

export interface AddMemberResponse {
  success: boolean;
  message: string;
}

export interface CreateSeasonRequest {
  name: string;
  communityId: string;
}

export interface CreateSeasonResponse {
  seasonId: string;
  status: string;
}

export interface ToggleSeasonStatusRequest {
  seasonId: string;
  communityId: string;
}

export interface ToggleSeasonStatusResponse {
  seasonId: string;
  newStatus: string;
}
