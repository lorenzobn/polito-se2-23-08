import React, { useEffect, useContext, useState } from "react";
import MyNavbar from "./Navbar";
import {
  Row,
  Col,
  Nav,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  Offcanvas
} from "react-bootstrap";
import Button from "./Button";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { StoreContext } from "../core/store/Provider";

function ThesisList(props) {
  const store = useContext(StoreContext);
  const [proposals, setProposals] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [degree, setDegree] = useState('All')
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState("")

  useEffect(() => {
    // since the handler function of useEffect can't be async directly
    // we need to define it separately and run it
    const handleEffect = async () => {
      const proposals = await store.getProposals();
      setProposals(proposals);
    };
    handleEffect();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = (filter) => {
    
    setFilter(filter)
    setShow(true)
  };

  const handleSearch = () => {
    store.searchProposal(keyword).then(res => setProposals(res));
  }

  const handleKeyDown = (ev) => {
    if (ev.keyCode == 13) {
      ev.preventDefault()
      handleSearch()
    }
  }

  return (
    <>
      <MyNavbar></MyNavbar>
      <Container fluid>
        <Row className="justify-content-between thesis-form-section">
          <Col
            className="d-flex justify-content-around"
            lg={{ span: 8, offset: 2 }}
          >
            <DropdownButton
              variant="light"
              id="dropdown-item-button"
              title={`Degree Level: ${degree}`}
            >
              <Dropdown.Item as="button" onClick={() => setDegree('All')}>All</Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => setDegree('BSc')}>Bachelor</Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => setDegree('MSc')}>Master</Dropdown.Item>
            </DropdownButton>
            <Form inline="true">
              <Row>
                <Col xs="auto">
                  <Form.Control
                    type="text"
                    placeholder='Search'
                    className=" mr-sm-2"
                    onChange={ev => { setKeyword(ev.target.value) }}
                    onKeyDown={handleKeyDown}
                  />
                </Col>
                <Col className="d-flex justify-content-center">
                  <Button text={"search"} icon={faMagnifyingGlass} onClick={handleSearch}></Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <Row className="border-thesis-div">
          <Col
            lg={2}
            className="d-flex border-thesis-filter"
          >
            <Offcanvas show={show} onHide={handleClose}>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>{filter}</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav>

                </Nav>
              </Offcanvas.Body>
            </Offcanvas>
            <Nav
              variant="underline"
              className="flex-column m-5"
              onSelect={handleShow}
            >
              <Nav.Item className="d-inline-flex">
                <Nav.Link className="filter-decoration" eventKey="Research Group">
                  By Research Group
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="d-inline-flex">
                <Nav.Link className="filter-decoration" eventKey="Supervisor">
                  By Supervisor
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="d-inline-flex">
                <Nav.Link className="filter-decoration" eventKey="Title">
                  By Title
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="d-inline-flex">
                <Nav.Link className="filter-decoration" eventKey="Subject">
                  By Subject
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col lg={8}>
            {proposals.length == 0?<header style={{textAlign:'center'}}>
                  <h2 className="border-thesis-title">
                    No Matches Found
                  </h2>
                </header>:<></>}
            {degree === 'All' ? proposals.map((e) => (
              <div key={e.id} className="thesis-section">
                <header>
                  <h2 className="border-thesis-title">
                    <Nav.Link href={`/proposalpage/${e.id}`}>{e.title}</Nav.Link>
                  </h2>
                </header>
                <div>
                  <div>
                    <p>{e.description}</p>
                    <p>
                      <a className="border-thesis-view" href={`/proposalpage/${e.id}`}>VIEW</a>
                    </p>
                  </div>
                </div>
              </div>
            )) :
              proposals.filter(e => e.level === degree).map((e) => (
                <div key={e.id} className="thesis-section">
                  <header>
                    <h2 className="border-thesis-title">
                      <Nav.Link href={`/proposalpage/${e.id}`}>{e.title}</Nav.Link>
                    </h2>
                  </header>
                  <div>
                    <div>
                      <p>{e.description}</p>
                      <p>
                        <a className="border-thesis-view" href={`/proposalpage/${e.id}`}>VIEW</a>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            }
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ThesisList;
