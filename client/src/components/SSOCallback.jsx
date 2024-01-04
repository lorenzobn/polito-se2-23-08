// Example using react-router-dom
import React, { useEffect, useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { StoreContext } from "../core/store/Provider";
import Lottie from 'lottie-react'
import animationData from '../assets/animation-sso.json'

const SSOCallback = () => {
  const store = useContext(StoreContext);
  const search = useLocation().search;
  const token = new URLSearchParams(search).get("token");
  const [status, setStatus] = useState("processing");
  console.log(token);
  useEffect(() => {
    const handleEffect = async () => {
      const res = await store.loginVerification(token);
      if (res) {
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
      }
    };
    handleEffect();
  }, []);

  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center">
      {status === "processing" && (
          <div className="text-center">
              <Lottie animationData={animationData}></Lottie>
              <h2>LOGGING IN ...</h2>
          </div>
      )}
    </div>
  );
};

export default SSOCallback;
