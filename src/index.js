import React, { Suspense } from "react";
import {createRoot} from "react-dom/client";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import App from "./App";
import store from "./reducers";
import { Provider } from "react-redux";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "auth.win11react.com",
  projectId: "win11react",
  storageBucket: "auth.win11react.com",
  messagingSenderId: "213452110834",
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: "G-N7CJ22ZMSJ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

Sentry.init({
  dsn: "https://6c16d34365334e0fbee992044f9d223b@o575799.ingest.sentry.io/6251530",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const root = createRoot(document.getElementById("root"));
root.render(
  <Suspense fallback={<h1>Loading...</h1>}>
    <Provider store={store}>
      <App />
    </Provider>
  </Suspense>
);

serviceWorkerRegistration.register();
