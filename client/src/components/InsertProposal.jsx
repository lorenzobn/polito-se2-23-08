import Navbar from "./Navbar";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { TagsInput } from "react-tag-input-component";
import "../App.css";
import Button from "./Button";
import { StoreContext } from "../core/store/Provider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const levels = [
  { value: "BSc", label: "Bachelor" },
  { value: "MSc", label: "Master" },
];

const programs = [
  { value: "LM-32", label: "Computer Engineering" },
  { value: "LM-19", label: "Chemical Engineering" },
];

const groups = [
  { value: "AI", label: "AI" },
  { value: "SE", label: "SE" },
  { value: "Network", label: "Network" },
];

const options = [
  { value: "CE", label: "CE" },
  { value: "ME", label: "ME" },
  { value: "BE", label: "BE" },
];

const delimiters = [KeyCodes.comma, KeyCodes.enter];

function InsertProposal() {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedGroups, setSelectedGroups] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    knowledge: "",
    level: "Bachelor",
    deadline: "",
  });

  const store = useContext(StoreContext);
  const [insertProposals, setInsertProposals] = useState([]);

  const [combinedData, setCombinedData] = useState({
    ...formData,
    keywords: selectedKeywords,
    level: selectedLevel.value,
    group: selectedGroups.value,
    program: selectedProgram.value,
    type: selectedType.value,
  });

  useEffect(() => {
    // since the handler function of useEffect can't be async directly
    // we need to define it separately and run it
    const handleEffect = async () => {
      // const insertPrposals = await store.postProposals(combinedData);
      // setInsertProposals(insertPrposals);

      setCombinedData({
        ...formData,
        keywords: selectedKeywords,
        level: selectedLevel.value,
        group: selectedGroups.value,
        program: selectedProgram.value,
        type: selectedType.value,
      });
    };
    handleEffect();
  }, [formData, selectedKeywords]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if any of the inputs are empty
    if (formData.title.trim() === "") {
      toast.error("Title shouldn't be empty!", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (formData.description.trim() === "") {
      toast.error("Description shouldn't be empty!", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (formData.knowledge.trim() === "") {
      toast.error("Required knowledge shouldn't be empty!", {
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
    } else if (selectedType.length === 0) {
      toast.error("Type shouldn't be empty!", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      const SUPERVISOR_id = "t123";
      const notes = "noooooo";
      const status = "OK";
      const groups = "LM-32";
      const insertProposal = store.postProposals(
        formData.title,
        combinedData.type,
        formData.description,
        formData.knowledge,
        combinedData.level,
        combinedData.program,
        formData.deadline,
        notes,
        status,
        SUPERVISOR_id,
        groups
      );
      setInsertProposals(insertProposal);
      toast.success("Your proposal submitted successfully!", {
        position: toast.POSITION.TOP_CENTER,
      });
      navigate("/thesis-proposals");
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
          className="container mt-5 p-4 bg-light rounded shadow mt-10"
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

          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="level" className="form-label block">
                Level:
              </label>
              <Select
                defaultValue={selectedLevel}
                onChange={setSelectedLevel}
                options={levels}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="programmes" className="form-label block">
                CdS /programmes:
              </label>
              <Select
                defaultValue={selectedProgram}
                onChange={setSelectedProgram}
                options={programs}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="type" className="form-label block">
                Type:
              </label>
              <Select
                defaultValue={selectedType}
                onChange={setSelectedType}
                options={options}
              />
            </div>

            <div className="col-md-6">
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
          </div>

          <div className="mb-3">
            <label htmlFor="keywords" className="form-label block">
              Keywords:
            </label>
            <TagsInput
              value={selectedKeywords}
              onChange={handleTagsChange}
              name="keywoards"
              placeHolder="Enter keywoards"
            />
          </div>

          <div className="d-flex justify-content-end mt-4">
            <Button text={"Confirm"} onClick={handleSubmit}></Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default InsertProposal;
