import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './backend/reducers';

const root = createRoot(document.getElementById('root'));

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
    </Suspense>
);
