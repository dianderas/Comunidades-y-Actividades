import { create } from "zustand";

export interface Community {
  id: string;
  name: string;
}

interface ComminityStore {
  communities: Community[];
  selectedCommunityId: string | null;
  setCommunities: (communities: Community[]) => void;
  addCommunity: (community: Community) => void;
  selectCommunity: (communityId: string) => void;
  resetCommunityStore: () => void;
  getCommunity: (id: string) => Community | undefined;
}

export const useCommunityStore = create<ComminityStore>((set, get) => ({
  communities: [],
  selectedCommunityId: null,

  setCommunities: (communities) => set({ communities }),

  addCommunity: (community) => {
    return set((state) => ({
      communities: [...state.communities, community],
      selectedCommunityId: community.id
    }))
  },

  selectCommunity: (communityId) =>
    set(() => ({ selectedCommunityId: communityId })),

  resetCommunityStore: () => set({ communities: [], selectedCommunityId: null }),
  getCommunity: (id: string) => {
    const state = get();
    const community = state.communities.find(c => c.id === id);
    return community;
  },
}));