import {
  SET_LINK_TOKEN,
  ADD_ACCOUNT,
  UPDATE_ACCOUNT,
  DELETE_ACCOUNT,
  GET_ACCOUNTS,
  ACCOUNTS_LOADING,
  GET_TRANSACTIONS,
  TRANSACTIONS_LOADING
} from "../actions/types";

const initialState = {
  linkToken: {},
  accounts: [],
  transactions: [],
  accountsLoading: false,
  transactionsLoading: false
};

export default function(state = initialState, action) {

  console.log("account reducer: ", action.type);

  switch (action.type) {
    case SET_LINK_TOKEN:
      console.log("Setting Link Token to: " + action.payload.link_token)
      return {
        ...state,
        linkToken: action.payload.link_token
      };
    case ACCOUNTS_LOADING:
      return {
        ...state,
        accountsLoading: true
      };
    case ADD_ACCOUNT:
      return {
        ...state,
        accounts: [action.payload, ...state.accounts]
      };
    case UPDATE_ACCOUNT:
        return {
          ...state
      };      
    case DELETE_ACCOUNT:
      return {
        ...state,
        accounts: state.accounts.filter(
          account => account._id !== action.payload
        )
      };
    case GET_ACCOUNTS:
      console.log("GOT Accounts" , action.payload);
      return {
        ...state,
        accounts: action.payload,
        accountsLoading: false
      };
    case TRANSACTIONS_LOADING:
      return {
        ...state,
        transactionsLoading: true
      };
    case GET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
        transactionsLoading: false
      };
    default:
      return state;
  }
}
