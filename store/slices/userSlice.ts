import api from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ProfileData {
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
}

interface UserState {
  loading: boolean;
  error: string | null;
  success: boolean;
  profile: ProfileData | null;
  updateSuccess: boolean;
}

const initialState: UserState = {
  loading: false,
  error: null,
  success: false,
  profile: null,
  updateSuccess: false,
};

export const fetchProfile = createAsyncThunk("auth/profile", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as { auth: { token: string } };
    const response = await api.get('/profile', {
      headers: {
        Authorization: `Bearer ${state.auth.token}`
      }
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message;
      return rejectWithValue(errorMessage || "Failed to fetch profile");
    }
    return rejectWithValue("Failed to fetch profile");
  }
});

export const updateProfile = createAsyncThunk("auth/updateProfile", async (formData: FormData, { getState, dispatch, rejectWithValue }) => {
  try {
    const state = getState() as { auth: { token: string } };
    const headers = {
      Authorization: `Bearer ${state.auth.token}`,
    };

    const profileData = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
    };

    await await api.put("/profile/update", profileData, { headers });

    const file = formData.get("file");
    if (file) {
      const imageFormData = new FormData();
      imageFormData.append("file", file);
      
      await api.put("/profile/image", imageFormData, { headers })

    }

    await dispatch(fetchProfile());

    return { message: "Profile updated successfully" };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || "Profile update failed");
    }
    return rejectWithValue("Profile update failed");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.updateSuccess = false;
    },
    resetUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Profile fetch cases
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Profile update cases
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loading = false;
        state.updateSuccess = true;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.updateSuccess = false;
      });
  },
});


export const { resetUser, resetUpdateSuccess } = userSlice.actions;
export default userSlice.reducer;