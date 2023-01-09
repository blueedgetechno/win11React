import React from "react";
import { useGoogleLogin } from "react-use-googlelogin";

const GoogleAuthContext = React.createContext();

const GoogleAuthProvider = ({ children }) => {
  const googleAuth = useGoogleLogin({
    // clientId: process.env.GOOGLE_CLIENT_ID, // Your clientID from Google.
    clientId:
      "847485432179-k0sb7892qlrgv1hphf6vo4ms6r7lqlqo.apps.googleusercontent.com", // Your clientID from Google.
  });

  return (
    <GoogleAuthContext.Provider value={googleAuth}>
      {children}
    </GoogleAuthContext.Provider>
  );
};

const useGoogleAuth = () => React.useContext(GoogleAuthContext);

export function LoginButton() {
  const { signIn } = useGoogleAuth();

  return <button onClick={signIn}>Login</button>;
}
