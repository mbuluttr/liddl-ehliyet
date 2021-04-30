import { createSlice } from "@reduxjs/toolkit";

export const examSlice = createSlice({
  name: "exam",
  initialState: {
    selected: {},
    selectedArray: [],
    examLength: 0,
    correctCount: 0,
    wrongCount: 0,
    wrongQuestionIds: [],
    correctQuestionIds: [],
    connection: false,
  },
  reducers: {
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    setSelectedArray: (state, action) => {
      let exists = state.selectedArray.find((item) => item.id === action.payload.id);
      if (exists) {
        exists.answer = action.payload.answer;
      } else {
        state.selectedArray.push(action.payload);
      }
      state.selected = {};
    },
    clearAllStates: (state) => {
      state.selected = {};
      state.selectedArray = [];
      state.correctCount = 0;
      state.wrongCount = 0;
      state.wrongQuestionIds = [];
      state.correctQuestionIds = [];
      state.examLength = 0;
    },
    calculateExamResult: (state) => {
      state.examLength = state.selectedArray.length;
      state.selectedArray.forEach((item) => {
        if (item.answer === item.correct) {
          state.correctCount = state.correctCount + 1;
          state.correctQuestionIds.push(item.id);
        } else {
          state.wrongCount = state.wrongCount + 1;
          state.wrongQuestionIds.push(item.id);
        }
      });
    },
    setConnection: (state, action) => {
      state.connection = action.payload;
    },
  },
});

export const { setSelected, setSelectedArray, clearAllStates, calculateExamResult, setConnection } = examSlice.actions;

export const selectSelected = (state) => state.exam.selected;
export const selectSelectedArray = (state) => state.exam.selectedArray;
export const selectCorrectCount = (state) => state.exam.correctCount;
export const selectWrongCount = (state) => state.exam.wrongCount;
export const selectWrongQuestionIds = (state) => state.exam.wrongQuestionIds;
export const selectCorrectQuestionIds = (state) => state.exam.correctQuestionIds;
export const selectExamLength = (state) => state.exam.examLength;
export const selectConnection = (state) => state.exam.connection;

export default examSlice.reducer;
