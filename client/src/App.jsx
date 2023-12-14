import React, { useEffect, useContext } from "react";
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
import DecideApplication from "./components/DecideApplication";
import ErrorPage from "./components/404";
import { StoreContext } from "./core/store/Provider";
import Login from "./components/Login";
import "react-toastify/dist/ReactToastify.css";
import SSOCallback from "./components/SSOCallback";
import { observer } from "mobx-react-lite";
import EditProposal from "./components/EditProposal";

function App() {

  const store = useContext(StoreContext);

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if(theme) {
      store.theme = theme
      theme === 'light'? document.body.style.backgroundColor = "white": document.body.style.backgroundColor = "#031e39"
    }
    store.fetchSelf();
    
  }, []);
  return (
    <div 
      className="app" data-theme={store.theme}
      >
      
      <BrowserRouter>
      
        <Routes>
          <Route path="/" element={<ThesisList></ThesisList>}></Route>
          <Route path="/sso-callback" element={<SSOCallback />}></Route>

          <Route path="/portal" element={<Portal></Portal>}></Route>
          {/* <Route
            path="/insertProposal"
            element={store.user.type === 'teacher'? <InsertProposal></InsertProposal>:<Navigate replace to='/'></Navigate>}
          ></Route> */}
          <Route
            path="/insertProposal"
            element={<InsertProposal></InsertProposal>}
          ></Route>
          <Route
            path="/proposalpage/:id"
            element={<ProposalPage></ProposalPage>}
          ></Route>
          <Route
            path="/my-applications"
            element={<Applications></Applications>}
          ></Route>
          <Route
            path="/received-applications"
            element={<Applications></Applications>}
          ></Route>
          <Route
            path="/received-applications/:thesisId"
            element={<DecideApplication></DecideApplication>}
          ></Route>
          <Route
            path="/showApplication/:applicationId"
            element={<DecideApplication></DecideApplication>}
          ></Route>
          <Route
            path="/thesis-proposals"
            element={store.user.type !== 'student'? <MyProposals></MyProposals>:<Navigate replace to='/'></Navigate>}
          ></Route>
          <Route
            path="/editProposal/:id"
            element={<EditProposal></EditProposal>}
          ></Route>
          <Route path="*" element={<ErrorPage></ErrorPage>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default observer(App);
