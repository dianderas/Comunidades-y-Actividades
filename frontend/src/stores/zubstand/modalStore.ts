import { create } from "zustand";

type Action = {
  openModal: (type: string) => void,
  closeModal: () => void,
}

type State = {
  isOpen: boolean;
  modalType: string | null;
}

export const useModalStore = create<State & Action>((set) => ({
  isOpen: false,
  modalType: null,
  openModal: (type) => set({ isOpen: true, modalType: type }),
  closeModal: () => set({ isOpen: false })
}));
