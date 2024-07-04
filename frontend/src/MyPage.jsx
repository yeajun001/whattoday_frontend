import React, { useState, useEffect } from 'react';
import styles from './MyPage.module.css';
import { useNavigate } from 'react-router-dom';
import null_image from './asset/no-image.svg'
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import Select from 'react-select';
import './MyPage.css'
import ProfileModal from './ProfileModal';


const MyPage = () => {
    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    const [grade, setGrade] = useState('');
    const [Class, setClass] = useState('');
    const [num, setNum] = useState('');

    const [modal, setModal] = useState(false);

      const [offices, setOffices] = useState([
        { value: 'K10', label: '강원도교육청' },
        { value: 'F10', label: '광주광역시교육청' },
        { value: 'D10', label: '대구광역시교육청' },
        { value: 'G10', label: '대전광역시교육청' },
        { value: 'J10', label: '경기도교육청' },
        { value: 'R10', label: '경상북도교육청' },
        { value: 'S10', label: '경상남도교육청' },
        { value: 'M10', label: '충청북도교육청' },
        { value: 'N10', label: '충청남도교육청' },
        { value: 'E10', label: '인천광역시교육청' },
        { value: 'H10', label: '울산광역시교육청' },
        { value: 'B10', label: '서울특별시교육청' },
        { value: 'P10', label: '전북특별자치도교육청' },
        { value: 'Q10', label: '전라남도교육청' },
        { value: 'C10', label: '부산광역시교육청' },
        { value: 'T10', label: '제주특별자치도교육청' },
        { value: 'I10', label: '세종특별자치시교육청' },
      ]);

      const [selectedOffice, setSelectedOffice] = useState(null);
      const [schools, setSchools] = useState([]);
      const [name, setName] = useState('');
      const [selectedSchool, setSelectedSchool] = useState({ value: '', code: '' });
      const [profile, setProfile] = useState(null);


    const handleLogout = () => {
      sessionStorage.clear();
      getAuth().signOut();
      navigate('/');
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
      };

    const handleSaveImage = (imagePath) => {
        setProfileImage(imagePath);
      };

    const toggleModal = () => {
      setModal(!modal);
    };
  
    useEffect(() => {
      if (selectedOffice) {
        fetchSchools(selectedOffice.value, 1);
      }
    }, [selectedOffice]);
    
    useEffect(() => {
      console.log("선택된 학교 상태 업데이트:", selectedSchool);
    }, [selectedSchool]);
    
    const fetchSchools = async (office, page) => {
      try {
        const response = await axios.post('https://whattoday.kro.kr:3001/getSchools', { office, page, limit: 3000 });
        const formattedData = response.data.map(school => ({
          학교명: school.학교명,
          행정표준코드: school.행정표준코드
        }));
    
        if (page === 1) {
          setSchools(formattedData);
        } else {
          setSchools((prevSchools) => [...prevSchools, ...formattedData]);
        }
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    };
    
    const handleOfficeChange = (selectedOption) => {
      setSelectedOffice(selectedOption);
      setSchools([]);
      setSelectedSchool(null);
    };
    
    const handleSchoolChange = (selectedOption) => {
      const selectedSchoolData = schools.find(school => school.학교명 === selectedOption.value);
      if (selectedSchoolData) {
        setSelectedSchool({ value: selectedOption.value, code: selectedSchoolData.행정표준코드 });
        console.log("선택된 학교:", selectedSchoolData); // 디버깅 용도
      } else {
        console.error("선택된 학교 데이터를 찾을 수 없습니다.");
      }
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
    
    const fetchProfileData = async (email) => {
      try {
        const response = await axios.get('https://whattoday.kro.kr:3001/profile', {
          params: { email }
        });
        const data = response.data;
        console.log('Fetched profile data:', data); // 디버깅 용도
        if (data) {
          setProfile(data); // 가져온 데이터를 상태에 저장
          setSelectedOffice(offices.find((office) => office.value === data.Office)); // Office 상태 업데이트
          setSelectedSchool({ value: data.schoolName, code: data.schoolCode }); // schoolCode로 수정
          setGrade(data.grade); // 학년 상태 업데이트
          setClass(data.Class); // 반 상태 업데이트
          setNum(data.num); // 번호 상태 업데이트
          setName(data.Name); // name 상태 업데이트, null 값을 빈 문자열로 대체
          setProfileImage(data.photoURL); // photoURL 상태 업데이트
        } else {
          console.error('데이터가 없습니다:', data);
        }
      } catch (error) {
        console.error('데이터 가져오기 중 오류 발생:', error);
        alert('데이터 가져오기에 실패했습니다.');
      }
    };
    
    const updateProfileData = async (email, Office, schoolName, schoolCode, grade, Class, num, name) => {
      try {
        const response = await axios.post('https://whattoday.kro.kr:3001/profile', {
          email, Office, schoolName, schoolCode, grade, Class, num, name
        });
        setProfile(response.data); // 업데이트된 데이터를 상태에 저장
        alert('프로필이 성공적으로 업데이트되었습니다.');
        setModal(!modal);
        window.location.reload();
      } catch (error) {
        console.error('프로필 업데이트 중 오류 발생:', error);
      }
    };
    
    const handleSubmit = async (event) => {
      event.preventDefault();
      const email = getEmailFromSessionStorage();
      if (!email) return;
    
      console.log("업데이트 요청 데이터:", {
        email,
        Office: selectedOffice ? selectedOffice.value : '',
        schoolName: selectedSchool ? selectedSchool.value : '',
        schoolCode: selectedSchool ? selectedSchool.code : '',
        grade,
        Class,
        num,
        name
      });
    
      await updateProfileData(
        email,
        selectedOffice ? selectedOffice.value : '',
        selectedSchool ? selectedSchool.value : '',
        selectedSchool ? selectedSchool.code : '',
        grade,
        Class,
        num,
        name
      );
    };
    
    const fetchData = async () => {
      const email = getEmailFromSessionStorage();
      if (!email) return;
    
      await fetchProfileData(email);
    };
    
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
    
    useEffect(() => {
      fetchData();
    }, []);
    
    const textover = (text) => {
      return text && text.length >= 12 ? styles['small-font'] : '';
    };
    
    const schoolOptions = schools.map((school) => ({ value: school.학교명, label: school.학교명 }));

    useEffect(() => {
      const fetchProfileImage = async () => {
        const email = getEmailFromSessionStorage();
  
        if (!email) {
          console.error('Error: Email not found in session storage.');
          return;
        }
  
        try {
          console.log(`Fetching image for email: ${email}`); // 디버깅 용도
          const response = await axios.get(`https://whattoday.kro.kr:3001/getimg?email=${encodeURIComponent(email)}`, {
            responseType: 'blob' // 이미지 데이터를 blob 형태로 받음
          });
          console.log('Response:', response); // 디버깅 용도
          const imageUrl = URL.createObjectURL(response.data);
          setProfileImage(imageUrl);
        } catch (error) {
          console.error('Error fetching profile image:', error);
        }
      };
    
      fetchProfileImage();
  }, []);

    return (
        <div>
            <header className={styles.all}>
                <div className={styles['head-box']}>
                    <div className={styles['head-text']}>
                    <div className={styles["head-text-img"]}></div>
                    <a href="/mainlin" className={styles.click}>오늘 뭐해?</a>
                </div>
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
                            className={styles['main-profile-image']}
                            src={profileImage}
                            alt='profile_image'
                        />
                        </div>
                      </div>
                    </div>
                </div>
            </header>
            <section className={styles['main-all']}>
                <div className={styles['main-background']}>
                  <div className={styles['main-box']}>
                  {showDropdown && (
                      <div className={styles['profile-menu']}>
                        <div class={styles["profile-menu-item"]} onClick={() => navigate('/MyPage')}>
                            프로필 보기
                        </div>
                        <div class={styles["profile-menu-item"]} onClick={handleLogout}>
                            로그아웃
                        </div>
                      </div>
                  )}
                      <div className={styles['main-profile-box']}>
                          <img
                            className={styles['main-profile-image']}
                            src={profileImage}
                            alt='profile_image'
                            onClick={handleOpenModal}
                          />
            </div>
                      <div className={styles['main-profile-name']}>
                      {profile ? (
                        <div>{profile.Name}</div>
                      ) : (
                        <span>로딩중..</span>
                      )}
                      </div>
                      <div className={styles['center-line']}>
                        
                      </div>
                    <div className={styles['main-name']}>
                            <span>Name</span>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className={styles['main-name-print']}
                            />
                            <button onClick={handleSubmit} className={styles.updateButton}>이름 변경</button>
                        <div className={styles['horizontal-line']}></div>
                            </div>
                        <div className={styles['main-school']}>
                            <span>School</span>
                            {profile ? (
                              <div className={`${styles['main-school-print']} ${textover(profile.schoolName)}`}>{profile.schoolName}</div>
                            ) : (
                              <div className={styles['main-school-print']}>로딩중...</div>
                            )}
                            
                            <div className={styles['school-button']}>
                            <div className={styles['click']} onClick={toggleModal}><div className={styles['school-select-button']}>학교검색</div></div>
                            {modal &&(
                              <div className={styles.modal}>
                                <div className={styles.overlay}>
                                  <div className={styles['modal-content']}>
                                    <div className={styles['school-change']}>
                                      <div className={styles['school-change-container']}>
                                      <label htmlFor="Office" className={styles.Officename}>교육청명:</label>
                                          <Select
                                            name="Office"
                                            options={offices}
                                            onChange={handleOfficeChange}
                                            className="Office"
                                            classNamePrefix="Office"
                                            value={selectedOffice}
                                            placeholder="--교육청을 선택해주세요--"
                                          />

                                      <label htmlFor="school" className={styles.schoolname}>학교명:</label>
                                      <Select
                                          name="school"
                                          options={schoolOptions}
                                          onChange={handleSchoolChange}
                                          className="school"
                                          classNamePrefix="school"
                                          value={selectedSchool ? { value: selectedSchool.value, label: selectedSchool.value } : null}
                                          placeholder="--학교를 선택해주세요--"
                                          isSearchable
                                        />
                                      </div>
                                    <div className={styles['school-info-container']}>
                                      <label htmlFor="grade" className={styles.gradename}>학년:</label>
                                      <select 
                                        name="grade"
                                        className={styles.grade}
                                        id='grade'
                                        value={grade}
                                        onChange={(e) => setGrade(e.target.value)}
                                      >
                                        <option value="" disabled selected>학년</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                      </select>
                                      <label htmlFor="class" className={styles.classname}>반:</label>
                                      <select 
                                         name="class"
                                         className={styles.class}
                                         id='class'
                                         value={Class}
                                         onChange={(e) => setClass(e.target.value)}
                                      >
                                        <option value="" disabled selected>반</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                        <option value="13">13</option>
                                        <option value="14">14</option>
                                        <option value="15">15</option>
                                        <option value="16">16</option>
                                        <option value="17">17</option>
                                        <option value="18">18</option>
                                      </select>
                                        <label htmlFor="num" className={styles.numname}>번호:</label>
                                        <select 
                                          name="num"
                                          className={styles.num}
                                          id='num'
                                          value={num}
                                          onChange={(e) => setNum(e.target.value)}
                                        >
                                          <option value="" disabled selected>번호</option>
                                          <option value="1">1</option>
                                          <option value="2">2</option>
                                          <option value="3">3</option>
                                          <option value="4">4</option>
                                          <option value="5">5</option>
                                          <option value="6">6</option>
                                          <option value="7">7</option>
                                          <option value="8">8</option>
                                          <option value="9">9</option>
                                          <option value="10">10</option>
                                          <option value="11">11</option>
                                          <option value="12">12</option>
                                          <option value="13">13</option>
                                          <option value="14">14</option>
                                          <option value="15">15</option>
                                          <option value="16">16</option>
                                          <option value="17">17</option>
                                          <option value="18">18</option>
                                          <option value="19">19</option>
                                          <option value="20">20</option>
                                          <option value="21">21</option>
                                          <option value="22">22</option>
                                          <option value="23">23</option>
                                          <option value="24">24</option>
                                          <option value="25">25</option>
                                          <option value="26">26</option>
                                          <option value="27">27</option>
                                          <option value="28">28</option>
                                          <option value="29">29</option>
                                          <option value="30">30</option>
                                        </select>
                                      </div>
                                    </div>
                                      <div className={styles.btn}>
                                        <button onClick={handleSubmit} className={styles.save}><div className={styles.savetext}>저장</div></button>
                                        <button onClick={toggleModal} className={styles.cancel}><div className={styles.canceltext}>취소</div></button>
                                      </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            </div>
                        <div className={styles['horizontal-school-line']}></div>
                            </div>
                    
                        <div className={styles['main-class']}>
                            <span>Class</span>
                        {grade && Class && num ? (
                            <div className={styles['main-class-print']}>
                            {grade}학년 {Class}반 {num}번
                            </div>
                   ) : (
                    <div className={styles['main-class-print']}>로딩 중...</div>
                  )}
                        <div className={styles['horizontal-class-line']}></div>
                        <div className={styles['main-account']}>
                            <div className={styles['google-acount']}>
                                <div className={styles['google-logo']}></div>
                            </div>
                            <div className={styles['github-acount']}>
                                <div className={styles['github-logo']}></div>
                            </div>
                        </div>
                    </div>
                      <div className={styles['bottom-button']}>
                        <div className={styles['click']}><div className={styles['apply-button']} onClick={() => navigate('/mainlin')}>확인</div></div>
                      </div>
                  </div>
                </div>
            </section>
            <ProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveImage}
      />
        </div>
    );
}

export default MyPage;
