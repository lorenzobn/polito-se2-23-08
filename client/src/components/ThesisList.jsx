import React from "react";
import MyNavbar from "./Navbar";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Stack from 'react-bootstrap/Stack'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

function ThesisList(props) {

    return (
        <>
        <MyNavbar></MyNavbar>
            <Container style={{paddingTop:'10%'}}>  
                <Row className="justify-content-between thesis-form-section">
                    <Col className="d-flex justify-content-around" lg={{span:10, offset:2}}>
                        <DropdownButton variant="light" id="dropdown-item-button" title="Grade Type">
                            <Dropdown.Header>Grade</Dropdown.Header>
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
                                <Col xs="auto">
                                    <Button variant='light' type="submit">Submit</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <Row className="justify-content-start border-thesis-div">
                    <Col className="d-flex justify-content-center border-thesis-filter">
                        <h2>order by</h2>
                    </Col>
                    <Col lg={10}>
                        <div className="thesis-section">
                            <header>
                                <h2 className="border-thesis-title">Schools, Departments &amp; the College</h2>
                            </header>
                            <div >
                                <div >
                                    <p>Across MIT, faculty help set the global standard of excellence in their disciplines: They are pioneering scholars who love to teach. Deeply engaged in practice, they&nbsp;topple conventional walls between fields in the push for deeper understanding and fresh ideas. In fact, many&nbsp;faculty&nbsp;actively work in at least one of MIT’s&nbsp;interdisciplinary labs, centers, initiatives, and institutes that target crucial challenges, from <a href="http://energy.mit.edu/" target="_blank">clean energy</a> to <a href="https://ki.mit.edu/" target="_blank">cancer</a>.</p>
                                    <p>The MIT Schwarzman College of Computing, opened in fall 2019, is a cross-cutting entity with education and research links across all five schools.</p>
                                    <p><a  href="/education/schools-and-departments/">Explore Departments</a></p>
                                </div>
                            </div>
                        </div>
                        <div className="thesis-section">
                            <header>
                                <h2 className="border-thesis-title">Schools, Departments &amp; the College</h2>
                            </header>
                            <div >
                                <div >
                                    <p>Across MIT, faculty help set the global standard of excellence in their disciplines: They are pioneering scholars who love to teach. Deeply engaged in practice, they&nbsp;topple conventional walls between fields in the push for deeper understanding and fresh ideas. In fact, many&nbsp;faculty&nbsp;actively work in at least one of MIT’s&nbsp;interdisciplinary labs, centers, initiatives, and institutes that target crucial challenges, from <a href="http://energy.mit.edu/" target="_blank">clean energy</a> to <a href="https://ki.mit.edu/" target="_blank">cancer</a>.</p>
                                    <p>The MIT Schwarzman College of Computing, opened in fall 2019, is a cross-cutting entity with education and research links across all five schools.</p>
                                    <p><a  href="/education/schools-and-departments/">Explore Departments</a></p>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>    
        </>
    )
}

export default ThesisList