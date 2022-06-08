import 'firebase/compat/auth';
import firebase from 'firebase/compat/app';
import {useAuthState} from 'react-firebase-hooks/auth';
import { GithubAuthProvider, OAuthCredential, EmailAuthProvider, OAuthProvider } from 'firebase/auth';

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "auth.win11react.com",
  projectId: "win11react",
  storageBucket: "auth.win11react.com",
  messagingSenderId: "213452110834",
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: "G-N7CJ22ZMSJ"
});

const auth = firebase.auth();
const githubLoginProvider = new firebase.auth.GithubAuthProvider();
const emailLoginProvider = new firebase.auth.EmailAuthProvider();
const provider = new OAuthProvider('microsoft.com');


async function login() {
  EmailAuthProvider.addScope('repo');  
      auth.signInWithPopup(provider).then((res)=>{
       console.log(res);
      })
}

export default login;
