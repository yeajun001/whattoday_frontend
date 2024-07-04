import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { getMonth, getYear } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import "./date.css"

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import styles from './Cal.module.css';

const currentYear = new Date().getFullYear();
console.log(currentYear); // 현재 연도를 출력합니다.
const YEARS = Array.from({ length: currentYear + 1 - 2000 }, (_, i) => currentYear + 6 - i);
console.log(YEARS);
const MONTHS = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월"
];

const Datapicker = ({ onChange }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleChange = (date) => {
    setSelectedDate(date);
    onChange(date);
  };

  return (
    <div className={styles.datePickerWrapper}>
      <DatePicker
        dateFormat="yyyy-MM-dd"
        formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
        showYearDropdown
        scrollableYearDropdown
        shouldCloseOnSelect
        yearDropdownItemNumber={100}
        minDate={new Date('2000-01-01')}
        maxDate={new Date('2030-12-31')}
        selected={selectedDate}
        calendarClassName={styles.calenderWrapper}
        dayClassName={(d) => (d.getDate() === selectedDate?.getDate() ? styles.selectedDay : styles.unselectedDay)}
        onChange={handleChange}
        className={styles.datePicker}
        renderCustomHeader={({
          date,
          changeYear,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className={styles.customHeaderContainer}>
            <div>
              <span className={styles.month}>{MONTHS[getMonth(date)]}</span>
              <select
                value={getYear(date)}
                className={styles.year}
                onChange={({ target: { value } }) => changeYear(+value)}
              >
                {YEARS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles['datebtn']}>
              <div
                type="button"
                onClick={decreaseMonth}
                className={styles.monthButton}
                disabled={prevMonthButtonDisabled}
              >
                <i className="xi-angle-left"></i>
              </div>
              <div
                type="button"
                onClick={increaseMonth}
                className={styles.monthButton}
                disabled={nextMonthButtonDisabled}
              >
                <i className="xi-angle-right"></i>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default Datapicker;
