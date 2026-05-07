import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  LOGOUT
} from './ActionTypes';
import api from '../../config/api';

// Register action creators
const registerRequest = () => ({ type: REGISTER_REQUEST });
const registerSuccess = (user) => ({ type: REGISTER_SUCCESS, payload:user });
const registerFailure = error => ({ type: REGISTER_FAILURE, payload: error });

export const register = userData => async dispatch => {
  dispatch(registerRequest());
  try {
    const response = await api.post('/auth/signup', userData);
    const user = response.data;
    if (user.jwt) localStorage.setItem('jwt', user.jwt);
    dispatch(registerSuccess(user));
    if (user.jwt) dispatch(getUser(user.jwt));
  } catch (error) {
    dispatch(registerFailure(error.response?.data?.error || error.message));
  }
};

// Login action creators
const loginRequest = () => ({ type: LOGIN_REQUEST });
const loginSuccess = user => ({ type: LOGIN_SUCCESS, payload: user });
const loginFailure = error => ({ type: LOGIN_FAILURE, payload: error });

export const login = userData => async dispatch => {
  dispatch(loginRequest());
  try {
    const response = await api.post('/auth/signin', userData);
    const user = response.data;
    if (user.jwt) localStorage.setItem('jwt', user.jwt);
    dispatch(loginSuccess(user));
    if (user.jwt) dispatch(getUser());
  } catch (error) {
    dispatch(loginFailure(error.response?.data?.message || error.response?.data?.error || error.message));
  }
};

// Get user profile from stored token
export const getUser = () => {
  return async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST });
    try {
      const response = await api.get('/api/users/profile');
      const user = response.data;
      dispatch({ type: GET_USER_SUCCESS, payload: user });
    } catch (error) {
      const errorMessage = error.message;
      localStorage.removeItem('jwt');
      dispatch({ type: LOGOUT });
      dispatch({ type: GET_USER_FAILURE, payload: errorMessage });
    }
  };
};

export const logout = (token) => {
    return async (dispatch) => {
      dispatch({ type: LOGOUT });
      localStorage.clear();
    };
  };
