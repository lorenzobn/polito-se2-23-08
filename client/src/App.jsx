import React, { useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { StoreContext } from "./core/store/Provider";
import Login from "./components/Login";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const store = useContext(StoreContext);
  // this will run in every page refresh, so we don't lose track of auth state of refreshes
  useEffect(() => {
    store.fetchSelf();
  }, []);
  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ThesisList></ThesisList>}></Route>
          <Route path="/login" element={<Login />}></Route>

          <Route path="/portal" element={<Portal></Portal>}></Route>
          <Route
            path="/insertProposal"
            element={<InsertProposal></InsertProposal>}
          ></Route>
          <Route
            path="/proposalpage"
            element={<ProposalPage></ProposalPage>}
          ></Route>
          <Route
            path="/applications"
            element={<Applications></Applications>}
          ></Route>
          <Route
            path="/applications/acceptApplication"
            element={<AcceptApplications></AcceptApplications>}
          ></Route>
          <Route
            path="/myProposals"
            element={<MyProposals></MyProposals>}
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
