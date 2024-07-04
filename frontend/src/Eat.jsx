import React, { useState, useEffect } from 'react';
import styles from './eat.module.css';
import { useNavigate } from 'react-router-dom';
import null_image from './asset/no-image.svg'
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { useCal } from './calContext';

const Eat = () => {
    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = useState(false);

    const [mealData, setMealData] = useState({ breakfast: '', lunch: '', dinner: '' });

    var date = new Date();

    const handleLogout = () => {
        sessionStorage.clear();
        getAuth().signOut();
        navigate('/');
    };

    const { currentMonth, currentDay, currentYear, setCurrentMonth, setCurrentYear, setCurrentDay } = useCal();

    const months = [
      "1월", "2월", "3월", "4월", "5월", "6월",
      "7월", "8월", "9월", "10월", "11월", "12월"
    ];
    
    const days = [
      "일", "월", "화", "수", "목", "금", '토'
    ]

    const handlePreviousDay = () => {
      if (currentMonth === 0 && currentDay === 1) {
        // 1월 1일에서 이전 날짜로 이동하는 경우
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
        setCurrentDay(31);
      } else if (currentDay === 1) {
        // 월의 첫날에서 이전 날짜로 이동하는 경우
        setCurrentMonth(currentMonth - 1);
        setCurrentDay(new Date(currentYear, currentMonth, 0).getDate());
      } else {
        // 일반적인 이전 날짜로 이동하는 경우
        setCurrentDay(currentDay - 1);
      }
    };
    
    const handleNextDay = () => {
      const lastDayOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
      if (currentMonth === 11 && currentDay === lastDayOfCurrentMonth) {
        // 12월 31일에서 다음 날짜로 이동하는 경우
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
        setCurrentDay(1);
      } else if (currentDay === lastDayOfCurrentMonth) {
        // 월의 마지막 날에서 다음 날짜로 이동하는 경우
        setCurrentMonth(currentMonth + 1);
        setCurrentDay(1);
      } else {
        // 일반적인 다음 날짜로 이동하는 경우
        setCurrentDay(currentDay + 1);
      }
    };

    const handleCal = () => {
      const today = new Date();
      setCurrentYear(today.getFullYear());
      setCurrentMonth(today.getMonth());
      navigate("/Cal")
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

      useEffect(() => {
        const fetchData = async () => {
          const date = `${currentYear}${String(currentMonth + 1).padStart(2, '0')}${String(currentDay).padStart(2, '0')}`;
          try {
            const email = getEmailFromSessionStorage();
            console.log(`Fetching data for date: ${date}`); // 날짜 확인용 콘솔 로그
            const response = await axios.get(`https://whattoday.kro.kr:3001/mealdata?email=${email}&date=${date}`);
            console.log('Response data:', response.data); // 응답 데이터 확인용 콘솔 로그
            const data = response.data;
    
            if (data) {
              const formattedData = {
                breakfast: data.breakfast.map(item => item.DDISH_NM).join('<br>'),
                lunch: data.lunch.map(item => item.DDISH_NM).join('<br>'),
                dinner: data.dinner.map(item => item.DDISH_NM).join('<br>'),
              };
              setMealData(formattedData);
            } else {
              setMealData({
                breakfast: 'No data',
                lunch: 'No data',
                dinner: 'No data',
              });
            }
          } catch (error) {
            console.error("Error fetching meal data:", error);
          }
        };
    
        fetchData();
      }, [currentDay, currentMonth, currentYear]);

    return (
        <div>
            <header className={styles.all}>
                <div className={styles['head-box']}>
                    <div className={styles['head-text']} onClick={() => navigate("/mainlin")}><div className={styles['head-text-img']}></div><div className={styles.click}>오늘 뭐해?</div></div>
                      <div className={styles['header-right-text-box']}>
                          <div className={styles['header-right-text']} onClick={handleCal}><div className={styles.click}>캘린더</div></div>
                          <div className={styles['header-right-text']} onClick={() => navigate("/Eat")}><div className={styles.click}>급식표</div></div>
                          <div className={styles['header-right-text']} onClick={() => navigate("/Schedule")}><div className={styles.click}>시간표</div></div>
                      </div>
                  </div>
                  <div className={styles['header-right-image-box']}>
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
                <div className={styles['eat-date-container']}>
                    <div className={styles["angle-left"]} onClick={() => handlePreviousDay()}>
                        <i className="xi-angle-left xi-x"></i>
                      </div>
                        <span>{currentYear}년 {months[currentMonth]} {currentDay}일 {days[(new Date(currentYear, currentMonth, currentDay)).getDay()]}요일</span>
                      <div className={styles["angle-right"]} onClick={() => handleNextDay()}>
                        <i className="xi-angle-right xi-x"></i>
                      </div>
                </div>
                <br></br>
                <div className={styles['eat-value-container']}>
                  <div className={styles['eat-value-box']}>
                    <div className={styles['eat-value-title']}>아침</div>
                    <br></br>
                    <div className={styles['eat-value']} dangerouslySetInnerHTML={{ __html: mealData.breakfast }} />
                  </div>
                  <div className={styles['eat-value-box']}>
                    <div className={styles['eat-value-title']}>점심</div>
                    <br></br>
                    <div className={styles['eat-value']} dangerouslySetInnerHTML={{ __html: mealData.lunch }} />
                  </div>
                  <div className={styles['eat-value-box']}>
                    <div className={styles['eat-value-title']}>저녁</div>
                    <br></br>
                    <div className={styles['eat-value']} dangerouslySetInnerHTML={{ __html: mealData.dinner }} />
                  </div>
                </div>
                <div className={styles.allergy}>
                  알레르기 정보 : 1.난류 2.우유 3.메밀 4.땅콩 5.대두 6.밀 7.고등어 8.게 9.새우 10.돼지고기 
                  11.복숭아 12.토마토 13.아황산류 14.호두 15.닭고기16.쇠고기
                  17.오징어 18.조개류(굴,전복,홍합 포함) 19.잣
                </div>
            </section>
        </div>
    );
}

export default Eat;
