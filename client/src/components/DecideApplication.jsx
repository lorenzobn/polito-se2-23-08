import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MyNavbar from "./Navbar";
import {
  Row,
  Col,
  Nav,
  Container,
  Dropdown,
  DropdownButton,
  Form,
} from "react-bootstrap";
import Button from "./Button";
import {
  faCheck,
  faMagnifyingGlass,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import BadButton from "./BadButton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StoreContext } from "../core/store/Provider";

export default function AcceptApplications() {
  //const navigate = useNavigate();
  const param = useParams();
  const proposalId = param.thesisId;
  const store = useContext(StoreContext);

  const [status, setStatus] = useState("");
  const [proposal, setProposal] = useState([]);

  useEffect(() => {
    // since the handler function of useEffect can't be async directly
    // we need to define it separately and run it
    const handleEffect = async () => {
      const response = await store.getReceivedApplicationsByThesisId(
        proposalId
      );
      setProposal(response);
    };
    handleEffect();
  }, []);

  const handleAccept = async (index) => {
    const selectedForm = proposal[index];
    console.log("Accepted form at index", index, selectedForm.student_id);
    setStatus("accepted")
    console.log("Accept status:" , status);
    store.applicationDecision(proposalId, status, selectedForm.student_id);
  };

  const handleReject = async (index) => {
    const selectedForm = proposal[index];
    console.log("Rejected form at index", index, selectedForm);
    setStatus("rejected")
    console.log("Reject status:" , status);
  };

  return (
    <>
      <MyNavbar />
      <strong>
        <p className=" h2 text-center mt-5 ">{proposal.title}</p>
      </strong>
      <div>
        {proposal.map((student, index) => (
          <form
            className="container mt-3 p-4 bg-light rounded shadow mt-10"
            style={{ marginTop: "1px" }}
            key={index}
          >
            <ul>
              <li>
                <strong>Student ID:</strong> {student.student_id},{" "}
                <strong>Application Status:</strong> {student.applicationstatus}
                <div className="row">
                  <div className="col text-start mt-4">
                    <BadButton
                      icon={faX}
                      text={"REJECT"}
                      onClick={() => handleReject(index)}
                    ></BadButton>
                  </div>
                  <div className="col text-end mt-4">
                    <Button
                      icon={faCheck}
                      text={"ACCEPT"}
                      onClick={() => handleAccept(index)}
                    ></Button>
                  </div>
                </div>
              </li>
              {/* Add other form fields based on your object properties */}
            </ul>
          </form>
        ))}
      </div>
    </>
  );
}

{
  /* <div className="container mt-5 mb-3">
        <form
          className="mx-auto p-4 bg-light rounded shadow"
          style={{ marginTop: "1px" }}
        >
          <div className="mb-3 mt-1 text-center">
            <strong>
              <h1 className="text-start ms-3">{proposalDetails.student}</h1>
            </strong>
          </div>
          <div className=" text-start ms-3 mb-3">
            <strong>Status: {proposalDetails.status}</strong>
          </div>
          <div className=" text-start ms-3 mb-3">{proposalDetails.cv_uri}</div>
          <div className="row">
            <div className="col text-center">
              <BadButton
                icon={faX}
                text={"REJECT"}
                onClick={() =>
                  toast("You have successfully rejected the proposal")
                }
              ></BadButton>
            </div>
            <div className="col text-center">
              <Button
                icon={faCheck}
                text={"ACCEPT"}
                onClick={() =>
                  toast("You have succesfully accepted the proposal")
                }
              ></Button>
            </div>
          </div>
        </form>
      </div>

      <div className="container mt-5 mb-3">
        <form
          className="mx-auto p-4 bg-light rounded shadow"
          style={{ marginTop: "1px" }}
        >
          <div className="mb-3 mt-1 text-center">
            <strong>
              <h1 className="text-start ms-3">{proposalDetails.student}</h1>
            </strong>
          </div>
          <div className=" text-start ms-3 mb-3">
            <strong>Status: {proposalDetails.status}</strong>
          </div>
          <div className=" text-start ms-3 mb-3">{proposalDetails.cv_uri}</div>
          <div className="row">
            <div className="col text-center">
              <BadButton
                icon={faX}
                text={"REJECT"}
                onClick={() =>
                  toast("You have successfully rejected the proposal")
                }
              ></BadButton>
            </div>
            <div className="col text-center">
              <Button
                icon={faCheck}
                text={"ACCEPT"}
                onClick={() =>
                  toast("You have succesfully accepted the proposal")
                }
              ></Button>
            </div>
          </div>
        </form>
      </div>

      <div className="container mt-5 mb-3">
        <form
          className="mx-auto p-4 bg-light rounded shadow"
          style={{ marginTop: "1px" }}
        >
          <div className="mb-3 mt-1 text-center">
            <strong>
              <h1 className="text-start ms-3">{proposalDetails.student}</h1>
            </strong>
          </div>
          <div className=" text-start ms-3 mb-3">
            <strong>Status: {proposalDetails.status}</strong>
          </div>
          <div className=" text-start ms-3 mb-3">{proposalDetails.cv_uri}</div>
          <div className="row">
            <div className="col text-center">
              <BadButton
                icon={faX}
                text={"REJECT"}
                onClick={() =>
                  toast("You have successfully rejected the proposal")
                }
              ></BadButton>
            </div>
            <div className="col text-center">
              <Button
                icon={faCheck}
                text={"ACCEPT"}
                onClick={() =>
                  toast("You have succesfully accepted the proposal")
                }
              ></Button>
            </div>
          </div>
        </form>
      </div> */
}
