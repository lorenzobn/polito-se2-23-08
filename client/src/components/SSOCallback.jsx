// Example using react-router-dom
import React, { useEffect, useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { StoreContext } from "../core/store/Provider";

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
        window.location.href = "/";
      } else {
      }
    };
    handleEffect();
  }, []);

  return (
    <div>
      {status === "processing" && (
        <div
          className="w-100 d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <h2>LOGGING IN ...</h2>
        </div>
      )}
    </div>
  );
};

export default SSOCallback;
