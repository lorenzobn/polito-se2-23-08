import React from "react";
import MyNavbar from "./Navbar";
import {Row, Col, Nav, Container, Dropdown, DropdownButton, Form} from 'react-bootstrap'
import Button from "./Button";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function MyProposals() {

    const navigate = useNavigate()
    const thesisList = [
        {
            id: 1,
            title: 'THESIS 1',
            description: `Across MIT, faculty help set the global standard of excellence in their disciplines: They are pioneering scholars who love to teach. Deeply engaged in practice, they&nbsp;topple conventional walls between fields in the push for deeper understanding and fresh ideas. In fact, many&nbsp;faculty&nbsp;actively work in at least one of MIT’s&nbsp;interdisciplinary labs, centers, initiatives, and institutes that target crucial challenges, from <a href="http://energy.mit.edu/" target="_blank">clean energy</a> to <a href="https://ki.mit.edu/" target="_blank">cancer</a>.`
        },
        {
            id: 2,
            title: 'THESIS 232323',
            description: 'The MIT Schwarzman College of Computing, opened in fall 2019, is a cross-cutting entity with education and research links across all five schools.'
        }
    ]
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
                                        placeholder="Search"
                                        className=" mr-sm-2"
                                    />
                                </Col>
                                <Col className="d-flex justify-content-center">
                                    <Button text={"search"} icon={faMagnifyingGlass}></Button>
                                </Col>
                            </Row>
                        </Form>
                        <Button text={'new'} icon={faPlus} onClick={() => {navigate('/insertProposal')}}></Button>
                    </Col>
                </Row>
                <Row className="border-thesis-div">
                    <Col lg={2} className="d-flex justify-content-center border-thesis-filter">
                        <Nav variant="underline" className="justify-content-center flex-column">
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
                            thesisList.map((e) =>
                                <div key={e.id} className="thesis-section">
                                    <header>
                                        <h2 className="border-thesis-title"><Nav.Link href="/thesis">{e.title}</Nav.Link></h2>
                                    </header>
                                    <div >
                                        <div >
                                            <p>{e.description}</p>
                                            <p><a className="border-thesis-view">VIEW</a></p>
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
