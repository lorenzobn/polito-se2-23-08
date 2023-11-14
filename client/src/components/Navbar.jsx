import React, {useContext} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../core/store/Provider';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser
  } from "@fortawesome/free-solid-svg-icons";

function MyNavbar() {
    
    const store = useContext(StoreContext)

    return (
        <Navbar expand="lg" className='secondary-menu sticky-top'>
            <Container fluid>
            <FontAwesomeIcon style={{color:'white'}} icon={faUser} />

                <Navbar.Brand style={{marginLeft:'7%'}} href="/portal"><img
                    src='../../images/logo_poli_bianco_260.png'
                /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse style={{fontSize:'130%'}}>
                    <Nav variant='underline' style={{marginLeft:'25%'}}>
                        {store.user.type === 'student'? <Nav.Link className='text-white' href="/">Thesis</Nav.Link> : <Nav.Link  className='text-white' href="/">Applications</Nav.Link>}
                        {store.user.type === 'student'? <Nav.Link style={{marginLeft:'30px'}} className='text-white' href="/">My Applications</Nav.Link> : <Nav.Link style={{marginLeft:'30px'}} className='text-white' href="/insertProposal">My Proposals</Nav.Link>}
                    </Nav>
                    <NavDropdown style={{marginLeft:'35%'}} title={
                        <FontAwesomeIcon style={{color:'white'}} icon={faUser} />
                    }>
                        <NavDropdown.Item href="/portal">My Profile</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/portal">Settings</NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        
    );
}

export default observer(MyNavbar)