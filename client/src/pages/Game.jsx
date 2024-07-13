import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constant.js";
import { MyContext } from "../context.jsx";
import toast, { Toaster } from "react-hot-toast";

const Game = () => {
  const [number, setNumber] = useState(0);
  const [users, setUsers] = useState([]);
  const [countdown, setCountdown] = useState(15);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  const { round } = useContext(MyContext);

  const sendNum = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/send-num`, {
        id: localStorage.getItem("userId"),
        number,
      });
      setNumber(0);
      toast.success("Number submitted successfully");
      console.log(res);
    } catch (error) {
      toast.error("babu, dhang se number daal do!");
    }
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
    <div className="flex flex-col justify-center h-screen">
      <div className="flex justify-between sticky top-0 z-20 bg-gray-900 py-2 px-2">
        <div className="font-bold text-xl border-2 border-white p-2 text-center">
          Round {round}
        </div>
        <div className="font-bold text-xl border-2 border-white p-2 text-center">
          Time remaining: {countdown} seconds
        </div>
      </div>
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center mx-4">
          <label htmlFor="number" className="block text-lg mb-2">
            Enter your guess number between 0 and 100
          </label>
          <input
            type="number"
            name="number"
            id="number"
            placeholder="Enter your guess"
            className="border-2 py-2 px-4 rounded-lg text-white mb-4 w-full bg-gray-700 border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="text-left mt-4 flex flex-wrap gap-2">
            score-
            {users.map((item, index) => (
              <div key={index} className="mb-1">
                {item.name}: <span className="font-bold">({item.score})</span>
              </div>
            ))}
          </div>
        </div>
        <Toaster />
      </div>
    </div>
  );
};

export default Game;
