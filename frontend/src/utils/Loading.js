import React from "react";
import Logo from "../assets/logo.png"; // Path to your logo image
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="animate-pulse flex flex-col items-center gap-2">
        <img src={Logo} alt="ZCAS U" width={112} height={112} />
        <p className="text-2xl text-emerald-500 text-center font-bold mt-2">
          Loading..
        </p>
        <div className="loader"></div> {/* Optional spinner */}
      </div>
    </div>
  );
};

export default Loading;
