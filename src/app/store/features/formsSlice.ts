import { getCountries, getDocumentTypes } from "@/services/formsService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface FormsSharedState {
  countries: any[];
  documentTypes: any[];
  loading: boolean;
  error: string | null;
}

const initialState: FormsSharedState = {
  countries: [],
  documentTypes: [],
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
        docTypes: {},
      };
      const [countriesRes, docTypesRes] = await Promise.all([
        getCountries(payload.countries),
        getDocumentTypes(payload.docTypes),
      ]);

      return {
        countries: countriesRes,
        documentTypes: docTypesRes,
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
