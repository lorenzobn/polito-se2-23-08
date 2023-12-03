import React, { useEffect, useContext, useState } from "react";
import MyNavbar from "./Navbar";
import {
  Row,
  Col,
  Stack,
  Nav,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  Offcanvas,
  Badge,
  Accordion,
} from "react-bootstrap";
import Button from "./Button";
import {
  faAngleDown,
  faBackward,
  faMagnifyingGlass,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { StoreContext } from "../core/store/Provider";
import { stagger, useAnimate, usePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFetcher } from "react-router-dom";

function ThesisList(props) {
  const store = useContext(StoreContext);
  const [proposals, setProposals] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [degree, setDegree] = useState("All");
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState("");
  const [resGroups, setResGroups] = useState([]);
  const [cosupervisors, setCosupervisors] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [search, setSearch] = useState(false);
  const [filterTags, setFilterTags] = useState([]);
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();
  const [scopeDegree, animateDegree] = useAnimate();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);

  useEffect(() => {
    const handleEffect = async () => {
      const proposals = await store.getProposals();
      setProposals(proposals);
    };
    const enterAnimation = async () => {
      await animate(
        ".thesis-section",
        { opacity: [0, 1] },
        { duration: 0.4, delay: stagger(0.4) }
      );
    };
    handleEffect().then(enterAnimation);
  }, []);

  useEffect(() => {
    const filterFun = async () => {
      const proposals = await store.getProposals();
      const filteredProposals = proposals.filter((e) => {
        return filterTags.every((cond) => {
          if (cond.type === "Research Group") {
            return e.cod_group === cond.id;
          } else if (cond.type === "Supervisor") {
            return e.supervisor_id === cond.id;
          } else if (cond.type === "Programme") {
            return e.programme === cond.id;
          } else if (cond.type === "Status") {
            return e.status === cond.id;
          }
        });
      });
      setProposals(filteredProposals);
    };
    filterFun();
  }, [filterTags]);

  const handleClose = () => setShow(false);
  const handleShow = (filter) => {
    setFilter(filter);
    if (filter === "Research Group")
      store.getAllGroups().then((res) => {
        setResGroups(res);
        setShow(true);
      });
    else if (filter === "Supervisor")
      store.getCoSupervisors().then((res) => {
        setCosupervisors(res);
        setShow(true);
      });
    else if (filter === "Programme")
      store.getAllProgrammes().then((res) => {
        setProgrammes(res);
        setShow(true);
      });

    setShow(true);
  };

  const handleSearch = () => {
    setSearch(true);
    store.searchProposal(keyword).then((res) => setProposals(res));
  };

  const handleReset = () => {
    setFilterTags([]);
    setKeyword("");
    setSearch(false);
    setIsOpen(false);
    setIsOpen2(false);
    setIsOpen3(false);
    setDegree("All");
    store.getProposals().then((res) => setProposals(res));
  };

  const handleFilter = (ev) => {
    let res;
    const obj = JSON.parse(ev);
    if (filter === "Research Group") {
      res = { id: obj.cod_group, type: "Research Group", name: obj.name };
    } else if (filter === "Supervisor") {
      res = {
        id: obj.id,
        type: "Supervisor",
        name: obj.surname + " " + obj.name,
      };
    } else if (filter === "Programme") {
      res = { id: obj.cod_degree, type: "Programme", name: obj.cod_degree };
    } else if (filter === "Status") {
      res = { id: obj, type: "Status", name: obj };
    }
    setSearch(true);
    if (!filterTags.some((e) => e.id === res.id)) {
      setFilterTags([...filterTags, res]);
    }
    handleClose();
  };

  const handleKeyDown = (ev) => {
    if (ev.keyCode == 13) {
      ev.preventDefault();
      handleSearch();
    }
  };

  useEffect(() => {
    animateDegree("#arrow", { rotate: isOpen ? 180 : 0 }, { duration: 0.2 });
    animateDegree("#arrow2", { rotate: isOpen2 ? 180 : 0 }, { duration: 0.2 });
    animateDegree("#arrow3", { rotate: isOpen3 ? 180 : 0 }, { duration: 0.2 });
  }, [isOpen, isOpen2, isOpen3]);

  return (
    <>
      <MyNavbar></MyNavbar>
      <Container fluid>
        <Row
          style={{ maxHeight: "2rem" }}
          className="justify-content-between align-content-center thesis-form-section my-2"
        >
          {search === true && (
            <Stack
              className=" d-flex justify-content-center"
              direction="horizontal"
              gap={2}
            >
              {filterTags.map((el, index) => (
                <Badge
                  key={index}
                  pill
                  style={{
                    fontSize: "90%",
                    backgroundColor: "RGBA(252, 122, 8, 1) !important",
                  }}
                >
                  {el.name}
                </Badge>
              ))}
            </Stack>
          )}
        </Row>
        <Row className="border-thesis-div">
          <Col lg={2} className="d-flex border-thesis-filter">
            <Offcanvas
              show={show}
              onHide={handleClose}
              data-theme={store.theme}
            >
              <Offcanvas.Header className="justify-content-between" closeButton>
                <Offcanvas.Title as="h2">{filter}</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav
                  variant="underline"
                  className="flex-column m-5 justify-content-center"
                  onSelect={handleFilter}
                >
                  {filter === "Research Group" &&
                    resGroups.map((e) => (
                      <Nav.Item className="d-inline-flex" key={e.cod_group}>
                        <Nav.Link
                          className="filter-decoration"
                          eventKey={JSON.stringify(e)}
                        >
                          {e.cod_department} - {e.name}
                        </Nav.Link>
                      </Nav.Item>
                    ))}
                  {filter === "Supervisor" &&
                    cosupervisors.map((e) => (
                      <Nav.Item className="d-inline-flex" key={e.id}>
                        <Nav.Link
                          className="filter-decoration"
                          eventKey={JSON.stringify(e)}
                        >
                          {e.surname}&nbsp;&nbsp;{e.name}
                        </Nav.Link>
                      </Nav.Item>
                    ))}
                  {filter === "Programme" &&
                    programmes.map((e) => (
                      <Nav.Item className="d-inline-flex" key={e.cod_degree}>
                        <Nav.Link
                          className="filter-decoration"
                          eventKey={JSON.stringify(e)}
                        >
                          {e.cod_degree} - {e.title_degree}
                        </Nav.Link>
                      </Nav.Item>
                    ))}
                  {filter === "Status" && (
                    <>
                      <Nav.Item className="d-inline-flex">
                        <Nav.Link
                          className="filter-decoration"
                          eventKey={JSON.stringify("active")}
                        >
                          Active
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="d-inline-flex">
                        <Nav.Link
                          className="filter-decoration"
                          eventKey={JSON.stringify("archived")}
                        >
                          Archived
                        </Nav.Link>
                      </Nav.Item>
                    </>
                  )}
                </Nav>
              </Offcanvas.Body>
            </Offcanvas>
            <Stack>
              <Form className="mt-4">
                <Row style={{height:'5.5rem'}}> 
                  <Col style={{ paddingLeft:'10px' }} className="d-flex align-items-center ms-5" lg={8}>
                    <Form.Control
                      type="text"
                      placeholder="Search"
                      onChange={(ev) => {
                        setKeyword(ev.target.value);
                      }}
                      onKeyDown={handleKeyDown}
                      value={keyword}
                    />
                  </Col>
                  <Col className="d-flex flex-column justify-content-center" lg={2}>
                    <div className="search-icons">
                      <div className="search-icon" onClick={handleSearch}>
                        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                      </div>
                      {search ? (
                        <div className="search-icon" onClick={handleReset}>
                          <FontAwesomeIcon icon={faBackward}></FontAwesomeIcon>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </Col>
                </Row>
              </Form>
              <Nav
                ref={scopeDegree}
                variant="underline"
                className="flex-column m-5"
                onSelect={handleShow}
              >
                <Nav.Item className="d-flex">
                  <Nav.Link
                    className="wrap-degree"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    Degree Level
                    <div className="angle-degree">
                      <FontAwesomeIcon
                        id="arrow"
                        icon={faAngleDown}
                      ></FontAwesomeIcon>
                    </div>
                  </Nav.Link>
                </Nav.Item>
                {isOpen && (
                  <motion.div
                    style={{ paddingLeft: "1.5rem" }}
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    exit={{ opacity: 0 }}
                  >
                    <Nav.Item className="d-flex">
                      <Nav.Link
                        className="filter-decoration"
                        onClick={() => setDegree("All")}
                        active={degree === "All"}
                      >
                        All
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="d-flex">
                      <Nav.Link
                        className="filter-decoration"
                        onClick={() => setDegree("BSc")}
                        active={degree === "BSc"}
                      >
                        Bachelor
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="d-flex">
                      <Nav.Link
                        className="filter-decoration"
                        onClick={() => setDegree("MSc")}
                        active={degree === "MSc"}
                      >
                        Master
                      </Nav.Link>
                    </Nav.Item>
                  </motion.div>
                )}
                <Nav.Item className="d-flex">
                  <Nav.Link
                    className="filter-decoration"
                    onClick={() => {
                      setIsOpen2(!isOpen2);
                      setFilter("Status");
                    }}
                  >
                    Status
                    <div className="angle-degree">
                      <FontAwesomeIcon
                        id="arrow2"
                        icon={faAngleDown}
                      ></FontAwesomeIcon>
                    </div>
                  </Nav.Link>
                </Nav.Item>
                {isOpen2 && (
                  <motion.div
                    style={{ paddingLeft: "1.5rem" }}
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    exit={{ opacity: 0 }}
                  >
                    <Nav.Item className="d-flex">
                      <Nav.Link
                        className="filter-decoration"
                        onClick={() => handleFilter(JSON.stringify("active"))}
                      >
                        Active
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="d-flex">
                      <Nav.Link
                        className="filter-decoration"
                        onClick={() => handleFilter(JSON.stringify("archived"))}
                      >
                        Archived
                      </Nav.Link>
                    </Nav.Item>
                  </motion.div>
                )}
                <Nav.Item className="d-flex">
                  <Nav.Link
                    className="wrap-degree"
                    onClick={() => setIsOpen3(!isOpen3)}
                  >
                    Filter By
                    <div className="angle-degree">
                      <FontAwesomeIcon
                        id="arrow3"
                        icon={faAngleDown}
                      ></FontAwesomeIcon>
                    </div>
                  </Nav.Link>
                </Nav.Item>
                {isOpen3 && (
                  <motion.div
                    style={{ paddingLeft: "1.5rem" }}
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    exit={{ opacity: 0 }}
                  >
                    <Nav.Item className="d-flex">
                      <Nav.Link
                        className="filter-decoration"
                        eventKey="Research Group"
                      >
                        Research Group
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="d-flex">
                      <Nav.Link
                        className="filter-decoration"
                        eventKey="Supervisor"
                      >
                        Supervisor
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="d-flex">
                      <Nav.Link
                        className="filter-decoration"
                        eventKey="Programme"
                      >
                        Programme
                      </Nav.Link>
                    </Nav.Item>
                  </motion.div>
                )}
              </Nav>
            </Stack>
          </Col>
          <Col lg={8} ref={scope}>
            {proposals.length == 0 ? (
              <header style={{ textAlign: "center" }}>
                <h2 className="border-thesis-title">No Matches Found</h2>
              </header>
            ) : (
              <></>
            )}
            {degree === "All"
              ? proposals.map((e) => (
                  <div key={e.id} className="thesis-section">
                    <header>
                      <h2 className="border-thesis-title">
                        <Nav.Link href={`/proposalpage/${e.id}`}>
                          {e.title}
                        </Nav.Link>
                      </h2>
                    </header>
                    <div>
                      <div>
                        <p>{e.description}</p>
                        <p>
                          <a
                            className="border-thesis-view"
                            href={`/proposalpage/${e.id}`}
                          >
                            VIEW
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              : proposals
                  .filter((e) => e.level === degree)
                  .map((e) => (
                    <div key={e.id} className="thesis-section">
                      <header>
                        <h2 className="border-thesis-title">
                          <Nav.Link href={`/proposalpage/${e.id}`}>
                            {e.title}
                          </Nav.Link>
                        </h2>
                      </header>
                      <div>
                        <div>
                          <p>{e.description}</p>
                          <p>
                            <a
                              className="border-thesis-view"
                              href={`/proposalpage/${e.id}`}
                            >
                              VIEW
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ThesisList;
