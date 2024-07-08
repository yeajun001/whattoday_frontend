import React from 'react';
import styles from './signin.module.css';
import Signup from './Signup';
import { useNavigate } from 'react-router-dom';


function Signin() {

  const navigate = useNavigate();

  return (
    <div>
                <header className={styles.all}>
              <div className={styles['head-box']}>
                  <div className={styles['head-text']}>
                  <div className={styles["head-text-img"]}></div>
                  <a href="/" className={styles.click}>오늘 뭐해?</a>
              </div>
                  <div className={styles['header-right-text-box']}>
                      <div className={styles['header-right-text']} onClick={() => navigate("/loginmain")}><div className={styles.click}>로그인</div></div>
                  </div>
              </div>
          </header>
          <section className={styles['main-all']}>
              <div className={styles['main-background']}>
                <div className={styles['main-box']}>
                </div>
              </div>
          </section>
      <section className={styles.all}>
        <div className={styles['main-box']}>
          <div className={styles["main-login-box"]}>
            <div className={styles["main-login-text-box-left"]}>
              <div className={styles["main-login-title"]}>
                Signup
              </div>
            </div>
              <Signup />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Signin;
