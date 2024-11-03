import api from '@/lib/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { jwtDecode } from "jwt-decode";

interface RegisterData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface JWTPayload {
  email: string;
  exp: number;
}

interface AuthState {
  loading: boolean;
  error: string | null;
  success: boolean;
  token: string | null;
  isAuthenticated: boolean;
  userEmail: string | null;
}


const storedToken = (() => {
  const token = getCookie('auth_token')?.toString();
  
  if (token) {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = new Date().getTime() / 1000;

      if (!decoded.email || !decoded.exp || currentTime >= decoded.exp) {
        deleteCookie('auth_token');
        return null;
      }

      return token;
    } catch (error) {
      console.error('Invalid token:', error);
      deleteCookie('auth_token');
    }
  }
  return null;
})();

const initialState: AuthState = {
  loading: false,
  error: null,
  success: false,
  token: storedToken,
  isAuthenticated: !!storedToken,
  userEmail: null,
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await api.post('/registration', data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
      }
      return rejectWithValue('Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const expirationTime = Math.floor(Date.now() / 1000) + (12 * 60 * 60);
      
      const loginPayload = {
        email: data.email,
        password: data.password,
        exp: expirationTime
      };

      const response = await api.post('/login', loginPayload);
      
      const token = response.data.data.token;
      const decoded = jwtDecode<JWTPayload>(token);
      
      if (!decoded.email || !decoded.exp) {
        throw new Error('Invalid token structure');
      }
      
      const expiryDate = new Date(decoded.exp * 1000);
      setCookie('auth_token', token, {
        expires: expiryDate,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      });
      
      return {
        ...response.data,
        email: decoded.email,
        exp: decoded.exp
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Login failed');
      }
      return rejectWithValue('Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.userEmail = null;
      deleteCookie('auth_token');
    },
    checkTokenExpiry: (state) => {
      const token = getCookie('auth_token')?.toString();
      
      if (token) {
        try {
          const decoded = jwtDecode<JWTPayload>(token);
          const currentTime = new Date().getTime() / 1000;
          
          if (currentTime >= decoded.exp) {
            state.token = null;
            state.isAuthenticated = false;
            state.userEmail = null;
            deleteCookie('auth_token');
          }
        } catch (error) {
          console.error(error)
          state.token = null;
          state.isAuthenticated = false;
          state.userEmail = null;
          deleteCookie('auth_token');
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        state.userEmail = action.payload.email;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export const { resetAuth, logout, checkTokenExpiry } = authSlice.actions;
export default authSlice.reducer;