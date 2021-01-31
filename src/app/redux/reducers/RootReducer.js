import { combineReducers } from "redux";
import ScrumBoardReducer from "./ScrumBoardReducer";
import NotificationReducer from "./NotificationReducer";
import EcommerceReducer from "./EcommerceReducer";
import NavigationReducer from "./NavigationReducer";
import errorReducer from "./errorReducer";
import accountReducer from "./accountReducer";

const RootReducer = combineReducers({
  notifications: NotificationReducer,
  navigations: NavigationReducer,
  scrumboard: ScrumBoardReducer,
  ecommerce: EcommerceReducer,
  errors: errorReducer,
  plaid: accountReducer,
});

export default RootReducer;
