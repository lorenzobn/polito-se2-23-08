import Navbar from "./Navbar";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { TagsInput } from "react-tag-input-component";
import Button from "./Button";
import { StoreContext } from "../core/store/Provider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MultiSelect } from "react-multi-select-component";

const seprator = ["Enter", " ", ","];

const levels = [
  { value: "BSc", label: "Bachelor" },
  { value: "MSc", label: "Master" },
];

let cdss = [];
let internal_co_supervisors = [];
let external_co_supervisors = [];

function InsertProposal({ proposalData }) {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [modifiedInternal, setModifiedInternal] = useState([]);
  const [modifiedExternal, setModifiedExternal] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    knowledge: "",
    deadline: "",
    notes: "",
    type: "",
  });
  useEffect(() => {
    console.log(selectedProgram);
  }, [selectedProgram]);
  const [selectedInternalCoSupervisors, setSelectedInternalCoSupervisors] =
    useState([]);

  const [selectedExternalCoSupervisors, setSelectedExternalCoSupervisors] =
    useState([]);
  const [co_supervisor, setCoSupervisor] = useState([]);

  const [userType, setUserType] = useState([]);

  const store = useContext(StoreContext);
  const [insertProposals, setInsertProposals] = useState([]);
  const navigate = useNavigate();

  const [combinedData, setCombinedData] = useState({
    ...formData,
    keywords: selectedKeywords,
    level: selectedLevel,
    program: selectedProgram.value,
  });

  useEffect(() => {
    // since the handler function of useEffect can't be async directly
    // we need to define it separately and run it
    const handleEffect = async () => {
      //getting cds from server
      const cds = await store.getAllCds();
      for (let index = 0; index < cds.length; index++) {
        cdss[index] = {
          value: cds[index].cod_degree,
          label: cds[index].title_degree,
        };
      }

      //getting internal-co-supervisors from server
      const co_supervisors = await store.getCoSupervisors();
      for (let index = 0; index < co_supervisors.length; index++) {
        internal_co_supervisors[index] = {
          id: co_supervisors[index].id,
          name: co_supervisors[index].name,
          surname: co_supervisors[index].surname,
          value: co_supervisors[index].name,
          label:
            co_supervisors[index].name + " " + co_supervisors[index].surname,
          isExternal: false,
        };
      }

      //getting external-co-supervisors from server
      const co_supervisors_external = await store.getExternalCoSupervisors();
      for (let index = 0; index < co_supervisors_external.length; index++) {
        external_co_supervisors[index] = {
          name: co_supervisors_external[index].name,
          surname: co_supervisors_external[index].surname,
          value: co_supervisors_external[index].name,
          label:
            co_supervisors_external[index].name +
            " " +
            co_supervisors_external[index].surname,
          isExternal: true,
        };
      }

      setModifiedInternal(
        selectedInternalCoSupervisors.map(({ name, surname, isExternal }) => ({
          name,
          surname,
          isExternal,
        }))
      );

      setModifiedExternal(
        selectedExternalCoSupervisors.map(({ name, surname, isExternal }) => ({
          name,
          surname,
          isExternal,
        }))
      );

      setCoSupervisor([...modifiedInternal, ...modifiedExternal]);

      setCombinedData({
        ...formData,
        keywords: selectedKeywords,
        level: selectedLevel.value,
        program: selectedProgram.value,
      });
    };
    handleEffect();
  }, [formData.type, selectedKeywords]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userType === "student") {
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
        const insertProposal = await store.postProposals(
          formData.title,
          formData.type,
          formData.description,
          formData.knowledge,
          formData.notes,
          combinedData.level,
          combinedData.program,
          formData.deadline,
          combinedData.keywords,
          co_supervisor
        );
        setInsertProposals(insertProposal);
        if (insertProposal.msg === "Proposal created successfully") {
          toast.success("Your proposal submitted successfully!", {
            position: toast.POSITION.TOP_CENTER,
          });
          navigate("/thesis-proposals");
        } else {
          toast.error(insertProposal.response.data.msg, {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTagsChange = (tags) => {
    setSelectedKeywords(tags);
  };

  return (
    <>
      <Navbar />
      <div className="py-2 px-4 mx-auto max-md">
        <p className="mb-4 font-light text-center text-gray-500 fs-5"></p>
        <form
          className="container mt-5 p-4 form-proposal rounded shadow mt-10"
          method="post"
          onSubmit={handleSubmit}
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
              value={formData.title}
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
              value={formData.description}
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
              name="knowledge"
              placeholder="Enter required knowledge"
              value={formData.knowledge}
              onChange={handleInputChange}
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label htmlFor="level" className="form-label block">
                Level:
              </label>
              <Select
                defaultValue={selectedLevel}
                onChange={setSelectedLevel}
                options={levels}
              />
            </div>

            <div className="col-md-4">
              <label htmlFor="programmes" className="form-label block">
                CdS /programmes:
              </label>
              <Select
                defaultValue={selectedProgram}
                onChange={setSelectedProgram}
                options={cdss}
                isMulti
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
                value={formData.deadline}
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
                options={internal_co_supervisors}
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
                options={external_co_supervisors}
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
              separators={seprator}
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

export default InsertProposal;
