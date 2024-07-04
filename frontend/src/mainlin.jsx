import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import styles from './mainlin.module.css';
import null_image from './asset/logo.png'
import { getAuth } from 'firebase/auth';
import axios from 'axios';


function Mainlin() {
    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
      sessionStorage.clear();
      getAuth().signOut();
      navigate('/');
    };

    const getEmailFromSessionStorage = () => {
        const googleUserEmail = sessionStorage.getItem('googleUseremail');
        const githubUserEmail = sessionStorage.getItem('githubUseremail');
      
        console.log('Google User Email:', googleUserEmail); // 디버깅 용도
        console.log('GitHub User Email:', githubUserEmail); // 디버깅 용도
      
        if (googleUserEmail) {
          return googleUserEmail;
        } else if (githubUserEmail) {
          return githubUserEmail;
        } else {
          console.error('오류 발생: 세션 스토리지에 이메일이 없습니다.');
          return null;
        }
      };
      

      const [imageUrl, setImageUrl] = useState(null);

      useEffect(() => {
        const fetchImage = async () => {
          const email = getEmailFromSessionStorage();
    
          if (email) {
            try {
              const response = await axios.get('https://whattoday.kro.kr:3001/getimg', {
                params: { email },
                responseType: 'blob',
              });
    
              const imageObjectURL = URL.createObjectURL(response.data);
              setImageUrl(imageObjectURL);
            } catch (error) {
              console.error('Error fetching the image:', error);
              setImageUrl(null_image);
            }
          }
        };
    
        fetchImage();
      }, []);
    
    return (
        <div>
            <header className={styles.all}>
                <div className={styles['head-box']}>
                    <div className={styles['head-text']} onClick={() => navigate("/mainlin")}><div className={styles['head-text-img']}></div><div className={styles.click}>오늘 뭐해?</div></div>
                      <div className={styles['header-right-text-box']}>
                          <div className={styles['header-right-text']} onClick={() => navigate("/Cal")}><div className={styles.click}>캘린더</div></div>
                          <div className={styles['header-right-text']} onClick={() => navigate("/Eat")}><div className={styles.click}>급식표</div></div>
                          <div className={styles['header-right-text']} onClick={() => navigate("/Schedule")}><div className={styles.click}>시간표</div></div>
                      </div>
                  </div>
                  <div className={styles['header-right-image-box']}>
                    <div className={styles['header-right-profile']} onClick={() => setShowDropdown(!showDropdown)}><div className={styles.click}>
                          <div className={styles['profile-box']}>
                            <img
                            className={styles['profile-image']}
                            src={imageUrl || null_image}
                            alt='profile_image'
                            />
                          </div>
                        </div>
                      </div>
                </div>
            </header>
            <section className={styles.all}>
                <div className={styles.main}>
                  {showDropdown &&(
                  <div className={styles['profile-menu']}>
                        <div className={styles["profile-menu-item"]} onClick={() => navigate('/MyPage')}>
                            프로필 보기
                        </div>
                        <div className={styles["profile-menu-item"]} onClick={handleLogout}>
                              로그아웃
                        </div>
                      </div>  
                    )}
                    <div className={styles['main-text']}>
                        <div className={styles['main-text-ani']}>어서오세요!</div>
                        <div className={styles['main-text-ani']}>저희 사이트에서 여러분들만의 캘린더를 만들어보세요!</div>
                        <div className={styles['cal-button']} onClick={() => navigate("/Cal")}>
                            <div className={styles['cal-text']}>
                                <div>캘린더로 이동</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles['main-icon']}>
                        <div className={styles['img-icon']}></div>
                    </div>
                </div>
            </section>
            <section className={styles['all']}>
                <div className={styles['sub-main']}>
                    <ul className={styles['sc-list']}>
                        <li className={styles['li-cal']} onClick={() => navigate("/Cal")}>
                            <div className={styles['li-cal-text-box']}>
                                <div className={styles['li-cal-title']}>
                                    캘린더
                                </div>
                                <div className={styles['li-cal-text']}>
                                    학사 일정을 알려주고 원하는 날짜에 문구를 남기고 사진을 넣을 수 있습니다.
                                </div>
                            </div>
                        </li>
                        <li className={styles['li-class']} onClick={() => navigate("/Schedule")}>
                            <div className={styles['li-class-text-box']}>
                                <div className={styles['li-class-title']}>
                                    시간표
                                </div>
                                <div className={styles['li-class-text']}>
                                    우리 반 시간표를 보여주고 그 날의 시간표를 왼쪽에 보여줍니다.
                                </div>
                            </div>
                        </li>
                        <li className={styles['li-eat']} onClick={() => navigate("/Eat")}>
                            <div className={styles['li-eat-text-box']}>
                                <div className={styles['li-eat-title']}>
                                    급식표
                                </div>
                                <div className={styles['li-eat-text']}>
                                    오늘의 급식을 보여주고 식단과 칼로리를 보여줍니다.
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>
            <section className={styles.all}>
                <div className={styles['sub2-main']}>
                </div>
            </section>
            <footer>
                <div className={styles['footer-main']}>
                    <div className={styles['footer-text']}>
                        <p>copyright all rights reserved.</p>
                    </div>

                </div>
            </footer>
        </div>
    );
}

export default Mainlin;
