import { getUserNotifications } from "@/services/userService";
import { Notification } from "@/types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const userId = localStorage.getItem("userId");
interface UserState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

export const fetchUserNotifications = createAsyncThunk(
  "user/fetchUserNotifications",
  async (_, { rejectWithValue }) => {
    const payload = {
      userId: userId,
    };
    try {
      const response = await getUserNotifications(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Failed to fetch notifications"
      );
    }
  }
);

const initialState: UserState = {
  notifications: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find(
        (n) => n.notificationId === action.payload
      );
      if (notification) notification.readStatus = "read";
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.notificationId !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload || [];
      })
      .addCase(fetchUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { markNotificationRead, removeNotification } = userSlice.actions;
export default userSlice.reducer;
