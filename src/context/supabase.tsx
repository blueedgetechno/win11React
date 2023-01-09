import React, { useContext, useState, useEffect, createContext } from 'react';
import { supabase } from './supabase-client.js';


export class AuthCtx{
  public signOut: () => void
  public signInWithGoogle: () => void
}


// create a context for authentication
const AuthContext = createContext(new AuthCtx());

export const AuthProvider = ({ children }) => {
  // create state values for user data and loading
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO
  }, []);

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }
  // create signUp, signIn, signOut functions
  const value = {
    signInWithGoogle: () => signInWithGoogle(),
    signOut: () => supabase.auth.signOut(),
  };

  // use a provider to pass down the value
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// export the useAuth hook
export const useAuth = () => {
  return useContext(AuthContext);
};

