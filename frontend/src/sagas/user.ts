import { all, call, put, takeLatest } from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';
import { PayloadAction } from '@reduxjs/toolkit';
import { login, logOut, loginSuccess, loginFailure, logOutSuccess } from '~/actions';
import { IFormInput } from '~/types';

// Define the return type of the saga
type LoginResponse = {
  success: boolean;
  user: any; // Replace `any` with the actual user type if known
  token: string;
  role: string;
  msg: string;
};

function* loginSaga(action: PayloadAction<IFormInput>): Generator<any, void, AxiosResponse<LoginResponse>> {
  try {
    const response = yield call(axios.post, 'http://localhost:5000/api/users/login', action.payload);
    
    if (response.data.success) {
      yield put(loginSuccess(response.data));
    } else {
      yield put(loginFailure({ error: response.data.msg }));
    }
  } catch (error:any) {
    yield put(loginFailure({ error: error.response.data.msg }));
  }
}

export function* logoutSaga() {
  yield put(logOutSuccess());
}

export default function* rootSaga() {
  yield all([takeLatest(login.type, loginSaga), takeLatest(logOut.type, logoutSaga)]);
}
