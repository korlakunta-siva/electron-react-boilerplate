import axios from "axios";

import {
  GET_ERRORS,
  SET_LINK_TOKEN,
  ADD_ACCOUNT,
  DELETE_ACCOUNT,
  GET_ACCOUNTS,
  ACCOUNTS_LOADING,
  GET_TRANSACTIONS,
  TRANSACTIONS_LOADING
} from "./types";


export const getLinkToken = () => dispatch => {

  const accessToken = localStorage.getItem("accessToken");
  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  axios
    .get("https://192.168.21.199:8041/get_link_token")
    .then(res => {
      dispatch(setLinkToken(res.data));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


// Get all accounts for specific user
export const getAccounts = () => dispatch => {
  dispatch(setAccountsLoading());
  console.log("Calling get accounts");
  const accessToken = localStorage.getItem("accessToken");
  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  console.log(axios.defaults.headers.common["Authorization"]);
  axios
    .get("https://192.168.21.199:8041/api/plaid/accounts")
    .then(res =>
      dispatch({
        type: GET_ACCOUNTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ACCOUNTS,
        payload: null
      })
    );
};


// Add account
export const addAccount = plaidData => dispatch => {
  const accounts = plaidData.accounts;
  const accessToken = localStorage.getItem("accessToken");
  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  axios
    .post("https://192.168.21.199:8041/api/plaid/accounts/add/", plaidData)
    .then(res =>
      dispatch({
        type: ADD_ACCOUNT,
        payload: res.data
      })
    )
    .then(data =>
      accounts ? dispatch(getTransactions(accounts.concat(data.payload))) : null
    )
    .catch(err => console.log(err));
};

// Add account
export const refreshAccount = plaidData => dispatch => {
  const accessToken = localStorage.getItem("accessToken");
  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  const accounts = plaidData.accounts;
  axios
    .post("/api/plaid/accounts/refresh/", plaidData)
    .then(res =>
      dispatch({
        type: ADD_ACCOUNT,
        payload: res.data
      })
    )
    .then(data =>
      accounts ? dispatch(getTransactions(accounts.concat(data.payload))) : null
    )
    .catch(err => console.log(err));
};

// Delete account
export const deleteAccount = id => dispatch => {
  if (window.confirm("Are you sure you want to remove this account?")) {
    axios
      .delete(`https://192.168.21.199:8041/api/plaid/account/${id}`)
      .then(res =>
        dispatch({
          type: DELETE_ACCOUNT,
          payload: id
        })
      )
      //.then(newAccounts ? dispatch(getTransactions(newAccounts)) : null)
      .catch(err => console.log(err));
  }
};

// Accounts loading
export const setAccountsLoading = () => {
  return {
    type: ACCOUNTS_LOADING
  };
};

// Accounts loading
export const setLinkToken = (linktoken) => {
  return {
    type: SET_LINK_TOKEN,
    payload: linktoken
  };
};

// Get Transactions
export const getTransactions = (id, txnscope) => dispatch => {
  dispatch(setTransactionsLoading());
  const accessToken = localStorage.getItem("accessToken");
  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

  axios
    .post("https://192.168.21.199:8041/api/plaid/accounts/allhxtransactions/", { 'id': id,  'op' : txnscope})
    .then(res =>
      dispatch({
        type: GET_TRANSACTIONS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_TRANSACTIONS,
        payload: null
      })
    );
};

// Transactions loading
export const setTransactionsLoading = () => {
  return {
    type: TRANSACTIONS_LOADING
  };
};
