import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Portal from "./components/Portal";
import "./assets/bootstrap.css";
import "./App.css";
import { ToastContainer } from "react-bootstrap";
import InsertProposal from "./components/InsertProposal";
import ThesisList from "./components/ThesisList";
import ProposalPage from "./components/ProposalPage";
import MyProposals from "./components/MyProposals";
import Applications from "./components/Applications";
import AcceptApplications from "./components/AcceptApplication";
import Login from "./components/Login";
import 'react-toastify/dist/ReactToastify.css';

function isAuthenticated(){
  const userLogged = localStorage.getItem("auth");
  return (userLogged ? true : false)
}

function App() {  
  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ThesisList></ThesisList>}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/portal" element={isAuthenticated() ? <Portal /> : <Navigate to='/login'></Navigate>}></Route>
          <Route
            path="/insertProposal"
            element={isAuthenticated() ? <InsertProposal /> : <Navigate to='/login'></Navigate>}
          ></Route>
          <Route
            path="/proposalpage"
            element={isAuthenticated() ? <ProposalPage /> : <Navigate to='/login'></Navigate>}
          ></Route>
          <Route
            path="/applications"
            element={isAuthenticated() ? <Applications /> : <Navigate to='/login'></Navigate>}
          ></Route>
          <Route
            path="/applications/acceptApplication"
            element={isAuthenticated() ? <AcceptApplications /> : <Navigate to='/login'></Navigate>}
          ></Route>
          <Route
            path="/myProposals"
            element={isAuthenticated() ? <MyProposals /> : <Navigate to='/login'></Navigate>}
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
