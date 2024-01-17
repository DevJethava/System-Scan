import React, {createContext, useState} from 'react';

const UserContext = createContext();
export default UserContext;

export const ContextProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(0);

  return (
    <UserContext.Provider value={{currentUser, setCurrentUser}}>
      {children}
    </UserContext.Provider>
  );
};
