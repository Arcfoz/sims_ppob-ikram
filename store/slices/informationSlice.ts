import api from '@/lib/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Banner {
  banner_name: string;
  banner_image: string;
  description: string;
}

interface Service {
  service_code: string;
  service_name: string;
  service_icon: string;
  service_tariff: number;
}

interface InformationState {
  banners: Banner[];
  services: Service[];
  loading: boolean;
  error: string | null;
}

const initialState: InformationState = {
  banners: [],
  services: [],
  loading: false,
  error: null,
};

export const fetchBanners = createAsyncThunk(
  'information/fetchBanners',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string } };
      const response = await api.get('/banner', {
        headers: {
          Authorization: `Bearer ${state.auth.token}`
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch banners');
      }
      return rejectWithValue('Failed to fetch banners');
    }
  }
);

export const fetchServices = createAsyncThunk(
  'information/fetchServices',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string } };
      const response = await api.get('/services', {
        headers: {
          Authorization: `Bearer ${state.auth.token}`
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
      }
      return rejectWithValue('Failed to fetch services');
    }
  }
);

const informationSlice = createSlice({
  name: 'information',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload.data;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload.data;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default informationSlice.reducer;