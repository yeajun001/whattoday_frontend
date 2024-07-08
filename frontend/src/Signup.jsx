import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './signin.module.css';

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSignup = async () => {
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const response = await fetch('https://port-0-whattoday-deploy-backend-ly7hfh5b552425a2.sel5.cloudtype.app/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      alert('회원가입 성공!');
      navigate('/loginmain');
    } else {
      alert('회원가입 실패!');
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
        <input
          type="password"
          className={styles["login-input"]}
          placeholder="비밀번호확인"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <div className={styles["button-container"]}>
          <button className={styles["signin-button"]} onClick={() => navigate("/loginmain")}>취소</button>
          <button className={styles["login-button"]} onClick={handleSignup}>확인</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
