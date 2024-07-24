import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import userReducer from "./user/slice";
import companyReduce from "./company/slice";
import { useDispatch } from "react-redux";

interface TestState {
  testString: string;
}

const initialState: TestState = {
  testString: "Initial test string",
};

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    setTestString: (state, action: PayloadAction<string>) => {
      state.testString = action.payload;
    },
  },
});

export const { setTestString } = testSlice.actions;

export const store = configureStore({
  reducer: {
    test: testSlice.reducer,
    user: userReducer,
    company: companyReduce,
  },
});

export type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
