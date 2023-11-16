import React, { useContext } from 'react';
import { Container, Row, Nav, NavDropdown, Col } from 'react-bootstrap';
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../core/store/Provider';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Button from './Button';

function MyNavbar() {

    const store = useContext(StoreContext)

    return (
        <Container className='nav-wrap' fluid>
                <Row className='upper-nav'>
                    <Col lg={{span:4, offset:8}}>
                        <Button text={'Login'} icon={faUser}></Button>
                    </Col>
                </Row>
                <Row className='mid-nav align-items-around'>
                    <Col>
                        <a style={{ marginLeft: '5%' }} href="/thesis"><img
                            className='my-2' width={'35%'} src='../../images/polito_logo_2021_blu.jpg'
                        /></a>
                    </Col>
                    <Col>
                        <div style={{textAlign:'center'}}>
                            
                            <h1 style={{fontSize:'350%'}}>THESIS@POLITO</h1>
                        </div>
                    </Col>
                </Row>
                <Row className='lower-nav align-items-center'>
                    <Col className='d-flex justify-content-around'>
                        <div style={{lineHeight:'200%'}}>
                            <Nav variant='underline'>
                                {store.user.type === 'student' ? <Nav.Link className='d-inline-flex text-white' href="/">THESIS</Nav.Link> : <Nav.Link className='text-white' href="/applications">APPLICATIONS</Nav.Link>}
                                {store.user.type === 'student' ? <Nav.Link style={{ marginLeft: '30px' }} className='text-white' href="/">MY APPLICATIONS</Nav.Link> : <Nav.Link style={{ marginLeft: '30px' }} className='text-white' href="/Myproposals">MY PROPOSAL</Nav.Link>}
                            </Nav>
                        </div>
                    </Col>
                    <Col className='d-flex justify-content-end'>
                            <NavDropdown title={
                                    <FontAwesomeIcon style={{ color: 'white', fontSize: '30px' }} icon={faUser} />
                                }>
                                    <NavDropdown.Item href="/portal">My Profile</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="/portal">Settings</NavDropdown.Item>
                            </NavDropdown>   
                    </Col>
                            
                </Row>
        </Container>
    );
}

export default observer(MyNavbar)