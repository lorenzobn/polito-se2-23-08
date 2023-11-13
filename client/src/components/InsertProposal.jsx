import Navbar from "./Navbar";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { TagsInput } from "react-tag-input-component";
import "../App.css";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const levels = [
  { value: "Bachelor", label: "Bachelor" },
  { value: "Master", label: "Master" },
  { value: "PhD", label: "PhD" },
];

const programs = [
  { value: "CE", label: "CE" },
  { value: "ME", label: "ME" },
  { value: "BE", label: "BE" },
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

  const [combinedData, setCombinedData] = useState({
    ...formData,
    keywords: selectedKeywords,
    level: selectedLevel.value,
    group: selectedGroups.value,
    program: selectedProgram.value,
    type: selectedType.value,
  });

  useEffect(() => {
    setCombinedData({
      ...formData,
      keywords: selectedKeywords,
      level: selectedLevel.value,
      group: selectedGroups.value,
      program: selectedProgram.value,
      type: selectedType.value,
    });
  }, [formData, selectedKeywords]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if any of the inputs are empty
    if (
      formData.title.trim() === "" ||
      formData.description.trim() === "" ||
      formData.knowledge.trim() === "" ||
      formData.level.trim() === "" ||
      formData.deadline.trim() === "" ||
      selectedKeywords.length === 0 ||
      selectedLevel.length === 0 ||
      selectedGroups.length === 0 ||
      selectedProgram.length === 0 ||
      selectedType.length === 0
    ) {
      alert("Please fill in all the fields.");
      return;
    }
    console.log("Form submitted!", combinedData);
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
        <h2 className="mb-4 text-4xl font-extrabold text-center text-gray-900">
          Proposal Page
        </h2>
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
                options={programs}
              />
            </div>

            <div className="col-md-4">
              <label htmlFor="groups" className="form-label block">
                Groups:
              </label>
              <Select
                defaultValue={selectedGroups}
                onChange={setSelectedGroups}
                options={groups}
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
            <button
              type="submit"
              className="btn btn-success py-2 px-4 mt-1 mb-2 rounded"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default InsertProposal;
