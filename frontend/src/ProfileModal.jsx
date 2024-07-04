import React, { useState, useRef } from 'react';
import axios from 'axios';
import styles from './ProfileModal.module.css';
import uploadimage from './asset/uploadimage.png';

const ProfileModal = ({ isOpen, onClose, onSave }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const dropAreaRef = useRef(null);

  // 세션 스토리지에서 이메일 가져오기
  const getEmailFromSessionStorage = () => {
    const googleUserEmail = sessionStorage.getItem('googleUseremail');
    const githubUserEmail = sessionStorage.getItem('githubUseremail');

    if (googleUserEmail) {
      return googleUserEmail;
    } else if (githubUserEmail) {
      return githubUserEmail;
    } else {
      console.error('오류 발생: 세션 스토리지에 이메일이 없습니다.');
      return null;
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      uploadImage(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      uploadImage(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    const email = getEmailFromSessionStorage();
    if (!email) return;
  
    try {
      const response = await axios.post('https://whattoday.kro.kr:3001/uploadimg', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Email': email
        }
      });
  
      console.log('서버 응답:', response.data); // 서버 응답 데이터 출력
  
      const filePath = response.data.filePath; // 예시로 두 가지 키를 사용
      if (filePath) {
        onSave(filePath);
        onClose();
        window.location.reload(); 
      } else {
        console.error('파일 경로가 응답 데이터에 없습니다.');
      }
    } catch (error) {
      console.error('파일 업로드 중 오류 발생', error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div
          className={styles.uploadimage}
          ref={dropAreaRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {selectedImage ? (
            <img src={selectedImage} alt="Selected" className={styles.previewImage} />
          ) : (
            <>
              <img src={uploadimage} alt="Upload" className={styles['uploadimage-img']} />
              <div className={styles.uploadtext}>Drag file to upload</div>
            </>
          )}
        </div>
        <label className={styles.fileInputLabel}>
          사진 업로드
          <input type="file" accept="image/*" onChange={handleImageChange} className={styles.fileInput} />
        </label>
      </div>
    </div>
  );
};

export default ProfileModal;
