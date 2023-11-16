import React from "react";
import MyNavbar from "./Navbar";
import { Row, Col, Nav, Container, Dropdown, DropdownButton, Form } from 'react-bootstrap'
import Button from "./Button";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Applications() {

    const thesisList = [
        {
            id: 1,
            title: 'NOME MATRICOLA 1',
            description: `CV description`,
            motivational: 'motivational msg'
        },
        {
            id: 2,
            title: 'NOME MATRICOLA 2',
            description: `CV description`,
            motivational: 'motivational msg'
        }
    ]

    return (
        <>
            <MyNavbar></MyNavbar>
            <Container fluid>
                <Row className="justify-content-between thesis-form-section">
                    <Col className="d-flex justify-content-around" lg={{ span: 8, offset: 2 }}>
                    </Col>
                </Row>
                <Row className="border-thesis-div">
                    <Col lg={{span:9, offset:3 }}>
                        {
                            thesisList.map((e) =>
                                <div key={e.id} className="thesis-section">
                                    <header>
                                        <h2 className="border-thesis-title"><Nav.Link href="/thesis">{e.title}</Nav.Link></h2>
                                    </header>
                                    <div >
                                        <div >
                                            <p>{e.description}</p>
                                            <p>{e.motivational}</p>
                                            <p><a className="border-thesis-view" href="applications/acceptApplication">VIEW APPLICATION</a></p>
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
