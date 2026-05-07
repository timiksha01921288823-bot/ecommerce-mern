import api from '../../../config/api';
import {
    CREATE_PAYMENT_REQUEST,
    CREATE_PAYMENT_SUCCESS,
    CREATE_PAYMENT_FAILURE,
    UPDATE_PAYMENT_REQUEST,
    UPDATE_PAYMENT_SUCCESS,
    UPDATE_PAYMENT_FAILURE,
  } from './ActionType';
  
  export const createPayment = (reqData) => async (dispatch) => {
    try {
      dispatch({ type: CREATE_PAYMENT_REQUEST });
      const { data } = await api.post(`/api/payments/${reqData.orderId}`, reqData);
      if (data.payment_link_url) {
        window.location.href = data.payment_link_url;
      }
      dispatch({ type: CREATE_PAYMENT_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: CREATE_PAYMENT_FAILURE, payload: error.response && error.response.data.message ? error.response.data.message : error.message });
    }
  };
  
  export const updatePayment = (reqData) => {
    return async (dispatch) => {
      dispatch(updatePaymentRequest());
      try {
        const response = await api.get(`/api/payments?payment_id=${reqData.paymentId}&order_id=${reqData.orderId}`);
        dispatch(updatePaymentSuccess(response.data));
      } catch (error) {
        dispatch(updatePaymentFailure(error.message));
      }
    };
  };

export const updatePaymentRequest = () => {
  return {
    type: UPDATE_PAYMENT_REQUEST,
  };
};

export const updatePaymentSuccess = (payment) => {
  return {
    type: UPDATE_PAYMENT_SUCCESS,
    payload: payment,
  };
};

export const updatePaymentFailure = (error) => {
  return {
    type: UPDATE_PAYMENT_FAILURE,
    payload: error,
  };
};

 
  