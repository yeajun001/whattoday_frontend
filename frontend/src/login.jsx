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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        const response = await axios.post('https://port-0-whattoday-deploy-backend-ly7hfh5b552425a2.sel5.cloudtype.app/login', { idToken });
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
        const response = await axios.post('https://port-0-whattoday-deploy-backend-ly7hfh5b552425a2.sel5.cloudtype.app/login', { idToken });
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

  const handleLogin = async () => {
    try {
      const response = await fetch('https://port-0-whattoday-deploy-backend-ly7hfh5b552425a2.sel5.cloudtype.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        // 로그인 성공 처리
        navigate('/mainlin');
      } else {
        // 로그인 실패 처리
        alert('이메일 또는 비밀번호가 잘못되었습니다.');
      }
    } catch (error) {
      console.error('로그인 요청 실패:', error);
      alert('서버 오류');
    }
  };


  return (
  <div className={styles["main-login-text-box-right"]}>
    <div className={styles["login-input-box"]}>
    <input
        type="text"
        className={styles["login-input"]}
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className={styles["login-input"]}
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className={styles["button-container"]}>
        <button className={styles["signin-button"]} onClick={() => navigate("/Signin")}>회원가입</button>
        <button className={styles["login-button"]} onClick={handleLogin}>로그인</button>
    </div>
  </div>
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
