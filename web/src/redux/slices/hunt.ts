import { createSlice } from "@reduxjs/toolkit";
import type { Bonus, Hunt, UpdateHunt } from "@/types/types";
import type { PayloadAction } from "@reduxjs/toolkit";

export type HuntState = {
  hunts: Hunt[];
};

export const initialState: HuntState = {
  hunts: [],
};

export const huntSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setHunts: (state, action: PayloadAction<HuntState["hunts"]>) => {
      state.hunts = action.payload;
    },
    addHunt: (state, action: PayloadAction<Hunt>) => {
      state.hunts.push(action.payload);
    },
    addBonus: (
      state,
      action: PayloadAction<{ hunt_id: string; bonus: Bonus }>
    ) => {
      const huntIndex = state.hunts?.findIndex(
        (hunt) => hunt.id === action.payload.hunt_id
      );

      if (huntIndex !== undefined && huntIndex !== -1) {
        state.hunts[huntIndex].bonuses?.push(action.payload.bonus);
      }
    },
    deleteBonus: (
      state,
      action: PayloadAction<{ hunt_id: string; bonus_id: string }>
    ) => {
      const huntIndex = state.hunts?.findIndex(
        (hunt) => hunt.id === action.payload.hunt_id
      );

      if (huntIndex !== undefined && huntIndex !== -1) {
        state.hunts[huntIndex].bonuses = state.hunts[huntIndex].bonuses?.filter(
          (v) => v.id !== action.payload.bonus_id
        );
      }
    },
    updateBonus: (
      state,
      action: PayloadAction<{ hunt_id: string; bonus_id: string; bet: number }>
    ) => {
      const huntIndex = state.hunts?.findIndex(
        (hunt) => hunt.id === action.payload.hunt_id
      );

      if (huntIndex === undefined && huntIndex === -1) return;

      //@ts-ignore
      const bonusIndex = state.hunts[huntIndex].bonuses.findIndex(
        (hunt) => hunt.id === action.payload.bonus_id
      );

      if (bonusIndex === undefined && bonusIndex === -1) return;

      //@ts-ignore
      state.hunts[huntIndex].bonuses[bonusIndex].bet = action.payload.bet;
    },
    updateHunt: (state, action: PayloadAction<UpdateHunt>) => {
      const huntIndex = state.hunts?.findIndex(
        (hunt) => hunt.id === action.payload.id
      );

      if (huntIndex !== undefined && huntIndex !== -1) {
        state.hunts[huntIndex].name = action.payload.name;
        state.hunts[huntIndex].start = action.payload.start;
      }
    },
    deleteHunt: (state, action: PayloadAction<string>) => {
      console.log(action.payload);
      state.hunts = state.hunts.filter((v) => v.id !== action.payload) || null;
    },
  },
});

export const {
  setHunts,
  deleteHunt,
  updateHunt,
  addHunt,
  deleteBonus,
  addBonus,
  updateBonus,
} = huntSlice.actions;
export default huntSlice.reducer;
