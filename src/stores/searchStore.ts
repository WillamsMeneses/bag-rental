// stores/searchStore.ts
import { create } from 'zustand';
import { ClubCategory } from '@/types/listing.types';

interface SearchState {
  cities: string[];
  gearCategories: (ClubCategory | null)[];
  appliedCities: string[];
  appliedGearCategories: (ClubCategory | null)[];
  toggleCity: (city: string) => void;
  toggleGearCategory: (category: ClubCategory | null) => void;
  applySearch: () => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  cities: [],
  gearCategories: [],
  appliedCities: [],
  appliedGearCategories: [],

  toggleCity: (city) => {
    const { cities } = get();
    set({
      cities: cities.includes(city)
        ? cities.filter((c) => c !== city)
        : [...cities, city],
    });
  },

  toggleGearCategory: (category) => {
    const { gearCategories } = get();
    const exists = gearCategories.includes(category);
    set({
      gearCategories: exists
        ? gearCategories.filter((c) => c !== category)
        : [...gearCategories, category],
    });
  },

  applySearch: () => {
    const { cities, gearCategories } = get();
    set({ appliedCities: cities, appliedGearCategories: gearCategories });
  },

  clearSearch: () =>
    set({
      cities: [],
      gearCategories: [],
      appliedCities: [],
      appliedGearCategories: [],
    }),
}));