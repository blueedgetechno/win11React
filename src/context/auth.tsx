import { SupabaseClient } from '@supabase/supabase-js';
import React, { useContext, useState, useEffect, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, loadSettings, loadWidget } from '../actions';
import { BootScreen, LockScreen } from '../containers/background/index.jsx';

// create a context for authentication
export const AuthProvider = ({ children }) => {
  const wall = useSelector((state: any) => state.wallpaper);
  const dispatch = useDispatch();

  // create state values for user data and loading
  useEffect(() => {
    // TODO
    getUserInfo(dispatch);
  }, []);
  const user = useSelector((state) => state.user);
  console.log(user);

  // create signUp, signIn, signOut functions


  // use a provider to pass down the value
  return (
    <>
      {!wall.booted ? <BootScreen dir={wall.dir} /> : null}
      {wall.locked ? <LockScreen dir={wall.dir} /> : children}
    </>
  );
};

// export the useAuth hook

