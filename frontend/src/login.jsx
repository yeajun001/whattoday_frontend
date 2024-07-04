import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, setPersistence, browserSessionPersistence } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './config/firebase-config';
import { useUser } from './userContext';
import styles from "./loginmain.module.css";
import axios from 'axios';

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const SocialLogin = () => {
  const navigate = useNavigate();
  const { setGoogleUser, setGithubUser } = useUser();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCred = await signInWithPopup(auth, provider);
      const google_user = userCred.user;
      setGoogleUser(google_user);
      sessionStorage.setItem('googlelogincheck', google_user);
      sessionStorage.setItem('googleUseremail', google_user.email);

      const idToken = await google_user.getIdToken();
      try {
        const response = await axios.post('https://whattoday.kro.kr:3001/login', { idToken });
        console.log(response.data);
        navigate('/mainlin');
      } catch (error) {
        console.error("Login failed:", error);
      }
    } catch (error) {
      console.error("Google Login failed:", error);
    }
  };

  const loginWithGithub = async () => {
    const provider = new GithubAuthProvider();
    try {
      const userCred = await signInWithPopup(auth, provider);
      const github_user = userCred.user;
      setGithubUser(github_user);
      sessionStorage.setItem('githublogincheck', github_user);
      sessionStorage.setItem('githubUseremail', github_user.email);

      const idToken = await github_user.getIdToken();
      try {
        const response = await axios.post('https://whattoday.kro.kr:3001/login', { idToken });
        console.log(response.data);
        navigate('/mainlin');
      } catch (error) {
        console.error("Login failed:", error);
      }
    } catch (error) {
      console.error("Github Login failed:", error);
    }
  };

  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  return (
    <div className={styles["main-login-text-box-right"]}>
      <div className={styles["logo-container"]}>
        <div className={styles["github-logo"]} onClick={loginWithGithub}>
          <div className={styles["logo-text"]}>Github</div>
        </div>
        <div className={styles["ban"]}></div>
        <div className={styles["google-logo"]} onClick={loginWithGoogle}>
          <div className={styles["logo-text"]}>Google</div>
        </div>
      </div>
    </div>
  );
};
export default SocialLogin;
