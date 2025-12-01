import { combineReducers } from "redux";
import {
  FAV_ADD,
  FAV_FAILURE,
  FAV_REMOVE,
  FAV_REQUEST,
  FAV_SET,
  SET_CURRENT_USER,
} from "./actions";

const initialAuth = {
  currentUser: null,
};

function auth(state = initialAuth, action) {
  switch (action.type) {
    case SET_CURRENT_USER: {
      const user = action.payload ?? null;
      try {
        if (user) localStorage.setItem("currentUser", JSON.stringify(user));
        else localStorage.removeItem("currentUser");
      } catch { /* empty */ }
      return { ...state, currentUser: user };
    }
    default:
      return state;
  }
}

const initialFav = {
  items: [],
  loading: false,
  error: "",
};

function favorites(state = initialFav, action) {
  switch (action.type) {
    case FAV_REQUEST:
      return { ...state, loading: true, error: "" };
    case FAV_FAILURE:
      return { ...state, loading: false, error: action.error || "" };
    case FAV_SET:
      return {
        ...state,
        loading: false,
        error: "",
        items: action.payload || [],
      };
    case FAV_ADD: {
      const exists = state.items.some((f) => f.id === action.payload?.id);
      const items = exists ? state.items : [action.payload, ...state.items];
      return { ...state, loading: false, error: "", items };
    }
    case FAV_REMOVE:
      return {
        ...state,
        loading: false,
        error: "",
        items: state.items.filter((f) => f.id !== action.payload),
      };
    case SET_CURRENT_USER:
      if (!action.payload) {
        return { ...initialFav };
      }
      return state;
    default:
      return state;
  }
}

const rootReducer = combineReducers({ auth, favorites });
export default rootReducer;
