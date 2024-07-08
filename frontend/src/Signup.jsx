import { useNavigate } from 'react-router-dom';
import styles from './signin.module.css';

const Signup = () => {
  const navigate = useNavigate();

  return (
  <div className={styles["main-login-text-box-right"]}>
    <div className={styles["login-input-box"]}>
        <input type="text" className={styles["login-input"]} placeholder="이메일" />
        <input type="password" className={styles["login-input"]} placeholder="비밀번호" />
        <input type="password" className={styles["login-input"]} placeholder="비밀번호확인" />
        <div className={styles["button-container"]}>
        <button className={styles["signin-button"]} onClick={() => navigate("/loginmain")}>취소</button>
        <button className={styles["login-button"]}>확인</button>
    </div>
  </div>
</div>

  );
};
export default Signup;
