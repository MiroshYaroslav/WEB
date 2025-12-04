import { applyMiddleware, compose, createStore } from "redux";
import { thunk } from "redux-thunk";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./reducers";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart", "favorites"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers =
  typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk)),
);

export const persistor = persistStore(store);

export default store;
