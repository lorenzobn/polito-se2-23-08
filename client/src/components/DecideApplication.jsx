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
  const [proposalDetails, setProposalDetails] = useState([]);
  const [proposalTitle, setProposalTitle] = useState("");


  useEffect(() => {
    // since the handler function of useEffect can't be async directly
    // we need to define it separately and run it
    const handleEffect = async () => {
      const response = await store.getReceivedApplicationsByThesisId(
        proposalId
      );
      setProposal(response);
      const details = proposal.map(p => p.applicationstatus);
      setProposalDetails(details);
      setProposalTitle(response[0].title)
    };
    handleEffect();
  }, [proposalDetails]);

  const handleAccept = async (index) => {
    const selectedForm = proposal[index];
    //console.log("Accepted form at index", index, selectedForm.student_id);
    // console.log("test:" , selectedForm.applicationid);
    store.applicationDecision(selectedForm.applicationid, "accepted");
    toast.success(`You accepted ${selectedForm.student_id} application successfully!`, {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const handleReject = async (index) => {
    const selectedForm = proposal[index];
    //console.log("Rejected form at index", index, selectedForm);
    store.applicationDecision(selectedForm.applicationid, "rejected");
    toast.warn(`You rejected ${selectedForm.student_id} application successfully!`, {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  return (
    <>
      <MyNavbar />
      <strong>
        <p className=" h2 text-center mt-5 ">{proposalTitle}</p>
      </strong>
      <div>
        {proposal.map((student, index) => (
          <form
            className="container form-proposal mt-3 p-4 rounded shadow mt-10"
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

