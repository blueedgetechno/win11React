import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './local.css';

const root = createRoot(document.getElementById('root'));


function App() {
    const handleLogin = async () => {

    }


    return <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
            <div className="title">
                <h2>Login </h2>
                <p className="subTitle">to continue to Thinkmay </p>
            </div>
            <div className="form-group">
                <input placeholder="Username" type="text" id="username" required />
                <input placeholder="Password" type="password" id="username" required />
            </div>
            <div className="ctn-btn">
                <button className="btn-login" type="submit">
                    Login
                </button>

            </div>
        </form>
    </div>
}

root.render(
    <Suspense
        fallback={
            <div id="sus-fallback">
                <h1>Loading</h1>
            </div>
        }
    >
        <App />
    </Suspense>
);
