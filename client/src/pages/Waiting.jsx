import React, { useContext, useEffect } from 'react'
import { MyContext } from '../context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../constant';
const Waiting = () => {
  const {isAllReady,setIsAllReady } = useContext(MyContext);
  const navigate = useNavigate();

  useEffect(()=>
  {
    if(isAllReady===true){
      navigate("/game")
    }
  },[isAllReady])
  useEffect(() => {
    const fetchReady = async () => {
      const res = await axios.get(
        `${BACKEND_URL}/all-ready/${localStorage.getItem("roomId")}`
      );
      console.log("is all ready",res);
      if (res.data.start === true) setIsAllReady(true);
    };
    fetchReady();
    let intervalId = setInterval(fetchReady,2000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <div className='flex justify-center items-center h-screen text-2xl text-white'>Waiting for remaining players....</div>
  )
}

export default Waiting