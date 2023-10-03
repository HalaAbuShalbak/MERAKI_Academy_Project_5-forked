import { createSlice } from "@reduxjs/toolkit";

export const schedule = createSlice({
  name: "schedule",
  initialState: {
    schedule: [],
  },
  reducers: {
    setSchedule: (state, action) => {
      state.schedule = action.payload;
    },
    addSchedule: (state, action) => {
      state.schedule.push(action.payload);
    },
    deleteSchedule: (state, action) => {
      state.schedule = state.schedule.filter((sched) => {
        return sched.provider_id !== action.payload;
      });
    },
    updateSchedule: (state, action) => {
      state.schedule= state.schedule.map((sched ,i) => {
       console.log(action.payload);
         if (schedule.schedule_id == action.payload.schedule_id) {
          sched.is_booked = action.payload.is_booked;
          
         }
         return sched
       });
     },
  },
});

export const { setSchedule, addSchedule, deleteSchedule,updateSchedule } = schedule.actions;
export default schedule.reducer;
