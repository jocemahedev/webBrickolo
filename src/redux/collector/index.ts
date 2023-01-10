import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {Collector} from '../../types/types';

export type CollectorState = {
  currentCollector: Collector | undefined;
};

export const initialState: CollectorState = {
  currentCollector: undefined,
};
const collectorSlice = createSlice({
  name: 'collector',
  initialState: initialState,
  reducers: {
    setCurrentCollector(state, action: PayloadAction<Collector>) {
      state.currentCollector = action.payload;
    },
  },
});
export const {setCurrentCollector} = collectorSlice.actions;
export default collectorSlice.reducer;
