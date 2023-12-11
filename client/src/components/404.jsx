import React from "react";
import Lottie from "lottie-react";
import animationData from "../assets/404-2.json";

const ErrorPage = () => {
  return (
    <div className="error-page">
      <div className="d-flex justify-content-center align-items-center">
        <div style={{ maxWidth: "30%" }}>
          <h1 className="d-flex justify-content-center">OOPS!</h1>
          <h3 className="d-flex justify-content-center m-5">
            The page you are looking for might have been removed, might be
            temporarily unavailable or you don't have the permissions.
          </h3>
          <div className="d-flex justify-content-center">
          <a className="border-thesis-view" href={`/`}>
            HOME PAGE
          </a>
          </div>
          
        </div>
        <div className="d-flex justify-content-start" style={{scale:'100%'}}>
          <Lottie animationData={animationData}></Lottie>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
