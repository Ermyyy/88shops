"use client";

import { create } from "zustand";

type UiState = {
  mobileMenuOpen: boolean;
  filterDrawerOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setFilterDrawerOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  mobileMenuOpen: false,
  filterDrawerOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setFilterDrawerOpen: (open) => set({ filterDrawerOpen: open }),
}));
