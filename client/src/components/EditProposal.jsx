import React, { useState } from "react";
import Navbar from "./Navbar";
import Button from "./Button";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Select from "react-select";
import { StoreContext } from "../core/store/Provider";
import { useContext } from "react";
import { TagsInput } from "react-tag-input-component";
import { MultiSelect } from "react-multi-select-component";
import { set } from "mobx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const levels = [
  { value: "BSc", label: "Bachelor" },
  { value: "MSc", label: "Master" },
];
const separator = ["Enter", " ", ","];
let internal_co_supervisors = [];
let external_co_supervisors = [];

function EditProposal() {
  const param = useParams();
  const proposalId = param.id;
  const navigate = useNavigate();
  const [intCosupervisors, setIntCosupervisors] = useState([]);
  const [extCosupervisors, setExtCosupervisors] = useState([]);
  const [selectedExternalCoSupervisors, setSelectedExternalCoSupervisors] =
    useState([]);
  const [selectedInternalCoSupervisors, setSelectedInternalCoSupervisors] =
    useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState({});
  const [selectedProgram, setSelectedProgram] = useState("");
  const [cdss, setCdss] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    required_knowledge: "",
    deadline: "",
    notes: "",
    type: "",
  });
  const [editProposal, setEditProposal] = useState({});

  const store = useContext(StoreContext);
  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await store.getProposal(proposalId);
        console.log(res.internal_co);

        const proposal = res.data[0];
        setFormData(proposal);
        setSelectedKeywords(res.keywords.map((e) => e.keyword));
        setSelectedLevel(levels.find((e) => e.value === proposal.level));
        setSelectedExternalCoSupervisors(
          res.external_co.map(({ name, surname }) => {
            return { value: `${name} ${surname}`, label: `${name} ${surname}` };
          })
        );
        console.log(selectedExternalCoSupervisors);
        setSelectedInternalCoSupervisors(
          res.internal_co.map(({ name, surname }) => {
            return { value: `${name} ${surname}`, label: `${name} ${surname}` };
          })
        );
      } catch (error) {
        navigate("/404");
      }
    };
    fetchProposal();

    const fetchSupervisors = async () => {
      const int = await store.getCoSupervisors();
      const ext = await store.getExternalCoSupervisors();
      setIntCosupervisors(
        int.map(({ name, surname }) => {
          return { value: `${name} ${surname}`, label: `${name} ${surname}` };
        })
      );
      setExtCosupervisors(
        ext.map(({ name, surname }) => {
          return { value: `${name} ${surname}`, label: `${name} ${surname}` };
        })
      );
    };
    fetchSupervisors();

    const handleEffect = async () => {
      //getting cds from server
      const cds = await store.getAllCds();
      setCdss(
        cds.map((e) => {
          return { value: e.cod_degree, label: e.title_degree };
        })
      );
    };
    handleEffect();
  }, []);

  useEffect(() => {
    setSelectedProgram(cdss.find((e) => e.value === formData.programme));
  }, [cdss]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTagsChange = (tags) => {
    setSelectedKeywords(tags);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (store.user.type === "student") {
      toast.error("You are not authorized to create proposal.", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      // Check if any of the inputs are empty
      if (formData.title.trim() === "") {
        toast.error("Title shouldn't be empty!", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (formData.description.trim() === "") {
        toast.error("Description shouldn't be empty!", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (formData.deadline.trim() === "") {
        toast.error("Deadline shouldn't be empty!", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (selectedKeywords.length === 0) {
        toast.error("Keywords shouldn't be empty!", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (selectedLevel.length === 0) {
        toast.error("Level shouldn't be empty!", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (selectedProgram.length === 0) {
        toast.error("Program shouldn't be empty!", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (formData.type.trim() === "") {
        toast.error("Type shouldn't be empty!", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        const updatedProposal = await store.updateProposal(proposalId, {
          title: formData.title,
          description: formData.description,
          requiredKnowledge: formData.required_knowledge,
          deadline: formData.deadline.slice(0, 10),
          notes: formData.notes,
          type: formData.type,
          level: selectedLevel.value,
          programme: selectedProgram.value,
          keywords: selectedKeywords,
          coSupervisors: selectedInternalCoSupervisors.map((e) => {return {name: e.value.split(" ")[0], surname: e.value.split(" ")[1]}}),
          /* external_co: selectedExternalCoSupervisors.map((e) => e.value), */
        });
        setEditProposal(updatedProposal);
        console.log(updatedProposal)
        if(updatedProposal.msg === "Proposal updated successfully"){
          toast.success("Your proposal updated successfully!", {
            position: toast.POSITION.TOP_CENTER,
          });
          
        }
          else{
            toast.error(updatedProposal.response.data.msg, {
              position: toast.POSITION.TOP_CENTER,
            });
          }

        
        
        //console.log("test log:" , insertProposal.response.data.msg);
        /* if (updatedProposal.msg === "Proposal created successfully") {
          toast.success("Your proposal updated successfully!", {
            position: toast.POSITION.TOP_CENTER,
          });
          navigate("/thesis-proposals");
        } else {
          toast.error(updatedProposal.response.data.msg, {
            position: toast.POSITION.TOP_CENTER,
          });
        } */
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="py-2 px-4 mx-auto max-md">
        <p className="mb-4 font-light text-center text-gray-500 fs-5"></p>
        <form
          className="container mt-5 p-4 form-proposal rounded shadow mt-10"
          method="post"
        >
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Proposal Title:
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              placeholder="Enter proposal title"
              value={formData.title || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description:
            </label>
            <textarea
              className="form-control border rounded px-3 py-2 mt-1 mb-2"
              id="description"
              name="description"
              placeholder="Enter proposal description"
              value={formData.description || ""}
              onChange={handleInputChange}
              rows="4"
            ></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="knowledge" className="form-label">
              Required knowledge:
            </label>
            <input
              type="text"
              className="form-control border rounded px-3 py-2 mt-1 mb-2"
              id="knowledge"
              name="required_knowledge"
              placeholder="Enter required knowledge"
              value={formData.required_knowledge || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label htmlFor="level" className="form-label block">
                Level:
              </label>
              <Select
                value={selectedLevel}
                onChange={setSelectedLevel}
                options={levels}
              />
            </div>

            <div className="col-md-4">
              <label htmlFor="programmes" className="form-label block">
                CdS / Programmes:
              </label>
              <Select
                value={selectedProgram}
                onChange={setSelectedProgram}
                options={cdss}
              />
            </div>

            <div className="col-md-4">
              <label htmlFor="deadline" className="form-label block">
                Deadline:
              </label>
              <input
                type="date"
                className="form-control border rounded px-3 py-2"
                id="deadline"
                name="deadline"
                value={formData.deadline.slice(0, 10)}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label
                htmlFor="internal-co-supervisors"
                className="form-label block"
              >
                Internal Co-supervisors:
              </label>
              <MultiSelect
                options={intCosupervisors}
                value={selectedInternalCoSupervisors}
                onChange={setSelectedInternalCoSupervisors}
                labelledBy="Select"
              />
            </div>

            <div className="col-md-6">
              <label
                htmlFor="External-co-supervisors"
                className="form-label block"
              >
                External Co-supervisors:
              </label>
              <MultiSelect
                options={extCosupervisors}
                value={selectedExternalCoSupervisors}
                onChange={setSelectedExternalCoSupervisors}
                labelledBy="Select"
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="type" className="form-label block">
              Type:
            </label>
            <input
              type="text"
              className="form-control border rounded px-3 py-2 mt-1 mb-2"
              id="type"
              name="type"
              value={formData.type}
              placeholder="Enter type..."
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="keywords" className="form-label block">
              Keywords:
            </label>
            <TagsInput
              value={selectedKeywords}
              onChange={handleTagsChange}
              name="keywoards"
              placeHolder="Enter keywords"
              separators={separator}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="notes" className="form-label">
              Note:
            </label>
            <textarea
              className="form-control border rounded px-3 py-2 mt-1 mb-2"
              id="notes"
              name="notes"
              placeholder="Enter additional notes here..."
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <Button text={"Confirm"} onClick={handleSubmit}></Button>
            <ToastContainer />
          </div>
        </form>
      </div>
    </>
  );
}

export default EditProposal;
