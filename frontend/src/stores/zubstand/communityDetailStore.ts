import { create } from "zustand";

export interface ComuniityMember {
  id: string;
  nickname: string;
  avatar: string;
}

export interface CommunityDetails {
  communityId: string;
  createdAt: string;
  description: string;
  inviteToken: string;
  settings: { privacy: string }
  members: ComuniityMember[];
}

interface CommunityDetailsStore {
  details: Record<string, CommunityDetails>;
  setCommunityDetails: (id: string, details: CommunityDetails) => void;
  getCommunityDetails: (id: string) => CommunityDetails | undefined;
}

export const useCommunityDetailsStore = create<CommunityDetailsStore>((set, get) => ({
  details: {},
  setCommunityDetails: (id, details) =>
    set((state) => ({
      details: { ...state.details, [id]: details },
    })),
  getCommunityDetails: (id) => {
    const state = get();
    return state.details[id];
  },
}));