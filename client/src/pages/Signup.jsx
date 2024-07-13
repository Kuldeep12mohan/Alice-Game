import axios from "axios";
import React, { useState } from "react";
import { BACKEND_URL } from "../constant";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Signup = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendReq = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/signup`, { name });
      console.log(res);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("username", res.data.user.name);
      toast.success("Player signedUp")
      setLoading(false);
      setTimeout(()=>{
        navigate("/home");
      },1000)
    } catch (error) {
      console.error("Error during signup:", error);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-lg max-w-md w-full ">
        <h2 className="text-2xl font-bold mb-5 text-center text-white">
          Sign Up
        </h2>
        <label htmlFor="name" className="block text-sm font-medium text-white">
          Name
        </label>
        <input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 py-2 px-3 rounded-lg w-full mb-4 mt-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        <button
          className="py-2 px-4 bg-blue-600 text-white font-bold text-lg rounded-lg w-full transition duration-300 ease-in-out hover:bg-blue-700"
          onClick={sendReq}
          disabled={loading}
        >
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
            "Submit"
          )}
        </button>
      </div>
      <Toaster/>
    </div>
  );
};

export default Signup;
