import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
    drawerOpen: boolean;
}

const initialState: UIState = {
    drawerOpen: true, // default expanded
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleDrawer: (state) => {
            state.drawerOpen = !state.drawerOpen;
        },
        setDrawer: (state, action: PayloadAction<boolean>) => {
            state.drawerOpen = action.payload;
        },
    },
});

export const { toggleDrawer, setDrawer } = uiSlice.actions;
export default uiSlice.reducer;
