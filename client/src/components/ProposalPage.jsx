import Navbar from "./Navbar";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "./Button";
import BadButton from "./BadButton";
import { StoreContext } from "../core/store/Provider";
import { faArrowLeft, faCheck } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";

function ProposalPage() {
  const navigate = useNavigate();
  const param = useParams();
  const proposalId = param.id;

  const store = useContext(StoreContext);
  const [proposal, setProposal] = useState({});
  const [applied, setApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    // since the handler function of useEffect can't be async directly
    // we need to define it separately and run it
    store.fetchSelf();
    store.getProposal(proposalId).then((proposal) => setProposal(proposal[0]));
    store.checkApplication(proposalId).then((res) => setApplied(res.applied));
  }, []);

  useEffect(() => {
    // since the handler function of useEffect can't be async directly
    // we need to define it separately and run it
    store.checkApplication(proposalId).then((res) => setApplied(res.applied));
  }, [applied]);

  const handleApply = () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("student_id", store.user.id);
    formData.append("thesis_id", parseInt(param.id));
    formData.append("thesis_status", "idle");

    store.createApplication(formData).then(() => navigate("/"));
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  return (
    <>
      <Navbar />
      <Modal
        show={showApplyModal}
        onHide={() => {
          setShowApplyModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You may attach your CV here (optional)</p>
          <input type="file" onChange={handleFileChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              handleApply();
            }}
            icon={faCheck}
            text={"Apply"}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="container mt-5">
        <form
          className="mx-auto p-4 bg-light rounded shadow"
          style={{ marginTop: "5px" }}
        >
          <div className="mb-3 mt-1 text-center">
            <strong>
              <h1>{proposal?.title}</h1>
            </strong>
          </div>
          <div className="mb-3">
            <strong>Supervisor:</strong>{" "}
            {proposal?.sname + " " + proposal?.ssurname}
          </div>
          <div className="mb-3">
            <strong>Co-Supervisors:</strong>
          </div>
          <div className="mb-3">
            <strong>Deadline:</strong> {proposal?.deadline}
          </div>
          <div className="mb-3">
            <strong>{proposal?.description}</strong>
          </div>
          <div className="mb-3">
            <strong>Keywords:</strong> {proposal?.keywords}
          </div>
          <div className="row g-3 mb-3">
            <div className="col-md-2">
              <strong>Level:</strong> {proposal?.level}
            </div>
            <div className="col-md-3">
              <strong>CdS:</strong> {proposal?.title_degree}
            </div>
            <div className="col-md-3">
              <strong>Group:</strong> {proposal?.groupname}
            </div>
            <div className="col-md-3">
              <strong>Type:</strong> {proposal?.type}
            </div>
          </div>
          <div className="mb-3">
            <strong>Required Knowledge:</strong> {proposal?.required_knowledge}
          </div>
          <div className="mb-3">
            <strong>{proposal?.notes}</strong>
          </div>
          {proposal?.status === "active" ? (
            <div className="row">
              <div className="col text-start">
                {store.user.type === "student" ? (
                  <BadButton
                    icon={faArrowLeft}
                    text={"BACK"}
                    onClick={() => {
                      navigate("/");
                    }}
                  ></BadButton>
                ) : (
                  <BadButton
                    icon={faArrowLeft}
                    text={"BACK"}
                    onClick={() => {
                      navigate("/thesis-proposals");
                    }}
                  ></BadButton>
                )}
              </div>
              <div className="col text-end">
                {store.user.type === "student" && !applied ? (
                  <Button
                    icon={faCheck}
                    text={"APPLY"}
                    onClick={() => {
                      setShowApplyModal(true);
                    }}
                  ></Button>
                ) : (
                  <div className="col text-center">
                    <h2 style={{ color: "green" }}>APPLIED</h2>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col text-center">
                {store.user.type === "student" && applied ? (
                  <h2 style={{ color: "green" }}>APPLIED</h2>
                ) : (
                  <BadButton
                    icon={faArrowLeft}
                    text={"BACK"}
                    onClick={() => {
                      navigate("/thesis-proposals");
                    }}
                  ></BadButton>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default ProposalPage;
