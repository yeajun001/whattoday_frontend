import React, { useState, useEffect } from "react";
import styles from './Cal.module.css';
import { useCal } from "./calContext";
import axios from "axios";
import uploadIcon from "./asset/upload.png"
import saveIcon from "./asset/save.png"

const Calendar = () => {
  const { currentMonth, currentYear, setCurrentMonth, setCurrentYear } = useCal();
  
  const [calendarDays, setCalendarDays] = useState([]);
  const [schoolSchedules, setSchoolSchedules] = useState({});
  const [personalSchedules, setPersonalSchedules] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const initialDate = new Date();
    return isNaN(initialDate.getTime()) ? new Date() : initialDate;
  });

  const [diaryEntries, setDiaryEntries] = useState({});
  const [diaryContent, setDiaryContent] = useState('');

  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);

  const months = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];


  const processScheduleData = (data, isPersonal = false) => {
    return data.reduce((acc, curr) => {
      const dateKey = isPersonal ? curr.calendar_date : curr.AA_YMD; // 'YYYYMMDD' 형식
      const title = isPersonal ? curr.calendar_name : curr.EVENT_NM;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push({ title });
      return acc;
    }, {});
  };
  
  useEffect(() => {
    const fetchSchoolSchedules = async (email) => {
      try {
        const response = await axios.get("https://whattoday.kro.kr:3001/schooldata", {
          params: { email }
        });
        const data = response.data.SchoolSchedule[1].row;
        const schedulesByDate = processScheduleData(data);
        setSchoolSchedules(schedulesByDate);
      } catch (error) {
        console.error("일정 데이터를 불러오는데 실패했습니다.", error);
      }
    };
  
    const fetchPersonalSchedules = async (email) => {
      try {
        const response = await axios.get("https://whattoday.kro.kr:3001/personaldata", {
          params: { email }
        });
        const schedulesByDate = processScheduleData(response.data, true);
        setPersonalSchedules(schedulesByDate);
      } catch (error) {
        console.error("개인 일정을 불러오는데 실패했습니다.", error);
      }
    };
  
    const fetchData = async () => {
      const googleUserEmail = sessionStorage.getItem('googleUseremail');
      const githubUserEmail = sessionStorage.getItem('githubUseremail');
      const email = googleUserEmail || githubUserEmail; // 어느 이메일이든 사용
  
      if (!email) {
        console.error("이메일이 없습니다.");
        return;
      }
  
      await Promise.all([
        fetchSchoolSchedules(email),
        fetchPersonalSchedules(email)
      ]);
    };
  
    fetchData();
  }, []);

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

  useEffect(() => {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();

    const renderCalendar = () => {
      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
      const prevLastDay = new Date(currentYear, currentMonth, 0).getDate();
      const nextDays = 6 - new Date(currentYear, currentMonth + 1, 0).getDay();
  
      let days = [];
      
      for (let x = firstDay; x > 0; x--) {
        days.push(<div key={`prev${x}`} className={`${styles.day} ${styles.prev}`}><span>{prevLastDay - x + 1}</span></div>);
      }
  
      for (let i = 1; i <= lastDay; i++) {
        let dayClass = `${styles.day}`;
        const currentDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`.replace(/-/g, ''); 
        const schoolDaySchedules = schoolSchedules[currentDate] || [];
        const personalDaySchedules = personalSchedules[currentDate] || [];

        if (currentYear === todayYear && currentMonth === todayMonth && i === todayDate) {
          dayClass = `${styles.day}  ${styles.today}`;
        }
        
        const dayOfWeek = new Date(currentYear, currentMonth, i).getDay();
        if (dayOfWeek === 0) {
          dayClass = `${styles.day} ${styles.sun}`;
        } else if (dayOfWeek === 6) {
          dayClass = `${styles.day} ${styles.sat}`;
        }

        days.push(
          <div key={`current${i}`} className={dayClass} onClick={() => handleDayClick(i)}>
            <span>{i}</span>
            <div className={styles.schedule}>
              {schoolDaySchedules.map((schedule, index) => {
                if (schedule.title === "토요휴업일") return null;
                const scheduleTitle = schedule.title === "기독탄신일(성탄절)" ? "성탄절" : schedule.title;
                const schoolScheduleDisplay = scheduleTitle.length >= 6 ? scheduleTitle.slice(0, 4) + "..." : scheduleTitle;
                return (
                  <div key={index} className={styles.schoolschedulebackground}>
                    <div className={styles.schoolschedule}></div>
                    <div className={styles.schoolscheduleText}>{schoolScheduleDisplay}</div>
                  </div>
                );
              })}
              {personalDaySchedules.map((schedule, index) => {
                const personalScheduleDisplay = schedule.title.length >= 6 ? schedule.title.slice(0, 4) + "..." : schedule.title;
                return (
                  <div key={index} className={styles.personalschedulebackground}>
                    <div className={styles.personalschedule}></div>
                    <div className={styles.personalscheduleText}>{personalScheduleDisplay}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
  
      for (let j = 1; j <= nextDays; j++) {
        days.push(<div key={`next${j}`} className={`${styles.day} ${styles.next}`}><span>{j}</span></div>);
      }
  
      setCalendarDays(days);
    };

    renderCalendar();
  }, [currentMonth, currentYear, schoolSchedules, personalSchedules]);

  const formatDate = (date, forUpload = false) => {
    if (!date || isNaN(date.getTime())) {
        date = new Date();
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    if (forUpload) {
        return `${year}-${month}-${day}`;
    } else {
        return `${year}년 ${month}월 ${day}일`;
    }
  };

  const handleDayClick = (day) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(selectedDate);
    setModalOpen(true);
  };
  

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDate(null);
  };

  const handleDiaryChange = (e) => {
    setDiaryContent(e.target.value);
  };
  
  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
        alert('업로드할 파일을 선택해주세요.');
        return;
    }

    // 파일 타입 및 크기 확인 (예: 이미지 파일만 허용하고, 최대 5MB)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
    }

    const formData = new FormData();
    const date = selectedDate && !isNaN(selectedDate.getTime()) ? selectedDate : new Date();
    
    formData.append('file', file);
    formData.append('date', formatDate(date, true));
    
    const email = getEmailFromSessionStorage();
    if (!email) {
        console.error('Email is undefined or null.');
        alert('이메일을 확인할 수 없습니다. 다시 로그인 해주세요.');
        return;
    }
    
    formData.append('email', email);

    console.log('FormData contents:', Array.from(formData.entries())); // 디버깅용 로그
    
    try {
        setLoading(true);
        const response = await axios.post('https://whattoday.kro.kr:3001/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    
        console.log('File uploaded successfully:', response.data);
        fetchImageForDate(date, email);
    } catch (error) {
        console.error('Error uploading file:', error.response ? error.response.data : error.message);
        alert('파일 업로드 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
        setLoading(false);
    }
};


const fetchImageForDate = async (date, email) => {
    try {
        const email = getEmailFromSessionStorage();
        setLoading(true);
        const formattedDate = formatDate(date, true);
        const response = await axios.get(`https://whattoday.kro.kr:3001/image?date=${formattedDate}&email=${email}`);
        setImageSrc(response.data.imagePath);
    } catch (error) {
        console.error('Error fetching image:', error.response ? error.response.data : error.message);
        setImageSrc(null);
    } finally {
        setLoading(false);
    }
};


  useEffect(() => {
    if (modalOpen) {
        fetchImageForDate(selectedDate);
        fetchDiaryEntry(formatDate(selectedDate, true));
    }
  }, [selectedDate, modalOpen]);

  useEffect(() => {
    const modalState = localStorage.getItem('modalOpen');
    if (modalState === 'true') {
        setModalOpen(true);
        localStorage.removeItem('modalOpen'); // 모달 상태를 가져온 후 삭제
    }
  }, []);

  const saveDiaryEntry = async () => {
    const date = formatDate(selectedDate, true);
    const email = getEmailFromSessionStorage();
  
    if (!email) {
      console.error('Email is missing');
      return; // 이메일이 없으면 함수 종료
    }
  
    try {
      if (diaryEntries[date]) {
        // 일기 항목이 이미 존재하면 업데이트
        await updateDiaryEntry(date, diaryContent, email);
      } else {
        // 일기 항목이 존재하지 않으면 추가
        await addDiaryEntry(date, diaryContent, email);
      }
  
      // 상태 업데이트
      updateDiaryState(date, diaryContent);
  
      console.log('Diary entry saved successfully');
    } catch (error) {
      console.error('Failed to save diary entry:', error);
    }
  };
  
  const fetchDiaryEntry = async (date) => {
    try {
      const email = getEmailFromSessionStorage();
      if (!email) return; // 이메일이 없으면 함수 종료
  
      const url = `https://whattoday.kro.kr:3001/diary?date=${date}&email=${email}`;
      console.log('Request URL:', url); // 요청 URL 로그 출력
  
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        updateDiaryState(date, data.content || '');
        console.log('Class:', data.Class, 'Grade:', data.grade, 'schoolCode:', data.schoolCode); // Class와 Grade 로그 출력
      } else {
        console.error('No diary entry found for the given date');
        setDiaryContent('');
      }
    } catch (error) {
      console.error('Error:', error);
      setDiaryContent('');
    }
  };
  
  const addDiaryEntry = async (date, content, email) => {
    try {
      const response = await fetch('https://whattoday.kro.kr:3001/diary/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, content, email }),
      });
  
      if (response.ok) {
        console.log('Diary entry added successfully');
        // Add가 성공한 후에 update를 호출하도록 함
        await updateDiaryEntry(date, content, email);
      } else {
        console.error('Failed to add diary entry');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const updateDiaryEntry = async (date, content, email) => {
    try {
      const requestBody = { date, content, email };
      console.log('Request Body:', requestBody); // 요청 본문 로그 출력
  
      console.log('Before fetch call');
      const response = await fetch('https://whattoday.kro.kr:3001/diary/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      console.log('After fetch call');
  
      const responseData = await response.json();
  
      if (response.ok) {
        console.log('Diary entry updated successfully:', responseData);
      } else {
        console.error('Failed to update diary entry:', response.statusText, responseData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  const updateDiaryState = (date, content) => {
    setDiaryEntries({
      ...diaryEntries,
      [date]: content,
    });
    setDiaryContent(content);
  };  

  return (
    <div>
      <div className={styles['cal-background-height']}>
        <div className={styles['cal-mon-year']}>
          <div className={styles["angle-left"]} onClick={() => {
            if(currentMonth === 0) {
              setCurrentMonth(11);
              setCurrentYear(currentYear - 1);
            } else {
              setCurrentMonth(currentMonth - 1);
            }
          }}>
            <i className="xi-angle-left xi-x"></i>
          </div>
          <span>{currentYear}년 {months[currentMonth]}</span>
          <div className={styles["angle-right"]} onClick={() => {
            if(currentMonth === 11) {
              setCurrentMonth(0);
              setCurrentYear(currentYear + 1);
            } else {
              setCurrentMonth(currentMonth + 1);
            }
          }}>
            <i className="xi-angle-right xi-x"></i>
          </div>
        </div>
        {modalOpen && (
          <Modal2 onClose={closeModal}>
              <div className={styles['Diary-background']}>
                  {imageSrc && <img width="100%" src={`https://whattoday.kro.kr:3001${imageSrc}`} alt="Preview" className={styles.image} />}
                  <label htmlFor="file">
                    <div className={styles["btn-upload"]}><img src={uploadIcon} alt="upload" className={styles.uploadbtnimg}></img>업로드</div>
                  </label>
                  <input 
                      className={styles.diaryinput}
                      accept="image/*"
                      multiple={false}
                      type="file"
                      id="file"
                      onChange={onUpload}
                      name="file"
                  />
                  <div className={styles['Diary-date-modal']}>
                      {formatDate(selectedDate)}
                  </div>
                  <textarea 
                  className={styles.diary}
                  value={diaryContent}
                  onChange={handleDiaryChange}
                  placeholder="다이어리 내용을 입력하세요"
                  />
                  <div onClick={saveDiaryEntry} className={styles.saveButton}><img src={saveIcon} alt="save" className={styles.savebtnimg}></img>저장</div>
              </div>
          </Modal2>
        )}
        <div className={styles.days}>
          {calendarDays}
        </div>
      </div>
    </div>
  );
}

const Modal2 = ({ children, onClose }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.closeButton} onClick={onClose}>X</div>
        {children}
      </div>
    </div>
  );
};

export default Calendar;
