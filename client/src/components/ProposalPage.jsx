import Navbar from "./Navbar";
import React, { useState, useEffect } from "react";

function ProposalPage() {
  const proposalDetails = {
    title: "Title",
    description:
      "In the realm of artificial intelligence, algorithms dance in the circuits of silicon minds, orchestrating a symphony of binary brilliance. Lines of code, like digital neurons, weave intricate patterns of logic and learning, giving rise to machines that navigate the seas of data with electronic finesse. In this digital tapestry, algorithms evolve, mirroring the relentless march of progress in a world where silicon dreams meet human ingenuity. As the algorithms hum in the heart of machines, the future unfolds in the language of zeros and ones, a technological sonnet sung by the collective intelligence of the digital age.",
    requiredKnowledge: "Required Knowledge Details",
    level: "PhD",
    group: "Artificial Intelligent",
    cds: "Computer Engineering",
    type: "Research",
    deadline: "2023-11-15",
    keywords: "ML, NL, Python",
    supervisor: "Professor Torchiano",
  };
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <form
          className="mx-auto p-4 bg-light rounded shadow"
          style={{ marginTop: "150px" }}
        >
          <div className="mb-3 mt-1 text-center">
            <strong>
              <h1>{proposalDetails.title}</h1>
            </strong>
          </div>
          <div className="mb-3">
            <strong>Supervisor:</strong> {proposalDetails.supervisor}
          </div>
          <div className="mb-3">
            <strong>Deadline:</strong> {proposalDetails.deadline}
          </div>
          <div className="mb-3">
            <strong>{proposalDetails.description}</strong>
          </div>
          <div className="mb-3">
            <strong>Keywords:</strong> {proposalDetails.keywords}
          </div>
          <div className="row g-3 mb-3">
            <div className="col-md-2">
              <strong>Level:</strong> {proposalDetails.level}
            </div>
            <div className="col-md-3">
              <strong>CdS:</strong> {proposalDetails.cds}
            </div>
            <div className="col-md-3">
              <strong>Group:</strong> {proposalDetails.group}
            </div>
            <div className="col-md-3">
              <strong>Type:</strong> {proposalDetails.type}
            </div>
          </div>
          <div className="mb-3">
            <strong>Required Knowledge:</strong>{" "}
            {proposalDetails.requiredKnowledge}
          </div>
          <div className="row">
            <div className="col text-start">
              <button type="button" className="btn btn-secondary">
                Back
              </button>
            </div>
            <div className="col text-end">
              <button type="button" className="btn btn-primary">
                Apply
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default ProposalPage;
