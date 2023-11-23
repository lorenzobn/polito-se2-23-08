import React , { useState, useContext, useEffect } from "react";
import MyNavbar from "./Navbar";
import {Row, Col, Nav, Container, Dropdown, DropdownButton, Form} from 'react-bootstrap'
import Button from "./Button";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../core/store/Provider";

export default function MyProposals() {

    const navigate = useNavigate()
    const store = useContext(StoreContext);
    const [proposals, setProposals] = useState([]);

    useEffect(() => {
        // since the handler function of useEffect can't be async directly
        // we need to define it separately and run it
        const handleEffect = async () => {
          if (localStorage.getItem('type') === 'student'){
            const proposals = await store.getProposals();
            setProposals(proposals);
          }
          if (localStorage.getItem('type') === 'professor'){
            const proposals = await store.getProposalsByTeacherId();
            setProposals(proposals);
          }
        };
        handleEffect();
    }, [localStorage.getItem('type')]);

    return (
        <>
            <MyNavbar></MyNavbar>
            <Container fluid>
                <Row className="justify-content-between thesis-form-section">
                    <Col className="d-flex justify-content-around" lg={{ span: 10, offset: 2 }}>
                        <DropdownButton variant="light" id="dropdown-item-button" title="Degree Level">
                            <Dropdown.Item as="button">Bachelor</Dropdown.Item>
                            <Dropdown.Item as="button">Master</Dropdown.Item>
                            <Dropdown.Item as="button">PHD</Dropdown.Item>
                        </DropdownButton>
                        <Form inline='true'>
                            <Row>
                                <Col xs="auto">
                                    <Form.Control
                                        type="text"
                                        placeholder="Search Proposal"
                                        className=" mr-sm-2"
                                    />
                                </Col>
                                <Col className="d-flex justify-content-center">
                                    <Button text={"Search"} icon={faMagnifyingGlass}></Button>
                                </Col>
                            </Row>
                        </Form>
                        <Button text={'New Proposal'} icon={faPlus} onClick={() => {navigate('/insertProposal')}}></Button>
                    </Col>
                </Row>
                <Row className="border-thesis-div">
                    <Col lg={2} className="d-flex justify-content-center border-thesis-filter">
                        <Nav variant="underline" className="justify-content-start flex-column mt-4">
                            <Nav.Item className="d-inline-flex">
                                <Nav.Link className="filter-decoration" eventKey='research'>By Research Group</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="d-inline-flex">
                                <Nav.Link className="filter-decoration" eventKey="authors">By Supervisor</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="d-inline-flex">
                                <Nav.Link className="filter-decoration" eventKey="title">By Title</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="d-inline-flex">
                                <Nav.Link className="filter-decoration" eventKey="sub">By Subject</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col lg={8}>
                        {
                            proposals.map((e) =>
                                <div key={e.id} className="thesis-section">
                                    <header>
                                        <h2 className="border-thesis-title"><Nav.Link href={`/proposalpage/${e.id}`}>{e.title}</Nav.Link></h2>
                                    </header>
                                    <div >
                                        <div >
                                            <p>{e.description}</p>
                                            <p><a className="border-thesis-view" href={`/proposalpage/${e.id}`}>VIEW PROPOSAL </a></p>
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
