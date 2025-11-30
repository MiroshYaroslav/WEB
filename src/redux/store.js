import { applyMiddleware, compose, createStore } from "redux";
import { thunk } from "redux-thunk";
import rootReducer from "./reducers";

function loadUser() {
  try {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.id === "number") return parsed;
    return null;
  } catch {
    return null;
  }
}

const preloadedState = {
  auth: { currentUser: loadUser() },
};

const composeEnhancers =
  typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

const store = createStore(
  rootReducer,
  preloadedState,
  composeEnhancers(applyMiddleware(thunk)),
);

export default store;
