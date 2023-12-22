import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type User = {
  display_name: string;
  profile_image_url: string;
};

export type UserState = {
  data: User | null;
};

export const initialState: UserState = {
  data: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState["data"]>) => {
      state.data = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
