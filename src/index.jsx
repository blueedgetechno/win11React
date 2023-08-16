import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import App from "./App";
import store from "./reducers";
import { Provider } from "react-redux";

// Sentry.init({
//   dsn: "https://6c16d34365334e0fbee992044f9d223b@o575799.ingest.sentry.io/6251530",
//   integrations: [new BrowserTracing()],

//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   // environments for a more accurate trace.
//   tracesSampleRate: 1.0,
// });

const root = createRoot(document.getElementById("root"));

root.render(
  <Suspense
    fallback={
      <div id="sus-fallback">
        <h1>Loading</h1>
      </div>
    }
  >
    <Provider store={store}>
      <App />
    </Provider>
  </Suspense>,
);
