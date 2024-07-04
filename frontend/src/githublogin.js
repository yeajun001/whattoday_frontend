import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './config/firebase-config';
import { useUser } from './userContext';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const GithubLogin = () => {
const navigate = useNavigate();

const { setGithubUser } = useUser();

const loginWithGithub = () => {
const provider = new GithubAuthProvider();
signInWithPopup(auth, provider)
.then((userCred) => {
const github_user = userCred.user;
console.log(github_user.email);
setGithubUser(github_user);
navigate('/mainlin');
})
.catch((error) => {
console.error("Login failed:", error);
});
};

return (
<div className="github-logo" onClick={loginWithGithub}>
<div className="logo-text"><div className="click">Github</div></div>
</div>
);
};

export default GithubLogin;