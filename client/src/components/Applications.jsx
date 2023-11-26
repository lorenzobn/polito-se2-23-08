import React, { useEffect, useState, useContext } from "react";
import MyNavbar from "./Navbar";
import { Row, Col, Nav, Container, Dropdown, DropdownButton, Form } from 'react-bootstrap'
import Button from "./Button";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { StoreContext } from "../core/store/Provider";

export default function Applications() {

    const store = useContext(StoreContext)
    const [applications, setApplications] = useState([])

    useEffect(() => {
        // since the handler function of useEffect can't be async directly
        // we need to define it separately and run it
        // here I check the localStorage for userType, then in the request the cookie brings the authentication token
        const handleEffect = async () => {
          let s = await store.fetchSelf();
          if (store.user.type === 'student'){
            const applications = await store.getMyApplications();
            setApplications(applications);
          }
          if (store.user.type === 'professor'){
            const applications = await store.getReceivedApplications();
            setApplications(applications);
          }
          
        };
        handleEffect();
      }, [store.user.type]);

    return (
        <>
            <MyNavbar></MyNavbar>
            <Container fluid>
                <Row className="justify-content-between thesis-form-section">
                    <Col className="d-flex justify-content-around" lg={{ span: 8, offset: 2 }}>
                    </Col>
                </Row>
                <Row className="border-thesis-div">
                    <Col lg={{span:8, offset:2 }} >
                        {
                            applications.map((e) =>
                                <div key={e.thesis_id} className="thesis-section">
                                    <header>
                                        <h2 className="border-thesis-title">{store.user.type === 'professor'? 
                                        <Nav.Link href={`received-applications/${e.thesis_id}`}>{e.title}</Nav.Link>: 
                                        <Nav.Link href={`proposalpage/${e.thesis_id}`}>{e.title}</Nav.Link>}</h2>
                                    </header>
                                    <div >
                                        <div >
                                            <p>{e.description}</p>
                                            <p>{e.deadline}</p>
                                            {store.user && store.user.type === 'professor' ? 
                                            <p><a className="border-thesis-view" href={`received-applications/${e.thesis_id}`}>VIEW APPLICATIONS</a></p> : <></>}
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </Col>
                </Row>
            </Container>
        </>
    )
}
