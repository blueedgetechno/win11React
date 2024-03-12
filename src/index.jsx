import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store, useAppSelector } from './backend/reducers';
import Local from './local';

const root = createRoot(document.getElementById('root'));
const Redirect = () => {
    const local = useAppSelector((x) => x.remote.local);
    return local ? <Local /> : <App />;
};

root.render(
    <Suspense
        fallback={
            <div id="sus-fallback">
                <h1>Loading</h1>
            </div>
        }
    >
        <Provider store={store}>
            <Redirect></Redirect>
        </Provider>
    </Suspense>
);
