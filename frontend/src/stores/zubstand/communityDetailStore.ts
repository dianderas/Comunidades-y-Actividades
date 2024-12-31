import { create } from "zustand";

export interface ComuniityMember {
  id: string;
  nickname: string;
  avatar: string;
}

export interface Season {
  id: string;
  name: string;
  status: string;
}

export interface BaseInfoActivity {
  id: string;
  name: string;
  seasonName: string;
  type: string;
}

export interface CommunityDetails {
  communityId: string;
  createdAt: string;
  description: string;
  inviteToken: string;
  settings: { privacy: string }
  members: ComuniityMember[];
  activities: BaseInfoActivity[];
  seasons: Season[];
}

interface CommunityDetailsStore {
  details: Record<string, CommunityDetails>;
  setCommunityDetails: (id: string, details: CommunityDetails) => void;
  getCommunityDetails: (id: string) => CommunityDetails | undefined;
  addSeason: (communityId: string, season: Season) => void;
  updateSeasonStatus: (communityId: string, seasonName: string, newStatus: string) => void;
  addActivity: (communityId: string, activity: BaseInfoActivity) => void;
  updateActivityName: (communityId: string, activityId: string, newName: string) => void;
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
  addSeason: (communityId, season) => {
    set((state) => {
      const communityDetails = state.details[communityId];
      if (!communityDetails) return state;

      return {
        details: {
          ...state.details,
          [communityId]: {
            ...communityDetails,
            seasons: [...communityDetails.seasons, season],
          },
        },
      };
    });
  },
  updateSeasonStatus: (communityId, seasonId, newStatus) => {
    set((state) => {
      const communityDetails = state.details[communityId];
      if (!communityDetails) return state;

      const updatedSeasons = communityDetails.seasons.map((season) =>
        season.id === seasonId ? { ...season, status: newStatus } : season
      );

      return {
        details: {
          ...state.details,
          [communityId]: {
            ...communityDetails,
            seasons: updatedSeasons,
          },
        },
      };
    });
  },
  addActivity: (communityId, activity) => {
    set((state) => {
      const communityDetails = state.details[communityId];
      if (!communityDetails) return state;

      return {
        details: {
          ...state.details,
          [communityId]: {
            ...communityDetails,
            activities: [...communityDetails.activities, activity],
          },
        },
      };
    });
  },
  updateActivityName: (communityId, activityId, newName) => {
    set((state) => {
      const communityDetails = state.details[communityId];
      if (!communityDetails) return state;

      const updatedActivities = communityDetails.activities.map((activity) =>
        activity.id === activityId ? { ...activity, name: newName } : activity
      );

      return {
        details: {
          ...state.details,
          [communityId]: {
            ...communityDetails,
            activities: updatedActivities,
          },
        },
      };
    });
  },
}));