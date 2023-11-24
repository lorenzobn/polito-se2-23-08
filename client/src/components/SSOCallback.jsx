// Example using react-router-dom
import React, { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { StoreContext } from "../core/store/Provider";

const SSOCallback = () => {
  const store = useContext(StoreContext);
  const search = useLocation().search;
  const token = new URLSearchParams(search).get("token");
  console.log(token);
  useEffect(() => {
    store.loginVerification(token);
  }, []);

  const handleAuthentication = () => {};

  return <div>Processing...</div>;
};

export default SSOCallback;
