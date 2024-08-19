import { createSlice } from '@reduxjs/toolkit';

import { STATUS } from '~/literals';

import { UserState } from '~/types';

export const userState: UserState = {
  isAuthenticated: false,
  user: {},
  status: STATUS.IDLE,
  token: "",
  role: ""
};

export const userSlice = createSlice({
  name: 'user',
  initialState: userState,
  reducers: {
    login: draft => {
      draft.status = STATUS.RUNNING;
    },
    loginSuccess: (draft, {payload}) => {
      draft.isAuthenticated = true;
      draft.user = payload.user;
      draft.token = payload.token;
      draft.role = payload.role;
      draft.status = STATUS.READY;
    },
    logOut: draft => {
      draft.status = STATUS.RUNNING;
    },
    logOutSuccess: draft => {
      draft.isAuthenticated = false;
      draft.user = {};
      draft.token = "";
      draft.role = "";
      draft.status = STATUS.IDLE;
    },
  },
});

export const { login, loginSuccess, logOut, logOutSuccess } = userSlice.actions;
export default userSlice.reducer;
