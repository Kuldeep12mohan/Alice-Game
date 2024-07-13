import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import { BACKEND_URL } from "../constant";
import { useTypewriter } from "react-simple-typewriter";
import { MyContext } from "../context";
import { useNavigate } from "react-router-dom";

const TypewriterComponent = ({ words }) => {
  const [text] = useTypewriter({
    words: [words],
    loop: 1,
  });

  const renderText = (text) =>
    text.split("<br>").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));

  return <>{renderText(text)}</>;
};

const Calculation = () => {
  const {
    round,
    setRound,
    isGameStart,
    setIsGameStart,
    isAllReady,
    setIsAllReady,
  } = useContext(MyContext);
  const [users, setUsers] = useState([]);
  const [calculationText, setCalculationText] = useState("");
  const [showCalculationText, setShowCalculationText] = useState(false);
  const [winners, setWinners] = useState([]);
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("ownerId") === localStorage.getItem("userId")) {
      const updateScore = async () => {
        const res = await axios.patch(`${BACKEND_URL}/update-score`, {
          userId: localStorage.getItem("userId"),
          roomId: localStorage.getItem("roomId"),
        });
        console.log(res);
      };
      updateScore();
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/get-users/${localStorage.getItem("roomId")}`
        );
        setUsers(response.data.users.members);
        setLoader(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const updateReady = async () => {
      const res = await axios.post(`${BACKEND_URL}/update-ready`, {
        id: localStorage.getItem("userId"),
        ready: false,
      });
      console.log(res);
      setIsAllReady(false);
    };
    updateReady();
  }, []);
  const nextRound = async () => {
    setLoading(true);
    setRound(round + 1);
    const res = await axios.post(`${BACKEND_URL}/update-ready`, {
      id: localStorage.getItem("userId"),
      ready: true,
    });
    console.log("game false", res);
    setIsAllReady(false);
    setLoading(false);
    navigate("/waiting");
  };
  useEffect(() => {
    const evaluate = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/return-user/${localStorage.getItem("roomId")}`
        );
        console.log("game result", res);
        if (users.length > 0) {
          let words = "";
          let sum = 0;
          users.forEach((item) => {
            words += `${item.selectedNum} + `;
            sum += item.selectedNum;
          });
          let avg = sum / users.length;
          let finalAnswer = avg * 0.8;
          let newWords = `${words.slice(
            0,
            words.length - 3
          )} = ${sum} => ${sum}/${users.length} => ${avg.toFixed(
            2
          )} => ${avg.toFixed(2)} * 0.8 => ${finalAnswer.toFixed(
            2
          )} <br> ${finalAnswer.toFixed(2)} is close to ${
            res.data.user.selectedNum
          } <br>
            winners-
            ${res.data.users.map((member, idx) => `${member.name}`)}`;
          setCalculationText(newWords);
          setShowCalculationText(true);
        }
      } catch (error) {
        console.error("Error evaluating:", error);
      }
    };
    evaluate();
  }, [users]);

  if (loader) {
    return (
      <div className="text-2xl flex items-center justify-center text-white font-bold h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="text-white bg-gray-800 py-10 md:px-5 px-2 md:w-1/2 w-full h-screen md:h-3/4 relative">
        <div className="flex flex-wrap gap-2 text-2xl">
          {users.map((item, index) => (
            <div key={index} className="items-center mb-4 border-2 py-2 px-5 rounded-lg">
              <h1 className="ml-2 text-white">
                {item.name}
              </h1>
              <Card name={item.selectedNum} />
            </div>
          ))}
        </div>
        <div className="mt-8">
          <h1 className="text-2xl font-bold mb-4">Calculation</h1>
          <div className="text-2xl">
          {showCalculationText && (
            <TypewriterComponent words={calculationText} />
          )}
          </div>
        </div>
        <button
          onClick={nextRound}
          className="w-50 border-2 px-6 py-2 bg-purple-500 font-bold text-white absolute bottom-2"
        >
          {" "}
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mr-3 inline-block text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : (
            `Continue for round ${round + 1}`
          )}
        </button>
      </div>
    </div>
  );
};

export default Calculation;
