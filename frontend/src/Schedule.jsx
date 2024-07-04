import React, { useState, useEffect } from 'react';
import styles from './schedule.module.css';
import { useNavigate } from 'react-router-dom';
import null_image from './asset/no-image.svg'
import { getAuth } from 'firebase/auth';
import { useCal } from './calContext';
import axios from 'axios';

const Schedule = () => {
    const navigate = useNavigate();
    
    const [showDropdown, setShowDropdown] = useState(false);

    const { setCurrentDay, setCurrentMonth, setCurrentYear } = useCal();

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
      
      const [timetable, setTimetable] = useState({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: []
      });
      
      useEffect(() => {
        const fetchTimetable = async () => {
          const email = getEmailFromSessionStorage();
          if (!email) {
            console.error('이메일이 없어 시간표를 가져올 수 없습니다.');
            return;
          }
      
          try {
            const response = await axios.get('https://whattoday.kro.kr:3001/timetabledata', {
              params: { email: email }
            });
      
            if (response.data) {
              const timetableData = Object.values(response.data).flat();
              const sortedTimetable = sortTimetableByDay(timetableData);
              setTimetable(sortedTimetable);
            } else {
              console.error('올바른 시간표 데이터를 찾을 수 없습니다.');
            }
          } catch (error) {
            console.error('시간표 데이터를 가져오는데 실패했습니다:', error);
          }
        };
      
        fetchTimetable();
      }, []);
      
      const sortTimetableByDay = (data) => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const sortedData = {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: []
        };
      
        data.forEach(item => {
          const date = new Date(item.ALL_TI_YMD.slice(0, 4), item.ALL_TI_YMD.slice(4, 6) - 1, item.ALL_TI_YMD.slice(6, 8));
          const day = date.getDay();
          if (day >= 1 && day <= 5) {
            const dayName = days[day - 1];
            sortedData[dayName][item.PERIO - 1] = { content: item.ITRT_CNTNT };
          }
        });
      
        return sortedData;
      };
      
      const renderTimetable = () => {
        const periods = ['1교시', '2교시', '3교시', '4교시', '점심시간', '5교시', '6교시', '7교시'];
      
        return periods.map((period, periodIndex) => {
          if (period === '점심시간') {
            return (
              <tr key={periodIndex}>
                <td>{period}</td>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, dayIndex) => (
                  <td key={dayIndex} className={styles.bottom}>
                    점심시간
                  </td>
                ))}
              </tr>
            );
          }
      
          const actualPeriodIndex = periodIndex > 4 ? periodIndex - 1 : periodIndex;
      
          return (
            <tr key={periodIndex}>
              <td>{period}</td>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, dayIndex) => (
                <td key={dayIndex} className={styles.bottom}>
                  {timetable[day][actualPeriodIndex] ? timetable[day][actualPeriodIndex].content : ''}
                </td>
              ))}
            </tr>
          );
        });
      };
      

      const handleEat = () => {
        const today = new Date();
        setCurrentYear(today.getFullYear());
        setCurrentMonth(today.getMonth());
        setCurrentDay(today.getDay());
        navigate("/Eat")
      }

      const handleCal = () => {
        const today = new Date();
        setCurrentYear(today.getFullYear());
        setCurrentMonth(today.getMonth());
        navigate("/Cal")
      }
    

    return (
        <div>
            <header className={styles.all}>
                <div className={styles['head-box']}>
                    <div className={styles['head-text']}>
                    <div className={styles["head-text-img"]}></div>
                    <a href="/mainlin" className={styles.click}>오늘 뭐해?</a>
                </div>
                    <div className={styles['header-right-text-box']}>
                        <div className={styles['header-right-text']} onClick={handleCal}><div className={styles.click}>캘린더</div></div>
                        <div className={styles['header-right-text']} onClick={handleEat}><div className={styles.click}>급식표</div></div>
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
            <div className={styles['schedule-background']}>
              <div className={styles['table-box']}>
                <table>
                    <thead>
                        <tr>
                          <th>시간</th>
                          <th>월</th>
                          <th>화</th>
                          <th>수</th>
                          <th>목</th>
                          <th>금</th>
                      </tr>
                  </thead>
                  <tbody>
                    {renderTimetable()}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
    );
}

export default Schedule;
