import React, { useState } from 'react';
import Navbar from './Navbar';
import Button from './Button';
import { ToastContainer } from 'react-toastify';
import { useLocation} from 'react-router-dom';
import { useEffect } from 'react';
import Select from 'react-select';
import { StoreContext } from "../core/store/Provider";
import { useContext } from "react";

const levels = [
  { value: "BSc", label: "Bachelor" },
  { value: "MSc", label: "Master" },
];

let cdss = [];
let internal_co_supervisors = [];
let external_co_supervisors = [];



function EditProposal() {


  
const location = useLocation();
const proposalData = location.state.proposalData;
const [selectedKeywords, setSelectedKeywords] = useState(proposalData.keywords);
const [selectedLevel, setSelectedLevel] = useState(proposalData.level);
const [selectedProgram, setSelectedProgram] = useState(proposalData.program);
const [modifiedInternal, setModifiedInternal] = useState(proposalData.internal);
const [modifiedExternal, setModifiedExternal] = useState(proposalData.external);



  

const [formData, setFormData] = useState({
  title: proposalData.title,
  description: proposalData.description,
  knowledge: proposalData.knowledge,
  deadline: proposalData.deadline,
  notes: proposalData.notes,
  type:proposalData.type,
});



const store = useContext(StoreContext);
useEffect(() => {
  setFormData(proposalData);
  setSelectedKeywords(proposalData.keywords);
  setSelectedLevel(proposalData.level);
  setSelectedProgram(proposalData.program);
  console.log(proposalData.program);
  setModifiedInternal(proposalData.internal);
  setModifiedExternal(proposalData.external);
    const handleEffect = async () => {
  //getting cds from server
  const cds = await store.getAllCds();
  for (let index = 0; index < cds.length; index++) {
    cdss[index] = {
      value: cds[index].cod_degree,
      label: cds[index].title_degree,
    };
  }

};
handleEffect();

}, [proposalData]);








      const handleInputChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };
    
      const handleTagsChange = (tags) => {
        setSelectedKeywords(tags);
      };
    

    const handleSubmit = (event) => {
        event.preventDefault();
        // Update the proposal with the new form data...
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
              value={proposalData.title || ''} onChange={handleInputChange} 
            
             
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
              value={proposalData.description || ''}
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
               value={proposalData.knowledge || ''}
               onChange={handleInputChange} 
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label htmlFor="level" className="form-label block">
                Level:
              </label>
              <Select
                 defaultValue={levels.find(option => option.value === selectedLevel)}
                onChange={setSelectedLevel}
                options={levels}
              />
            
            </div>

            <div className="col-md-4">
              <label htmlFor="programmes" className="form-label block">
                CdS /programmes:
              </label>
              <Select
                defaultValue= {selectedProgram}
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
                value={proposalData.deadline}
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
            
           
            
              
            </div>

            <div className="col-md-6">
              <label
                htmlFor="External-co-supervisors"
                className="form-label block"
              >
                External Co-supervisors:
              </label>
             
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
            <Button text={"Confirm"} ></Button>
            <ToastContainer />
          </div>
        </form>
      </div>
    </>

          
    );
}

export default EditProposal;

