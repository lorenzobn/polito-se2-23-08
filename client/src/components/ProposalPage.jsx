import Navbar from "./Navbar";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "./Button";
import BadButton from "./BadButton";
import { StoreContext } from "../core/store/Provider";
import { faArrowLeft, faCheck } from "@fortawesome/free-solid-svg-icons";

function ProposalPage() {
  const navigate = useNavigate();
  const param = useParams();
  const proposalId = param.id;

  const store = useContext(StoreContext);
  const [proposal, setProposal] = useState({});

  useEffect(() => {
    // since the handler function of useEffect can't be async directly
    // we need to define it separately and run it
    store.getProposal(proposalId).then((proposal) => setProposal(proposal[0]));
  }, []);

  const handleApply = () => {
    const application = {
      student_id: store.user.id,
      thesis_id: parseInt(param.id),
      thesis_status: "idle",
      cv_uri: "",
    };
    store.createApplication(application).then(() => navigate("/"));
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <form
          className="mx-auto p-4 bg-light rounded shadow"
          style={{ marginTop: "5px" }}
        >
          <div className="mb-3 mt-1 text-center">
            <strong>
              <h1>{proposal.title}</h1>
            </strong>
          </div>
          <div className="mb-3">
            <strong>Supervisor:</strong>{" "}
            {proposal.sname + " " + proposal.ssurname}
          </div>
          <div className="mb-3">
            <strong>Deadline:</strong> {proposal.deadline}
          </div>
          <div className="mb-3">
            <strong>{proposal.description}</strong>
          </div>
          <div className="mb-3">
            <strong>Keywords:</strong> {proposal.keywords}
          </div>
          <div className="row g-3 mb-3">
            <div className="col-md-2">
              <strong>Level:</strong> {proposal.level}
            </div>
            <div className="col-md-3">
              <strong>CdS:</strong> {proposal.programme}
            </div>
            <div className="col-md-3">
              <strong>Group:</strong> {proposal.groupname}
            </div>
            <div className="col-md-3">
              <strong>Type:</strong> {proposal.type}
            </div>
          </div>
          <div className="mb-3">
            <strong>Required Knowledge:</strong> {proposal.required_knowledge}
          </div>
          <div className="mb-3">
            <strong>{proposal.notes}</strong>
          </div>
          <div className="row">
            <div className="col text-start">
            {localStorage.getItem('type') === 'student'?<BadButton icon={faArrowLeft} text={"BACK"} onClick={()=> {navigate('/')}}></BadButton>:<BadButton icon={faArrowLeft} text={"BACK"} onClick={()=> {navigate('/thesis-proposals')}}></BadButton>}
            </div>
            <div className="col text-end">
            {localStorage.getItem('type') === 'student'?<Button icon={faCheck} text={"APPLY"} onClick={handleApply}></Button>:<></>}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default ProposalPage;
