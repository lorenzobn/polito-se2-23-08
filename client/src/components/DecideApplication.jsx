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
        title: "Investigating the biomedical applications of coordination cages",
        student: 'Mario Rossi s1234',
        status: 'idle',
        cv_uri: 'https://www.google.com'
        //motivational: 'motivational msg'
      };
      return (
        <>
          <MyNavbar />
          <strong>
          <p className= " h2 text-center mt-5 ">{proposalDetails.title}</p>
          </strong>
          <div className="container mt-5 mb-3">
            <form
              className="mx-auto p-4 bg-light rounded shadow"
              style={{ marginTop: "1px" }}
            >
              <div className="mb-3 mt-1 text-center">
                <strong>
                  <h1 className="text-start ms-3">{proposalDetails.student}</h1>
                </strong>
              </div>
              <div className=" text-start ms-3 mb-3">
                <strong>Status: {proposalDetails.status}</strong>
              </div>
              <div className=" text-start ms-3 mb-3">
                {proposalDetails.cv_uri}
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


          <div className="container mt-5 mb-3">
            <form
              className="mx-auto p-4 bg-light rounded shadow"
              style={{ marginTop: "1px" }}
            >
              <div className="mb-3 mt-1 text-center">
                <strong>
                  <h1 className="text-start ms-3">{proposalDetails.student}</h1>
                </strong>
              </div>
              <div className=" text-start ms-3 mb-3">
                <strong>Status: {proposalDetails.status}</strong>
              </div>
              <div className=" text-start ms-3 mb-3">
                {proposalDetails.cv_uri}
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


          <div className="container mt-5 mb-3">
            <form
              className="mx-auto p-4 bg-light rounded shadow"
              style={{ marginTop: "1px" }}
            >
              <div className="mb-3 mt-1 text-center">
                <strong>
                  <h1 className="text-start ms-3">{proposalDetails.student}</h1>
                </strong>
              </div>
              <div className=" text-start ms-3 mb-3">
                <strong>Status: {proposalDetails.status}</strong>
              </div>
              <div className=" text-start ms-3 mb-3">
                {proposalDetails.cv_uri}
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
          




         
              
          
            


        </>
      );
}
