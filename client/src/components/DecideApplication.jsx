import React from "react";
import MyNavbar from "./Navbar";
import { Row, Col, Nav, Container, Dropdown, DropdownButton, Form } from 'react-bootstrap'
import Button from "./Button";
import { faCheck, faMagnifyingGlass, faX } from "@fortawesome/free-solid-svg-icons";
import BadButton from "./BadButton";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function AcceptApplications() {


  const navigate = useNavigate();

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
              style={{ marginTop: "1px" }}
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
                  <BadButton icon={faX} text={"REJECT"} onClick={() => toast('You have successfully rejected the proposal')} ></BadButton>
                </div>
                <div className="col text-center">
                <Button  icon={faCheck} text={"ACCEPT"} onClick={() => toast('You have succesfully accepted the proposal')}></Button>
                </div>
              </div>
            </form>
          </div>


          <div className="container mt-5">
            <form
              className="mx-auto p-4 bg-light rounded shadow"
              style={{ marginTop: "1px" }}
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
                  <BadButton icon={faX} text={"REJECT"} onClick={() => navigate('/rejection-confirmed')} ></BadButton>
                </div>
                <div className="col text-center">
                <Button  icon={faCheck} text={"ACCEPT"} onClick={() => navigate('/acceptance-confirmed')}></Button>
                </div>
              </div>
            </form>
          </div>



          <div className="container mt-5">
            <form
              className="mx-auto p-4 bg-light rounded shadow"
              style={{ marginTop: "1px" }}
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
                  <BadButton icon={faX} text={"REJECT"} onClick={() => navigate('/rejection-confirmed')} ></BadButton>
                </div>
                <div className="col text-center">
                <Button  icon={faCheck} text={"ACCEPT"} onClick={() => navigate('/acceptance-confirmed')}></Button>
                </div>
              </div>
            </form>
          </div>


        </>
      );
}
