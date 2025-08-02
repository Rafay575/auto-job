import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Job } from '../types';

export type ApplyType = 'AI' | 'Smart' | 'Manual';

export interface CartItem {
  job: Job;
  applyType: ApplyType;
  userId: string; // user id as string (can be number if needed)
}

interface CartState {
  items: CartItem[];
  userId: string | null;
}

const getUserId = () => localStorage.getItem('currentUserId') || null;

const loadUserCart = (userId: string | null): CartItem[] => {
  const stored = localStorage.getItem('jobCart');
  if (!stored) return [];
  const allItems: CartItem[] = JSON.parse(stored);
  return allItems.filter(item => item.userId === userId);
};

const initialUserId = getUserId();

const initialState: CartState = {
  items: loadUserCart(initialUserId),
  userId: initialUserId,
};

const saveUserCart = (userId: string | null, items: CartItem[]) => {
  if (!userId) return;
  const stored = localStorage.getItem('jobCart');
  let allItems: CartItem[] = stored ? JSON.parse(stored) : [];
  // Remove this user's items
  allItems = allItems.filter(item => item.userId !== userId);
  // Add back this user's updated cart
  allItems = [...allItems, ...items];
  localStorage.setItem('jobCart', JSON.stringify(allItems));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
      state.items = loadUserCart(action.payload);
    },
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'userId'>>) => {
      if (!state.userId) return;
      const exists = state.items.find(item => item.job.id === action.payload.job.id);
      if (!exists) {
        const newItem: CartItem = { ...action.payload, userId: state.userId };
        state.items.push(newItem);
        saveUserCart(state.userId, state.items);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      if (!state.userId) return;
      state.items = state.items.filter(item => item.job.id !== action.payload);
      saveUserCart(state.userId, state.items);
    },
    clearCart: (state) => {
      if (!state.userId) return;
      state.items = [];
      saveUserCart(state.userId, []);
    },
    loadCartFromStorage: (state) => {
      state.items = loadUserCart(state.userId);
    },
  },
});

export const {
  setUserId,
  addToCart,
  removeFromCart,
  clearCart,
  loadCartFromStorage,
} = cartSlice.actions;

export default cartSlice.reducer;
