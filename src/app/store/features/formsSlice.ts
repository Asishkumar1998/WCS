import { getCountries } from "@/services/formsService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface FormsSharedState {
  countries: any[];
  loading: boolean;
  error: string | null;
}

const initialState: FormsSharedState = {
  countries: [],
  loading: false,
  error: null,
};

export const fetchFormsSharedData = createAsyncThunk(
  "forms/fetchSharedData",
  async (_, { rejectWithValue }) => {
    try {
      const payload = {
        countries: {
          active: 1,
        },
      };
      const [countriesRes] = await Promise.all([
        getCountries(payload.countries),
      ]);

      return {
        countries: countriesRes,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const formsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFormsSharedData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormsSharedData.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchFormsSharedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default formsSlice.reducer;
