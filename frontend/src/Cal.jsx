import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import styles from './Cal.module.css';
import null_image from './asset/logo.png';
import Calendar from './caljs'
import { useCal } from './calContext';
import { getAuth } from 'firebase/auth';
import Datapicker from './datepicker'
import axios from 'axios';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Modal from 'react-modal';
import WeatherApp from './WeatherApp';

function Cal() {
    const navigate = useNavigate();
    
    const { currentMonth, currentYear, setCurrentMonth, setCurrentYear, setCurrentDay } = useCal();

    const [calendarName, setCalendarName] = useState('');

    const [calendarDate, setCalendarDate] = useState('');

    const [showDropdown, setShowDropdown] = useState(false);

    const [delModalOpen, setDelModalOpen] = useState(false);

    const [selectedSchedule, setSelectedSchedule] = useState(null);

    const [modal, setModal] = useState(false);

    const [schedules, setSchedules] = useState([]);

    const [currentIndex, setCurrentIndex] = useState(0);
    
    const [originalDate, setOriginalDate] = useState('');

    const handleLogout = () => {
      sessionStorage.clear();
      getAuth().signOut();
      navigate('/');
    };
  
    const toggleModal = () => {
      setModal(!modal);
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
    
    const handleAddSchedule = async () => {
      const email = getEmailFromSessionStorage();
    
      if (!email) {
        alert('오류 발생: 세션 스토리지에 이메일이 없습니다.');
        return;
      }
    
      try {
        const response = await axios.post('https://whattoday.kro.kr:3001/personal-addschedule', {
          email: email,
          calendar_name: calendarName,
          calendar_date: calendarDate,
        });
        console.log(response.data);
    
        if (response.status === 200) {
          window.location.reload();
        } else {
          alert("일정 추가에 실패했습니다.");
        }
    
      } catch (error) {
        console.error('Error adding schedule:', error);
      }
      toggleModal();
    };
  
    useEffect(() => {
      if (modal) {
        document.body.classList.add(styles['active-modal']);
      } else {
        document.body.classList.remove(styles['active-modal']);
      }
    }, [modal]);

    const handleEat = () => {
      const today = new Date();
      setCurrentYear(today.getFullYear());
      setCurrentMonth(today.getMonth());
      setCurrentDay(today.getDay());
      navigate("/Eat")
      console.log(today, currentYear, currentMonth);
    }

    useEffect(() => {
      const email = getEmailFromSessionStorage();
      axios.get('https://whattoday.kro.kr:3001/personaldata', { params: { email } })
        .then(response => {
          const formattedSchedules = response.data.map(item => {
            const dateStr = item.calendar_date;
            const year = dateStr.substring(0, 4); // 연도 추출
            const month = parseInt(dateStr.substring(4, 6), 10); // 월 추출
            const day = parseInt(dateStr.substring(6, 8), 10); // 일 추출
  
            console.log(`Original date: ${dateStr}, Year: ${year}, Month: ${month}, Day: ${day}`);
  
            if (isNaN(year) || isNaN(month) || isNaN(day)) {
              console.error('Invalid date format:', dateStr);
              return item; // 날짜 변환에 실패하면 원래 데이터를 반환
            }
  
            const formattedDate = `${month}.${day}`;
            const formattedOriginalDate = `${year}-${month}-${day}`;
  
            return {
              ...item,
              calendar_date: formattedDate,
              original_date: formattedOriginalDate, // 원래 연도 정보를 포함한 날짜
              month,
              day,
              year
            };
          }).filter(item => item.month === currentMonth + 1) // 현재 월의 일정만 필터링
            .sort((a, b) => {
              if (a.day === b.day) {
                return a.day - b.day;
              }
              return a.day - b.day;
            });
  
          setSchedules(formattedSchedules);
        })
        .catch(error => {
          console.error('Error fetching personal data:', error);
        });
    }, [currentMonth, currentYear]);
  
    const handleNext = () => {
      if (currentIndex + 4 < schedules.length) {
        setCurrentIndex(currentIndex + 4);
      }
    };
  
    const handlePrevious = () => {
      if (currentIndex - 4 >= 0) {
        setCurrentIndex(currentIndex - 4);
      }
    };

    const handleScheduleClick = (schedule) => {
      setSelectedSchedule(schedule);
      setDelModalOpen(true);
    };
    
    const handleCloseSchedule = () => {
      setDelModalOpen(false);
      setSelectedSchedule(null);
    };

    useEffect(() => {
      if (selectedSchedule && selectedSchedule.original_date) {
        setOriginalDate(selectedSchedule.original_date);
      }
    }, [selectedSchedule]);
    
    const confirmDelete = async () => {
      try {
        const response = await axios.post('https://whattoday.kro.kr:3001/personal-delschedule', {
          email: getEmailFromSessionStorage(),
          calendar_name: selectedSchedule.calendar_name,
          calendar_date: selectedSchedule.original_date, // 연도 정보를 포함한 날짜로 삭제 요청
        });
        if (response.status === 200) {
          console.log('Schedule deleted successfully');
          window.location.reload();
        } else {
          console.error('Failed to delete schedule');
        }
      } catch (error) {
        console.error('Error:', error);
      }
      handleCloseSchedule();
    };

    return (
        <div>
            <header className={styles.all}>
                <div className={styles['head-box']}>
                    <div className={styles['head-text']} onClick={() => navigate("/mainlin")}><div className={styles['head-text-img']}></div><div className={styles.click}>오늘 뭐해?</div></div>
                      <div className={styles['header-right-text-box']}>
                          <div className={styles['header-right-text']} onClick={() => navigate("/Cal")}><div className={styles.click}>캘린더</div></div>
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
            <section>
            <div className={styles['cal-schedule']}>
              <div className={styles['cal-mon-schedule']}> 
              {currentMonth + 1}월의 일정들
                  </div>
                  <div className={styles['cal-personal-schedule-text']}>
                    개인일정
                  </div>
                    <div className={styles['personal-btn']}>
                      <div className={styles['left-button']} onClick={handlePrevious}><ArrowBackIosNewIcon style={{ color: '#000000' }} /></div>
                      <div className={styles['right-button']} onClick={handleNext}><ArrowForwardIosIcon style={{ color: '#000000' }} /></div>
                    </div>
                  <div className={styles['cal-personal-schedule-bar']}></div>
                    <div className={styles['schedule-wrapper']}>
                        <div className={styles['schedule-container']}>
                          {schedules.slice(currentIndex, currentIndex + 4).map((schedule, index) => (
                            <div key={index} className={styles['cal-personal-schedule']} onClick={() => handleScheduleClick(schedule)}>
                              <div className={styles['cal-personal-schedule-date']}>
                                {schedule.calendar_date}
                              </div>
                              <div className={styles['cal-personal-schedule-name']}>
                                {schedule.calendar_name}
                              </div>
                            </div>
                          ))}
                        </div>
                    </div>
                      <Modal
                        isOpen={delModalOpen}
                        onRequestClose={handleCloseSchedule}
                        contentLabel="Delete Schedule Modal"
                        className={styles.personaldelmodal}
                      >
                        <div className={styles['personaldelmodal-really']}>
                          <div className={styles['personaldelmodal-title']}>일정 삭제</div>
                          <div>정말로 일정을 삭제하시겠습니까?</div>
                          <div>날짜: {originalDate}</div>
                          <div className={styles['personaldelmodal-btn']}>
                            <div onClick={confirmDelete} className={styles['personaldelmodal-btn-left']}>삭제</div>
                            <div onClick={handleCloseSchedule} className={styles['personaldelmodal-btn-right']}>취소</div>
                          </div>
                        </div>
                      </Modal>
              </div>
              <div className={styles['cal-background']}>
                <div className={styles['cal-add-button']} onClick={toggleModal}>
                  일정 추가
                </div>
                  <input type="checkbox" id="menuicon" />
                  <label htmlFor="menuicon">
                    <span></span>
                    <span></span>
                    <span></span>
                  </label>
                  <div className={styles.sidebar}>
                    <div id="weatherContainer">
                      <WeatherApp />
                    </div>
                  </div>
                {modal &&(
                  <div className={styles.modal}>
                    <div className={styles.overlay}>
                      <div className={styles['modal-content']}>
                        <div className={styles['modal-title']}>일정 추가하기</div>
                        <div className={styles['modal-sc-name']}>일정 이름</div>
                        <div className={styles['modal-sc-name-div']}>
                        <input
                          className={styles['modal-sc-name-input']}
                          maxLength="12"
                          type="text"
                          value={calendarName}
                          onChange={(e) => setCalendarName(e.target.value)}
                        /></div>
                        <div className={styles['modal-sc-date']}>날짜</div>
                        <div className={styles['modal-sc-date-div']}>
                          <Datapicker onChange={(date) => setCalendarDate(date)}/>
                        </div>
                        <div onClick={handleAddSchedule} className={styles.check}><div className={styles.checktext}>저장</div></div>
                        <div onClick={toggleModal} className={styles.cancel}><div className={styles.canceltext}>취소</div></div>
                      </div>
                    </div>
                  </div>
                )}
                  <div className={styles.weekdays}>
                    <div className={styles.day}><span className={styles.sun}>일</span></div>
                    <div className={styles.day}><span className={styles.onweek}>월</span></div>
                    <div className={styles.day}><span className={styles.onweek}>화</span></div>
                    <div className={styles.day}><span className={styles.onweek}>수</span></div>
                    <div className={styles.day}><span className={styles.onweek}>목</span></div>
                    <div className={styles.day}><span className={styles.onweek}>금</span></div>
                    <div className={styles.day}><span className={styles.sat}>토</span></div>
                  </div>
                    <Calendar />
              </div>
            </section>
          </div>
    );
}

export default Cal;