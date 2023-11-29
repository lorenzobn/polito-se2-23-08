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
  const [applied, setApplied] = useState(false)
  const [proposal, setProposal] = useState({
    title: "",
    description: "",
    knowledge: "",
    deadline: "",
    notes: "",
    type: "",
    level: "",
    program: "",
    name: "",
    surname: "",
    group: "",
    status: ""
  });

  const [incosupervisors, setInCosupervisors] = useState([]);

  const [excosupervisors, setExCosupervisors] = useState([]);

  const [keywords, setKeywords] = useState([]);
  let keyw = [];
  let inco = [];
  let exco = [];

  useEffect(() => {
    // since the handler function of useEffect can't be async directly
    // we need to define it separately and run it
    const handleEffect = async () => {
      const response = await store.getProposal(proposalId);
      setProposal({
        title: response.data[0].title,
        description: response.data[0].description,
        knowledge: response.data[0].required_knowledge,
        deadline: response.data[0].deadline,
        notes: response.data[0].notes,
        type: response.data[0].type,
        level: response.data[0].level,
        program: response.data[0].title_degree,
        group: response.data[0].groupname,
        name: response.data[0].sname,
        surname: response.data[0].ssurname,
        status: response.data[0].status
      });
      keyw = [];
      
      for (let index = 0; index < response.keywords.length; index++) {
        keyw.push(response.keywords[index].keyword);
      }
      
      setKeywords([keyw]);
      for (let index = 0; index < response.internal_co.length; index++) {
        inco[index] = {
          name: response.internal_co[index].name,
          surname: response.internal_co[index].surname,
        };
      }
      setInCosupervisors(inco);

      for (let index = 0; index < response.external_co.length; index++) {
        exco[index] = {
          name: response.external_co[index].name,
          surname: response.external_co[index].surname,
        };
      }
      setExCosupervisors(exco);
    };
    handleEffect();
    store.checkApplied(proposalId).then((res) => setApplied(res))
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
            {proposal.name + " " + proposal.surname}
          </div>
          <div className="mb-3">
            <strong>Internal Co-Supervisors:</strong>{" "}
            {incosupervisors.map((coSupervisor, index) => (
              <span key={index}>
                {coSupervisor.name} {coSupervisor.surname}
                {index < incosupervisors.length - 1 && ", "}{" "}
              </span>
            ))}
          </div>
          <div className="mb-3">
            <strong>External Co-Supervisors:</strong>{" "}
            {excosupervisors.map((coSupervisor, index) => (
              <span key={index}>
                {coSupervisor.name} {coSupervisor.surname}
                {index < excosupervisors.length - 1 && ", "}{" "}
              </span>
            ))}
          </div>
          <div className="mb-3">
            <strong>Deadline:</strong> {proposal.deadline}
          </div>
          <div className="mb-3">
            <strong>{proposal.description}</strong>
          </div>
          <div className="mb-3">
            <strong>Keywords:</strong> {keywords.join(", ")}
          </div>
          <div className="row g-3 mb-3">
            <div className="col-md-2">
              <strong>Level:</strong> {proposal.level}
            </div>
            <div className="col-md-3">
              <strong>CdS:</strong> {proposal.program}
            </div>
            <div className="col-md-3">
              <strong>Group:</strong> {proposal.group}
            </div>
            <div className="col-md-3">
              <strong>Type:</strong> {proposal.type}
            </div>
          </div>
          <div className="mb-3">
            <strong>Required Knowledge:</strong> {proposal.knowledge}
          </div>
          <div className="mb-3">
            <strong>{proposal.notes}</strong>
          </div>
            {store.user.type === "student" ? 
              applied?
                (<div className="row mt-5">
                  <div className="col text-start">
                    <BadButton icon={faArrowLeft} text={"BACK"} onClick={() => {navigate("/")}}></BadButton>
                  </div>
                  <div className="col text-center">
                    <h2 style={{ color: "green" }}>APPLIED</h2>
                  </div>
                </div> ) :
                ( <div className="row mt-5">
                  <div className="col text-start">
                  <BadButton icon={faArrowLeft} text={"BACK"} onClick={() => {navigate("/")}}></BadButton>
                  </div>
                  <div className="col text-end">
                    <Button icon={faCheck} text={"APPLY"} onClick={handleApply}></Button>
                  </div>
                </div>)
             : 
              ( <div className="row mt-5">
                  <div className="col text-start">
                  <BadButton icon={faArrowLeft} text={"BACK"} onClick={() => {navigate("/thesis-proposals")}}></BadButton>
                  </div>
                  <div className="col text-end">
                    <Button icon={faCheck} text={"APPLY"} onClick={handleApply}></Button>
                  </div>
              </div> )
            }
        </form>
      </div>
    </>
  );
}

export default ProposalPage;
