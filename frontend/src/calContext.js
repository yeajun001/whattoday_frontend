import React, { createContext, useContext, useState } from 'react';

const Calcontext = createContext();

export const useCal = () => useContext(Calcontext);

export const CalProvider = ({ children }) => {
  const [currentDay, setCurrentDay] = useState(new Date().getDay());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const value = {
    currentDay,
    setCurrentDay,
    currentMonth,
    setCurrentMonth,
    currentYear,
    setCurrentYear
  };

  return (
    <Calcontext.Provider value={value}>
      {children}
    </Calcontext.Provider>
  );
};
