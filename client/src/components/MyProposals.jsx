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
import {
  faBoxArchive,
  faHand,
  faPlus,
  faTrash,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import {
  MdOutlineEdit,
  MdOutlineDelete,
  MdOutlineArchive,
  MdContentCopy,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../core/store/Provider";
import { toast } from "react-toastify";

export default function MyProposals() {
  const navigate = useNavigate();
  const store = useContext(StoreContext);
  const [proposals, setProposals] = useState([]);
  const [applications, setApplications] = useState([]);
  const [archivedProposals, setArchivedProposals] = useState([]);
  const [proposalData, setProposalData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [proposalIdToDelete, setProposalIdToDelete] = useState(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [proposalIdToArchive, setProposalIdToArchive] = useState(null);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [proposalIdToCopy, setProposalIdToCopy] = useState(null);

  const handleEdit = (e) => {
    if (applications.some((app) => app.thesis_id === e.id)) {
      toast.error(
        "You can't update the proposal if applications are submitted.",
        {
          position: toast.POSITION.TOP_CENTER,
        }
      );
    } else {
      setProposalData(e);
      navigate(`/editProposal/${e.id}`, { state: { proposalData: e } });
    }
  };

  useEffect(() => {
    // since the handler function of useEffect can't be async directly
    // we need to define it separately and run it
    const handleEffect = async () => {
      let now = await store.getVirtualClockValue();
      if (store.user.type === "student") {
        const proposalsRes = await store.getProposals();

        setProposals(
          proposalsRes.filter(
            (e) =>
              (e.status === "active" || e.status === "pending") &&
              new Date(e.deadline) > new Date(now)
          )
        );
      }
      if (store.user.type === "professor") {
        const proposalsRes = await store.getProposalsByTeacherId();

        const applications = await store.getReceivedApplications();
        setProposals(
          proposalsRes.filter(
            (e) =>
              (e.status === "active" || e.status === "pending") &&
              new Date(e.deadline) > new Date(now)
          )
        );
        setApplications(applications);
        setArchivedProposals(
          proposalsRes.filter(
            (e) =>
              e.status === "archived" || new Date(e.deadline) < new Date(now)
          )
        );
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
                              <MdOutlineArchive
                                className="dropdown-icon"
                                size={18}
                              />
                              Archive
                            </Dropdown.Item>

                            <Dropdown.Item
                              style={{
                                color: "#555",
                                marginTop: "8px",
                                paddingBottom: "8px",
                                borderBottom: "1px solid #eee",
                              }}
                              onClick={() => {
                                setShowCopyModal(true);
                                setProposalIdToCopy(e.id);
                              }}
                            >
                              <MdContentCopy
                                className="dropdown-icon"
                                size={20}
                              />
                              Copy
                            </Dropdown.Item>

                            <Modal
                              show={showCopyModal}
                              onHide={() => setShowCopyModal(false)}
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>Confirm Copy</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                Are you sure you want to Copy the proposal{" "}
                                <strong>{e.title}</strong> ? After doing this
                                action the students will see a duplicated
                                proposal. You can always archive or delete it
                                later.
                              </Modal.Body>
                              <Modal.Footer className="modal-footer d-flex justify-content-end">
                                <Button
                                  variant="grey"
                                  className="mx-2"
                                  onClick={() => {
                                    setShowCopyModal(false);
                                    setProposalIdToCopy(null);
                                  }}
                                  text={"CANCEL"}
                                  icon={faHand}
                                ></Button>

                                <Button
                                  variant="primary"
                                  className="mx-2"
                                  onClick={async () => {
                                    const res = await store.copyProposal(
                                      proposalIdToCopy
                                    );
                                    setShowCopyModal(false);
                                  }}
                                  text={"COPY"}
                                  icon={faCopy}
                                ></Button>
                              </Modal.Footer>
                            </Modal>

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
                                    if(res.data){
                                      toast.success(
                                        `Your proposal "${e.title}" has been deleted successfully!`,
                                        {
                                          position: toast.POSITION.TOP_CENTER,
                                        }
                                      );
                                    } else {
                                      toast.error(
                                        `${res.msg}`,
                                        {
                                          position: toast.POSITION.TOP_CENTER,
                                        }
                                      );
                                    }
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
                                  text={"CANCEL"}
                                  icon={faHand}
                                ></Button>

                                <Button
                                  variant="primary"
                                  className="mx-2"
                                  onClick={async () => {
                                    const res = await store.archiveProposal(
                                      proposalIdToArchive
                                    );
                                    if(res.data){
                                      toast.success(
                                        `Your proposal "${e.title}" has been archived successfully!`,
                                        {
                                          position: toast.POSITION.TOP_CENTER,
                                        }
                                      );
                                    } else {
                                      toast.error(
                                        `${res.msg}`,
                                        {
                                          position: toast.POSITION.TOP_CENTER,
                                        }
                                      );
                                    }
                                    setShowArchiveModal(false);
                                  }}
                                  text={"ARCHIVE"}
                                  icon={faBoxArchive}
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
                  <p className="ms-5 ps-3">
                    You don't have any archived proposals yet
                  </p>
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
                            </Dropdown.Item>*/}
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
                                    toast.error(res.response.data.msg, {
                                      position: toast.POSITION.TOP_CENTER,
                                    });
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
                                  text={"CANCEL"}
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
                                  text={"ARCHIVE"}
                                  icon={faBoxArchive}
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
