import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // State for Google user information
  const [google_user, setGoogleUser] = useState(null);
  
  // Adding state for GitHub user information
  const [github_user, setGithubUser] = useState(null);

  return (
    <UserContext.Provider value={{ google_user, setGoogleUser, github_user, setGithubUser }}>
      {children}
    </UserContext.Provider>
  );
};
