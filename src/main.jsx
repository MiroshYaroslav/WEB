import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store, { persistor } from "./redux/store";
import { logoutCurrentUser, setCurrentUser } from "./redux/actions";
import { configureAuthCallbacks } from "./utils/api";
import App from "./App.jsx";
import "./styles/index.css";

configureAuthCallbacks({
  getCurrentUser: () => store.getState().auth.currentUser,
  updateAccessToken: (accessToken) => {
    const currentUser = store.getState().auth.currentUser;
    if (currentUser) {
      store.dispatch(
        setCurrentUser({ ...currentUser, access_token: accessToken }),
      );
    }
  },
  logout: () => store.dispatch(logoutCurrentUser()),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
