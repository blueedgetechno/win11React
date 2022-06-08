import 'firebase/compat/auth';
import firebase from 'firebase/compat/app';
import {useAuthState} from 'react-firebase-hooks/auth';
import { GithubAuthProvider, OAuthCredential } from 'firebase/auth';

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

async function login() {
    auth.signInWithPopup(githubLoginProvider).then((res)=>{
            console.log(res);
            vars.token = res.credential.accessToken;
            vars.user = res.additionalUserInfo.username;
            vars.email = res.user.email;
            vars.photo = res.user.photoURL;  
            Object.freeze(vars);
      
    },
                                                   
}
export default login;
