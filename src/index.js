import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import App from './App';
import store from './reducers';
import {Provider} from 'react-redux';

Sentry.init({
  dsn: "https://6c16d34365334e0fbee992044f9d223b@o575799.ingest.sentry.io/6251530",
  integrations: [new BrowserTracing()],
  beforeSend(event, hint) {
     // Check if it is an exception, and if so, show the report dialog
     if (event.exception) {
       Sentry.showReportDialog({ eventId: event.event_id });
     }
     return event;
  },

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <Suspense fallback={<h1>Loading...</h1>}>
  <Provider store={store}>
    <App />
  </Provider>,
  </Suspense>,
  document.getElementById('root'));
