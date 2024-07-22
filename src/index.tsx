import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Store/store";
import Auth0ProviderWithNavigate from "./Utils/auth0-provider-with-history";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <Router>
      <Auth0ProviderWithNavigate>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </Auth0ProviderWithNavigate>
    </Router>
  </Provider>
);
