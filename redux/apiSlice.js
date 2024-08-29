import { createSlice } from "@reduxjs/toolkit";
import dummyResponse from "../constants/dummyResponse";

const initialState = {
  data: dummyResponse,
};

const houseSlice = createSlice({
  name: "houses",
  initialState,
  reducers: {
    //action to unlock house
    unlockHouse: (state, action) => {
      const houseId = action.payload;
      const houseIndex = state.data.findIndex((house) => house.id === houseId);

      if (houseIndex !== -1) {
        state.data[houseIndex] = {
          ...state.data[houseIndex],
          unlocked: true,
        };
      }
    },
  },
});

export const { unlockHouse } = houseSlice.actions;
export default houseSlice.reducer;
