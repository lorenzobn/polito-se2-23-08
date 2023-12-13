import React , { useState, useContext, useEffect } from "react";
import MyNavbar from "./Navbar";
import {Row, Col, Nav, Container, Dropdown, DropdownButton, Form, Modal} from 'react-bootstrap'
import Button from "./Button";
import { faMagnifyingGlass, faPlus} from "@fortawesome/free-solid-svg-icons";
import { FaEdit, FaTrashAlt, FaSyncAlt, FaCopy } from 'react-icons/fa';
import { MdOutlineEdit, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../core/store/Provider";


export default function MyProposals() {

    const navigate = useNavigate()
    const store = useContext(StoreContext);
    const [proposals, setProposals] = useState([]);
    const [proposalData, setProposalData] = useState([]);
    const [showModal, setShowModal] = useState(false);
   

    const handleDelete = () => {
        setShowModal(true);
    };

    const deleteProposal = () => {
        // We will delete the proposal here
        setShowModal(false);
    };

    const handleEdit = (e) => {
        setProposalData(e);
        navigate(`/editProposal/${e.id}` , { state: { proposalData: e } });
        console.log(e);
        
    };

    useEffect(() => {
        // since the handler function of useEffect can't be async directly
        // we need to define it separately and run it
        const handleEffect = async () => {
          let s = await store.fetchSelf();
          if (store.user.type === 'student'){
            const proposals = await store.getProposals();
            setProposals(proposals);
          }
          if (store.user.type === 'professor'){
            const proposals = await store.getProposalsByTeacherId();
            setProposals(proposals);
          }
        };
        handleEffect();
    }, [store.user.type]);

    return (
        <>
            <MyNavbar></MyNavbar>
            <Container fluid>
                <Row className="justify-content-between thesis-form-section">
                    <Col className="d-flex justify-content-end" lg={{ span: 4, offset: 6 }}>
                        <Button text={'New Proposal'} icon={faPlus} onClick={() => {navigate('/insertProposal')}}></Button>
                    </Col>
                </Row>
                <Row className="border-thesis-div">
                    
                    <Col lg={{span:8, offset:2}}>
                        {
                            proposals.map((e) =>
                                <div key={e.id} className="thesis-section">
                                    <header>
                                        <h2 className="border-thesis-title">
                                            <Nav.Link href={`/proposalpage/${e.id}`}>{e.title}</Nav.Link>
                                        <Dropdown>
                                            <Dropdown.Toggle className="custom-dropdown-toggle" id="dropdown-basic">
                                                ⋮
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handleEdit(e)} >Edit<MdOutlineEdit className="dropdown-icon" size={18}/></Dropdown.Item>
                                               
                                                <Dropdown.Item href="#/action-2">Copy<FaCopy className="dropdown-icon" size={18}/></Dropdown.Item>
                                                <Dropdown.Item onClick={handleDelete}>Delete<MdDelete className="dropdown-icon" size={20}/></Dropdown.Item>

                                                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>Confirm Delete</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>Are you sure you want to delete the proposal <strong>{e.title}</strong>?</Modal.Body>
                                                        <Modal.Footer className="modal-footer">
                                                            <Button variant="primary" className="modal-button" onClick={() => setShowModal(false)} text={"KEEP"}></Button>
      
                                                            <Button variant="primary" className="modal-button" onClick={deleteProposal} text={"DELETE"}></Button>
                                                                
                                                            
                                                        </Modal.Footer>
                                                    </Modal>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        </h2>
                                    </header>
                                    <div >
                                        <div className="description-container" >
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
