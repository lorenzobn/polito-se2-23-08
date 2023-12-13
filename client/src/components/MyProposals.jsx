import React, { useState, useContext, useEffect } from "react";
import MyNavbar from "./Navbar";
import {
  Row,
  Col,
  Nav,
  Container,
  Dropdown,
  Modal,
  Tabs,
  Tab,
} from "react-bootstrap";
import Button from "./Button";
import { faHand, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FaEdit, FaTrashAlt, FaSyncAlt, FaCopy } from "react-icons/fa";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../core/store/Provider";

export default function MyProposals() {
  const navigate = useNavigate();
  const store = useContext(StoreContext);
  const [proposals, setProposals] = useState([]);
  const [archivedProposals, setArchivedProposals] = useState([]);
  const [proposalData, setProposalData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [proposalIdToDelete, setProposalIdToDelete] = useState(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [proposalIdToArchive, setProposalIdToArchive] = useState(null);
  const handleEdit = (e) => {
    setProposalData(e);
    navigate(`/editProposal/${e.id}`, { state: { proposalData: e } });
  };

  useEffect(() => {
    // since the handler function of useEffect can't be async directly
    // we need to define it separately and run it
    const handleEffect = async () => {
      let s = await store.fetchSelf();
      if (store.user.type === "student") {
        const proposals = await store.getProposals();
        setProposals(
          proposals.filter(
            (e) => e.status === "active" || e.status === "pending"
          )
        );
      }
      if (store.user.type === "professor") {
        const proposals = await store.getProposalsByTeacherId();
        setProposals(
          proposals.filter(
            (e) => e.status === "active" || e.status === "pending"
          )
        );
        setArchivedProposals(proposals.filter((e) => e.status === "archived"));
      }
    };
    handleEffect();
  }, [store.user.type]);

  return (
    <>
      <MyNavbar></MyNavbar>
      <Container fluid>
        <Row className="justify-content-between thesis-form-section">
          <Col
            className="d-flex justify-content-end"
            lg={{ span: 4, offset: 6 }}
          >
            <Button
              text={"New Proposal"}
              icon={faPlus}
              onClick={() => {
                navigate("/insertProposal");
              }}
            ></Button>
          </Col>
        </Row>
        <Row className="">
          <Col lg={{ span: 8, offset: 2 }}>
            <Tabs
              defaultActiveKey="Proposals"
              id="uncontrolled-tab-example"
              className="mb-5 ml-4"
              style={{ width: "95%", marginLeft: "5%" }}
            >
              <Tab eventKey="Proposals" title="Active">
                {" "}
                {proposals.map((e) => (
                  <div key={e.id} className="thesis-section">
                    <header>
                      <h2 className="border-thesis-title">
                        <Nav.Link href={`/proposalpage/${e.id}`}>
                          {e.title}
                        </Nav.Link>
                        <Dropdown style={{ border: "none" }}>
                          <Dropdown.Toggle
                            className="custom-dropdown-toggle"
                            id="dropdown-basic"
                          >
                            ⋮
                          </Dropdown.Toggle>
                          <Dropdown.Menu style={{ color: "red" }}>
                            <Dropdown.Item
                              onClick={() => handleEdit(e)}
                              style={{
                                color: "#555",
                                paddingBottom: "8px",
                                borderBottom: "1px solid #eee",
                              }}
                            >
                              <MdOutlineEdit
                                className="dropdown-icon"
                                size={18}
                              />
                              Edit
                            </Dropdown.Item>

                            <Dropdown.Item
                              style={{
                                color: "#555",
                                marginTop: "8px",
                                paddingBottom: "8px",
                                borderBottom: "1px solid #eee",
                              }}
                              onClick={() => {
                                setShowArchiveModal(true);
                                setProposalIdToArchive(e.id);
                              }}
                            >
                              <FaCopy className="dropdown-icon" size={18} />
                              Archive
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                setShowDeleteModal(true);
                                setProposalIdToDelete(e.id);
                              }}
                              style={{ color: "#ff666b", marginTop: "8px" }}
                            >
                              <MdOutlineDelete
                                className="dropdown-icon"
                                size={20}
                              />
                              Delete
                            </Dropdown.Item>

                            <Modal
                              show={showDeleteModal}
                              onHide={() => setShowDeleteModal(false)}
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>Confirm Delete</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                Are you sure you want to delete the proposal{" "}
                                <strong>{e.title}</strong>?
                              </Modal.Body>
                              <Modal.Footer className="modal-footer d-flex justify-content-end">
                                <Button
                                  variant="grey"
                                  className="mx-2"
                                  onClick={() => {
                                    setShowDeleteModal(false);
                                    setProposalIdToDelete(null);
                                  }}
                                  text={"KEEP"}
                                  icon={faHand}
                                ></Button>

                                <Button
                                  variant="danger"
                                  className="mx-2"
                                  onClick={async () => {
                                    const res = await store.deleteProposal(
                                      proposalIdToDelete
                                    );
                                    console.log(res);
                                    setShowDeleteModal(false);
                                  }}
                                  text={"DELETE"}
                                  icon={faTrash}
                                ></Button>
                              </Modal.Footer>
                            </Modal>

                            <Modal
                              show={showArchiveModal}
                              onHide={() => setShowArchiveModal(false)}
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>Confirm Archive</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                Are you sure you want to Archive the proposal?
                                After doing this action the students will not be
                                able to see the proposal anymore. You can always
                                unarchive it later.
                              </Modal.Body>
                              <Modal.Footer className="modal-footer d-flex justify-content-end">
                                <Button
                                  variant="grey"
                                  className="mx-2"
                                  onClick={() => {
                                    setShowArchiveModal(false);
                                    setProposalIdToArchive(null);
                                  }}
                                  text={"Cancel"}
                                  icon={faHand}
                                ></Button>

                                <Button
                                  variant="primary"
                                  className="mx-2"
                                  onClick={async () => {
                                    const res = await store.archiveProposal(
                                      proposalIdToArchive
                                    );
                                    setShowArchiveModal(false);
                                  }}
                                  text={"ARHIVE"}
                                  icon={faTrash}
                                ></Button>
                              </Modal.Footer>
                            </Modal>
                          </Dropdown.Menu>
                        </Dropdown>
                      </h2>
                    </header>
                    <div>
                      <div className="description-container">
                        <p>{e.description}</p>
                        <p>
                          <a
                            className="border-thesis-view"
                            href={`/proposalpage/${e.id}`}
                          >
                            VIEW PROPOSAL{" "}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </Tab>
              <Tab eventKey="Archive" title="Archived">
                {archivedProposals.length === 0 && (
                  <p className="ms-5 ps-3">You don't have any archived proposals yet</p>
                )}
                {archivedProposals.map((e) => (
                  <div key={e.id} className="thesis-section">
                    <header>
                      <h2 className="border-thesis-title">
                        <Nav.Link href={`/proposalpage/${e.id}`}>
                          {e.title}
                        </Nav.Link>
                        <Dropdown style={{ border: "none" }}>
                          <Dropdown.Toggle
                            className="custom-dropdown-toggle"
                            id="dropdown-basic"
                          >
                            ⋮
                          </Dropdown.Toggle>
                          <Dropdown.Menu style={{ color: "red" }}>
                            <Dropdown.Item
                              onClick={() => handleEdit(e)}
                              style={{
                                color: "#555",
                                paddingBottom: "8px",
                                borderBottom: "1px solid #eee",
                              }}
                            >
                              <MdOutlineEdit
                                className="dropdown-icon"
                                size={18}
                              />
                              Edit
                            </Dropdown.Item>

                            {/* <Dropdown.Item
                              style={{
                                color: "#555",
                                marginTop: "8px",
                                paddingBottom: "8px",
                                borderBottom: "1px solid #eee",
                              }}
                              onClick={() => {
                                setShowArchiveModal(true);
                                setProposalIdToArchive(e.id);
                              }}
                            >
                              <FaCopy className="dropdown-icon" size={18} />
                              Unarchive
                            </Dropdown.Item> */}
                            <Dropdown.Item
                              onClick={() => {
                                setShowDeleteModal(true);
                                setProposalIdToDelete(e.id);
                              }}
                              style={{ color: "#ff666b", marginTop: "8px" }}
                            >
                              <MdOutlineDelete
                                className="dropdown-icon"
                                size={20}
                              />
                              Delete
                            </Dropdown.Item>

                            <Modal
                              show={showDeleteModal}
                              onHide={() => setShowDeleteModal(false)}
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>Confirm Delete</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                Are you sure you want to delete the proposal{" "}
                                <strong>{e.title}</strong>?
                              </Modal.Body>
                              <Modal.Footer className="modal-footer d-flex justify-content-end">
                                <Button
                                  variant="grey"
                                  className="mx-2"
                                  onClick={() => {
                                    setShowDeleteModal(false);
                                    setProposalIdToDelete(null);
                                  }}
                                  text={"KEEP"}
                                  icon={faHand}
                                ></Button>

                                <Button
                                  variant="danger"
                                  className="mx-2"
                                  onClick={async () => {
                                    const res = await store.deleteProposal(
                                      proposalIdToDelete
                                    );
                                    console.log(res);
                                    setShowDeleteModal(false);
                                  }}
                                  text={"DELETE"}
                                  icon={faTrash}
                                ></Button>
                              </Modal.Footer>
                            </Modal>

                            <Modal
                              show={showArchiveModal}
                              onHide={() => setShowArchiveModal(false)}
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>Confirm Archive</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                Are you sure you want to Archive the proposal?
                                After doing this action the students will not be
                                able to see the proposal anymore. You can always
                                unarchive it later.
                              </Modal.Body>
                              <Modal.Footer className="modal-footer d-flex justify-content-end">
                                <Button
                                  variant="grey"
                                  className="mx-2"
                                  onClick={() => {
                                    setShowArchiveModal(false);
                                    setProposalIdToArchive(null);
                                  }}
                                  text={"Cancel"}
                                  icon={faHand}
                                ></Button>

                                <Button
                                  variant="primary"
                                  className="mx-2"
                                  onClick={async () => {
                                    const res = await store.archiveProposal(
                                      proposalIdToArchive
                                    );
                                    setShowArchiveModal(false);
                                  }}
                                  text={"ARHIVE"}
                                  icon={faTrash}
                                ></Button>
                              </Modal.Footer>
                            </Modal>
                          </Dropdown.Menu>
                        </Dropdown>
                      </h2>
                    </header>
                    <div>
                      <div className="description-container">
                        <p>{e.description}</p>
                        <p>
                          <a
                            className="border-thesis-view"
                            href={`/proposalpage/${e.id}`}
                          >
                            VIEW PROPOSAL{" "}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </>
  );
}
