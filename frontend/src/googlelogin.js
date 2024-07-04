import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider, setPersistence, browserSessionPersistence } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './config/firebase-config';
import { useUser } from './userContext';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const GoogleLogin = () => {
const navigate = useNavigate();

const { setGoogleUser } = useUser();

const loginWithGoogle = () => {
const provider = new GoogleAuthProvider();
setPersistence(auth, browserSessionPersistence).then(() => {
signInWithPopup(auth, provider)
.then((userCred) => {
const google_user = userCred.user;
setGoogleUser(google_user);
navigate('/mainlin');
})
.catch((error) => {
console.error("Login failed:", error);
});
});
};

return (
<div className="google-logo" onClick={loginWithGoogle}>
<div className="logo-text"><div className="click">Google</div></div>
</div>
);
};

export default GoogleLogin;