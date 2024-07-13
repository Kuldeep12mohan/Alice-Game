import React, { useContext, useEffect, useState } from "react";
import Card from "../components/Card";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constant";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { MyContext } from "../context";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

let intervalId;
let intervalIdForGameStart;

const Lobby = () => {
  const [users, setUsers] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const { isGameStart, setIsGameStart } = useContext(MyContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const sendGameStartEvent = async () => {
    const res = await axios.patch(`${BACKEND_URL}/game-start/${id}`, {
      game: true,
    });
    console.log(res);
  };

  useEffect(() => {
    if (isGameStart === true) {
      navigate("/game");
    }
  }, [isGameStart, navigate]);

  useEffect(() => {
    if (localStorage.getItem("ownerId") === localStorage.getItem("userId")) {
      setAdmin(true);
    }
  }, []);

  useEffect(() => {
    const isGameStart = async () => {
      const response = await axios.get(`${BACKEND_URL}/game-start/${id}`);
      console.log("gamestart", response);
      if (response.data.gameStart.start) setIsGameStart(true);
    };
    isGameStart();
    intervalIdForGameStart = setInterval(isGameStart, 2000);
    return () => {
      clearInterval(intervalIdForGameStart);
    };
  }, [id, setIsGameStart]);

  useEffect(() => {
    const userFetch = async () => {
      const response = await axios.get(`${BACKEND_URL}/get-users/${id}`);
      console.log("response", response);
      setUsers(response.data.users.members);
    };
    userFetch();
    intervalId = setInterval(userFetch, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [id]);

  useEffect(() => {
    localStorage.setItem("roomId", id);
    const addMe = async () => {
      const res = await axios.post(`${BACKEND_URL}/join-room`, {
        userId: localStorage.getItem("userId"),
        roomId: id,
      });
      console.log(res);
    };
    addMe();
  }, [id]);

  const copyRoomId = () => {
    const roomId = id;
    navigator.clipboard.writeText(roomId).then(() => {
      console.log("copied");
    });
    toast.success("Room Id copied to Clipboard");
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleShowSlider = () => {
    setShowSlider(!showSlider);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white px-2">
      <div className="border-2 border-white py-10 px-5 md:px-10 w-full max-w-xl bg-gray-800 rounded-lg shadow-lg">
        {admin && (
          <div className="mb-4 text-center">
            <h1 className=" text-white text-xl">
              Your room ID is{" "}
              <a
                href="#"
                className="underline text-blue-500 cursor-pointer"
                onClick={copyRoomId}
              >
                {id}
              </a>
            </h1>
          </div>
        )}
        <h1 className="text-center text-2xl font-bold mb-4">Players in Lobby...</h1>
        <div className="border-2 border-gray-700 flex gap-2 justify-center w-full h-20 items-center overflow-hidden">
          {users.slice(0, 2).map((item, index) => (
            <div key={index}>
              <Card name={item.name} />
            </div>
          ))}
          {users.length > 2 && (
            <div className="cursor-pointer" onClick={handleShowSlider}>
              +{users.length - 2}
            </div>
          )}
        </div>
        {showSlider && (
          <div className="mt-4">
            <Slider {...settings}>
              {users.map((item, index) => (
                <div key={index}>
                  <Card name={item.name} />
                </div>
              ))}
            </Slider>
          </div>
        )}
        {admin && (
          <button
            onClick={sendGameStartEvent}
            className="py-2 px-6 bg-purple-500 font-bold text-xl text-white border-2 mt-5 w-full md:w-auto mx-auto transition duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-700"
          >
            Start Game
          </button>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default Lobby;
