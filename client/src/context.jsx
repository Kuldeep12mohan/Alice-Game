import React, { createContext, useState } from 'react';

const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [round, setRound] = useState(1);
  const [isGameStart,setIsGameStart] = useState(false);
  const [isAllReady,setIsAllReady] = useState(false);
  return (
    <MyContext.Provider value={{ round, setRound,isGameStart,setIsGameStart,isAllReady,setIsAllReady }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyProvider };