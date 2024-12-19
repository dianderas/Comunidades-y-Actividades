import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { create } from 'zustand';
import { app } from '../../services/firebase/config';
import { useCommunityStore } from './communityStore';

interface AuthState {
  user: User | null;
  isCheckingAuth: boolean;
  initAuthListener: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isCheckingAuth: true,

  initAuthListener: () => {
    const auth = getAuth(app);
    const resetCommunityStore = useCommunityStore.getState().resetCommunityStore;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        resetCommunityStore(); // Limpia Zustand cuando el usuario no existe
      }
      set({ user, isCheckingAuth: false });
    });

    return unsubscribe;
  },
}));