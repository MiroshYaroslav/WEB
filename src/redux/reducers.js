import {combineReducers} from "redux";
import {
    CART_ADD,
    CART_FAILURE,
    CART_REMOVE,
    CART_REQUEST,
    CART_SET,
    CART_UPDATE,
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
    case SET_CURRENT_USER:
      return { ...state, currentUser: action.payload ?? null };
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
      if (!action.payload) return { ...initialFav };
      return state;
    default:
      return state;
  }
}

const initialCart = { items: [], loading: false, error: "" };

function cart(state = initialCart, action) {
  switch (action.type) {
    case CART_REQUEST:
      return { ...state, loading: true, error: "" };
    case CART_FAILURE:
      return { ...state, loading: false, error: action.error || "" };
    case CART_SET:
      return { ...state, loading: false, items: action.payload || [] };
    case CART_ADD:
      return {
        ...state,
        loading: false,
        items: [action.payload, ...state.items],
      };
    case CART_UPDATE:
      return {
        ...state,
        loading: false,
        items: state.items.map((it) =>
          it.id === action.payload.id ? action.payload : it,
        ),
      };
    case CART_REMOVE:
      return {
        ...state,
        loading: false,
        items: state.items.filter((it) => it.id !== action.payload),
      };

    default:
      return state;
  }
}

export default combineReducers({
  auth,
  favorites,
  cart,
});
