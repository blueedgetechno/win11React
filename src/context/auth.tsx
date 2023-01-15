import { SupabaseClient } from "@supabase/supabase-js";
import React, { useContext, useState, useEffect, createContext } from "react";
import { useSelector } from "react-redux";
import { BootScreen, LockScreen } from "../containers/background/index.jsx";
import { supabase } from "./supabase-client.js";

export class UserProfile {
  constructor(email?: string, avatar?: string) {
    this.email = email ? email : "anonymous";
    this.avatar = avatar ? avatar : "";
  }

  public email: string | null;
  public avatar: string | null;
}
export class AuthCtx {
  public signOut: () => void;
  public signInWithGoogle: () => void;
  public userProfile: UserProfile;
  public supabase: SupabaseClient;
}

// create a context for authentication
const AuthContext = createContext(new AuthCtx());

export const AuthProvider = ({ children }) => {
  const wall = useSelector((state: any) => state.wallpaper);

  // create state values for user data and loading
  const [Profile, setProfile] = useState(new UserProfile());
  const [Lock, setLock] = useState(false);

  useEffect(() => {
    // TODO
    supabase.auth.getUser().then((res) => {
      const email = res.data?.user?.email;
      setProfile(new UserProfile(email));
    });
  }, []);

  // create signUp, signIn, signOut functions
  const value = {
    signInWithGoogle: () => signInWithGoogle(),
    signOut: () => supabase.auth.signOut(),
  };
  async function signInWithGoogle() {
    supabase.auth
      .signInWithOAuth({
        provider: "google",
      })
      .then(({ data, error }) => {
        setLock(false);
      });
  }
  async function signOut() {
    supabase.auth.signOut().then(() => {
      setProfile(new UserProfile());
      setLock(true);
    });
  }

  // use a provider to pass down the value
  return (
    <AuthContext.Provider
      value={{
        signInWithGoogle,
        signOut,
        userProfile: Profile,
        supabase: supabase,
      }}
    >
      {!wall.booted ? <BootScreen dir={wall.dir} /> : null}
      {wall.locked ? <LockScreen dir={wall.dir} /> : children}
    </AuthContext.Provider>
  );
};

// export the useAuth hook
export const useAuth = () => {
  return useContext(AuthContext);
};
