import React from "react";
import MyNavbar from "./Navbar";
import { Row, Col, Nav, Container, Dropdown, DropdownButton, Form } from 'react-bootstrap'
import Button from "./Button";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import BadButton from "./BadButton";


export default function AcceptApplications() {

    const proposalDetails = {
        title: "Thesis 1",
        description: 'CV description',
        motivational: 'motivational msg'
      };
      return (
        <>
          <MyNavbar />
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
                <strong>{proposalDetails.description}</strong>
              </div>
              <div className="mb-3">
                {proposalDetails.motivational}
              </div>
              <div className="row">
                <div className="col text-center">
                  <BadButton text={"REJECT"}></BadButton>
                </div>
                <div className="col text-center">
                <Button text={"ACCEPT"}></Button>
                </div>
              </div>
            </form>
          </div>
        </>
      );
}
