import React, { useState, useEffect, useContext } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import MyNavbar from "./Navbar";
import { Modal } from "react-bootstrap";
import Button from "./Button";
import {
  faCheck,
  faX,
  faHand,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import BadButton from "./BadButton";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StoreContext } from "../core/store/Provider";

export default function AcceptApplications() {
  //const navigate = useNavigate();
  const param = useParams();
  const proposalId = param.thesisId;
  const store = useContext(StoreContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [proposal, setProposal] = useState([]);
  const [proposalDetails, setProposalDetails] = useState([]);
  const [proposalTitle, setProposalTitle] = useState("");
  const [applicationDetails, setApplicationDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [career, setCareer] = useState([]);

  useEffect(() => {
    // since the handler function of useEffect can't be async directly
    // we need to define it separately and run it
    const handleEffect = async () => {
      try {
        const response = await store.getReceivedApplicationsByThesisId(
          proposalId
        );
        setProposal(response);
        const details = proposal.map((p) => p.applicationstatus);
        setProposalDetails(details);
        setProposalTitle(response[0].title);
        response.forEach(async (r, i) => {
          const career = await store.getStudentCareer(r.student_id);
          setProposal((proposal) => {
            const newArray = [...proposal];
            const element = newArray[i];
            element.career = career;
            newArray[i] = element;

            return newArray;
          });
        });
      } catch (error) {
        navigate("/404");
      }
    };
    handleEffect();
  }, [status]);

  // useEffect(() => {
  //   // since the handler function of useEffect can't be async directly
  //   // we need to define it separately and run it
  //   const handleEffect = async () => {
  //     setCareer(proposal[0].career.careers);
  //     for (let index = 1; index < proposal.length; index++) {
  //       setCareer(...[proposal[index].career.careers]);
  //     }
  //   };
  //   handleEffect();
  // }, [proposal, career]);

  function isDifferenceMoreThanOneHour(time) {
    var date1 = new Date(time);
    var date2 = new Date();
    var difference = Math.abs(date1 - date2);
    var hoursDifference = difference / (1000 * 60 * 60);
    return hoursDifference > 1;
  }
  const handleAccept = async (index) => {
    const selectedForm = proposal[index];
    const clock = await store.getVirtualClockValue();
    if (isDifferenceMoreThanOneHour(clock)) {
      toast.error(
        "You cannot perform this action since you are in a virtual time!"
      );
      return;
    }

    const response = await store.applicationDecision(
      selectedForm.applicationid,
      "accepted"
    );
    if (response.status !== 200) {
      toast.error(response.data.msg, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      setStatus("accepted");
      toast.success(
        `You accepted ${selectedForm.student_id} application successfully!`,
        {
          position: toast.POSITION.TOP_CENTER,
        }
      );
    }
  };

  const handleReject = async (index) => {
    const clock = await store.getVirtualClockValue();

    if (isDifferenceMoreThanOneHour(clock)) {
      toast.error(
        "You cannot perform this action since you are in a virtual time!"
      );
      return;
    }
    const selectedForm = proposal[index];
    const response = await store.applicationDecision(
      selectedForm.applicationid,
      "rejected"
    );
    if (response.status !== 200) {
      toast.error(response.data.msg, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      setStatus("rejected");
      toast.success(
        `You rejected ${selectedForm.student_id} application successfully!`,
        {
          position: toast.POSITION.TOP_CENTER,
        }
      );
    }
  };

  return (
    <>
      <MyNavbar />
      <strong>
        <p className=" h2 text-center mt-5 ">{proposalTitle}</p>
      </strong>
      <div>
        {proposal.map((student, index) => {
          return (
            <form
              className="container form-proposal mt-3 p-4 rounded shadow mt-10"
              style={{ marginTop: "1px" }}
              key={index}
            >
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Confirm Accept</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Are you sure you want to accept the application?{" "}
                </Modal.Body>
                <Modal.Footer className="modal-footer d-flex justify-content-end">
                  <Button
                    variant="grey"
                    className="mx-2"
                    onClick={() => {
                      setShowModal(false);
                    }}
                    text={"CANCEL"}
                    icon={faHand}
                  ></Button>
                  <Button
                    variant="success"
                    className="mx-2"
                    onClick={async () => {
                      handleAccept(index);
                      setShowModal(false);
                    }}
                    text={"ACCEPT"}
                    icon={faTrash}
                  ></Button>
                </Modal.Footer>
              </Modal>
              <div>
                <p>Application Status: {student.applicationstatus}</p>
                <div>
                  <strong className="mb-4">Personal Information:</strong>
                  <small className="d-block">
                    Student ID: {student?.career?.student?.id}
                  </small>
                  <small className="d-block">
                    Name:{" "}
                    {student?.career?.student?.name +
                      " " +
                      student?.career?.student?.surname}
                  </small>
                  <small className="d-block">
                    Degree Code: {student?.career?.student?.cod_degree}
                  </small>
                  <small className="d-block">
                    Enrollment Year: {student?.career?.student?.enrollment_year}
                  </small>
                  <strong className="py-4">Careers Information:</strong>
                  <table className="table container mt-3 p-4 rounded  mt-10">
                    <thead>
                      <tr>
                        <th>Course Code</th>
                        <th>Course Title</th>
                        <th>CFU</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {student?.career?.careers?.map((c, i) => {
                        return (
                          <tr key={i}>
                            <td>{c?.cod_course}</td>
                            <td>{c?.title_course}</td>
                            <td>{c?.cfu}</td>
                            <td>{c?.grade}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {student.cv_uri && (
                    <a
                      className="mt-2 d-block "
                      style={{ cursor: "pointer", color: "rgb(0, 126, 168)" }}
                      href={`http://localhost:3000/api/v1.0//received-applications/${student.applicationid}/cv`}
                    >
                      Download CV
                    </a>
                  )}
                </div>
                <div className="row">
                  <div className="col text-start mt-4">
                    {student.applicationstatus === "idle" ? (
                      <BadButton
                        icon={faX}
                        text={"REJECT"}
                        onClick={() => handleReject(index)}
                      ></BadButton>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="col text-end mt-4">
                    {student.applicationstatus === "idle" ? (
                      <Button
                        icon={faCheck}
                        text={"ACCEPT"}
                        onClick={() => setShowModal(true)}
                      ></Button>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              {/* Add other form fields based on your object properties */}
            </form>
          );
        })}
      </div>
    </>
  );
}
