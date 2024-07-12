import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constant.js";
import { MyContext } from "../context.jsx";

const Game = () => {
  const [number, setNumber] = useState(0);
  const [users, setUsers] = useState([]);
  const [countdown, setCountdown] = useState(30);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  const { round, setRound, isAllReady, setIsAllReady } = useContext(MyContext);

  const sendNum = async () => {
    const res = await axios.post(`${BACKEND_URL}/send-num`, {
      id: localStorage.getItem("userId"),
      number,
    });
    setNumber(0);
    console.log(res);
  };
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `${BACKEND_URL}/get-user/${localStorage.getItem("userId")}`
      );
      console.log(res);
      setScore(res.data.score);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const userFetch = async () => {
      const response = await axios.get(
        `${BACKEND_URL}/get-users/${localStorage.getItem("roomId")}`
      );
      console.log("response", response);
      setUsers(response.data.users.members);
    };
    userFetch();
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        clearInterval(timer);
        navigate("/calculation");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white relative">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <div className="font-bold mb-4 absolute top-4 right-4">
          <p className="text-1xl md:text-2xl">
            Time remaining: {countdown} seconds
          </p>
        </div>
        <div className="font-bold mb-4 absolute top-4 left-4">
          <p className="text-1xl md:text-2xl">
            {localStorage.getItem("username")}
            <br />
            Score-({score})
          </p>
        </div>
        <div className="text-center absolute left-40 top-20 text-1xl font-bold">Round-{round}</div>

        <label htmlFor="number" className="block text-lg mb-2">
          Enter your guess number between 0 and 100
        </label>
        <input
          type="number"
          name="number"
          id="number"
          placeholder="Enter your guess"
          className="border-2 py-2 px-4 rounded-lg text-white mb-4 w-full"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <div className="space-x-4">
          <button
            className="py-2 px-6 font-semibold bg-blue-500 hover:bg-blue-700 text-white rounded-lg transition duration-300 ease-in-out"
            onClick={sendNum}
          >
            Submit
          </button>
        </div>
        <div>
          <br />
          {users.map((item, index) => (
            <div>
              {item.name}:({item.score})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
