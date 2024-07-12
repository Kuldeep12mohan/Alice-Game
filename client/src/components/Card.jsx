import React from "react";

// Define the Card component
const Card = ({ name }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 m-2 shadow text-center max-w-xs text-white">
      <h2 className="text-lg font-semibold">{name}</h2>
    </div>
  );
};

export default Card;
