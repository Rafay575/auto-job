import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Job } from '../data/dummy_jobs';

export type ApplyType = 'AI' | 'Smart' | 'Manual';

interface CartItem {
  job: Job;
  applyType: ApplyType;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem('jobCart') || '[]'),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const exists = state.items.find(item => item.job.id === action.payload.job.id);
      if (!exists) {
        state.items.push(action.payload);
        localStorage.setItem('jobCart', JSON.stringify(state.items));
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.job.id !== action.payload);
      localStorage.setItem('jobCart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('jobCart');
    },
    loadCartFromStorage: (state) => {
      const stored = localStorage.getItem('jobCart');
      if (stored) {
        state.items = JSON.parse(stored);
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  loadCartFromStorage,
} = cartSlice.actions;

export default cartSlice.reducer;
