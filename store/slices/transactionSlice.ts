import api from '@/lib/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


interface Transaction {
  invoice_number: string;
  transaction_type: 'TOPUP' | 'PAYMENT';
  description: string;
  total_amount: number;
  created_on: string;
}

interface TransactionState {
  balance: number | null;
  loading: boolean;
  error: string | null;
  topUpSuccess: boolean;
  transactions: Transaction[];
  hasMore: boolean;
  showBalance: boolean;
  paymentSuccess: boolean;
}

const initialState: TransactionState = {
  balance: null,
  loading: false,
  error: null,
  topUpSuccess: false,
  transactions: [],
  hasMore: true,
  showBalance: false,
  paymentSuccess: false,
};

export const fetchBalance = createAsyncThunk(
  'transaction/fetchBalance',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string } };
      const response = await api.get('/balance', {
        headers: {
          Authorization: `Bearer ${state.auth.token}`
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch balance');
      }
      return rejectWithValue('Failed to fetch balance');
    }
  }
);

export const fetchTransactionHistory = createAsyncThunk(
  'transaction/fetchHistory',
  async ({ offset, limit }: { offset: number; limit: number }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string } };
      const response = await api.get(`/transaction/history?offset=${offset}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`
        }
      });
      return {
        records: response.data.data.records,
        offset
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch transaction history');
      }
      return rejectWithValue('Failed to fetch transaction history');
    }
  }
);

export const topUpBalance = createAsyncThunk(
  'transaction/topUp',
  async (amount: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string } };
      const response = await api.post('/topup',
        { top_up_amount: amount },
        {
          headers: {
            Authorization: `Bearer ${state.auth.token}`
          }
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Top up failed');
      }
      return rejectWithValue('Top up failed');
    }
  }
);

export const payService = createAsyncThunk(
  'transaction/payService',
  async (serviceCode: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string } };
      const response = await api.post('/transaction',
        { service_code: serviceCode },
        {
          headers: {
            Authorization: `Bearer ${state.auth.token}`
          }
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Payment failed');
      }
      return rejectWithValue('Payment failed');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    resetTopUpStatus: (state) => {
      state.topUpSuccess = false;
      state.error = null;
    },
    resetTransactions: (state) => {
      state.transactions = [];
      state.hasMore = true;
    },
    resetPaymentStatus: (state) => {
      state.paymentSuccess = false;
      state.error = null;
    },
    toggleBalance: (state) => {
      state.showBalance = !state.showBalance;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.data.balance;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTransactionHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
        state.loading = false;
        const { records, offset } = action.payload;
        
        // If offset is 0, replace the entire array
        if (offset === 0) {
          state.transactions = records;
        } else {
          // Otherwise, append new items
          state.transactions = [...state.transactions, ...records];
        }
        
        state.hasMore = records.length === 5;
      })
      .addCase(fetchTransactionHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(topUpBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.topUpSuccess = false;
      })
      .addCase(topUpBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.data.balance;
        state.topUpSuccess = true;
      })
      .addCase(topUpBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.topUpSuccess = false;
      })
      .addCase(payService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentSuccess = false;
      })
      .addCase(payService.fulfilled, (state) => {
        state.loading = false;
        state.paymentSuccess = true;
      })
      .addCase(payService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.paymentSuccess = false;
      });
  },
});

export const { resetTopUpStatus, resetTransactions, resetPaymentStatus, toggleBalance } = transactionSlice.actions;
export default transactionSlice.reducer;