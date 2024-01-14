import React, { useEffect, useState, useContext } from "react";
import MyNavbar from "./Navbar";
import {
  Row,
  Col,
  Nav,
  Container,
  Stack,
  Dropdown,
  DropdownButton,
  Form,
  Badge,
} from "react-bootstrap";
import Button from "./Button";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { StoreContext } from "../core/store/Provider";
import { useAnimate, motion } from "framer-motion";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Applications() {
  const store = useContext(StoreContext);
  const [applications, setApplications] = useState([]);
  const [applicationsFiltered, setApplicationsFiltered] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    // since the handler function of useEffect can't be async directly
    // we need to define it separately and run it
    // here I check the localStorage for userType, then in the request the cookie brings the authentication token
    const handleEffect = async () => {
      let s = await store.fetchSelf();
      if (store.user.type === "student") {
        let applicationsRes = await store.getMyApplications();
        const now = await store.getVirtualClockValue();
        applicationsRes = applicationsRes.filter(
          (a) => new Date(a.deadline) > new Date(now)
        );
        setApplications(applicationsRes);
        setApplicationsFiltered(applicationsRes);
      }
      if (store.user.type === "professor") {
        let applicationsRes = await store.getReceivedApplications();
        const now = await store.getVirtualClockValue();
        applicationsRes = applicationsRes.filter(
          (a) => new Date(a.deadline) > new Date(now)
        );
        setApplications(applicationsRes);
        setApplicationsFiltered(applicationsRes);
      }
    };
    handleEffect();
  }, [store.user.type]);

  useEffect(() => {
    if (scope.current)
      animate("#arrow", { rotate: isOpen ? 180 : 0 }, { duration: 0.2 });
  }, [isOpen]);

  const handleFilter = (status) => {
    if (status !== "All") {
      setApplicationsFiltered(() =>
        applications.filter((e) => e.applicationstatus === status)
      );
    } else {
      setApplicationsFiltered(applications);
    }
  };

  return (
    <>
      <MyNavbar></MyNavbar>
      <Container fluid>
        <Row className="justify-content-between thesis-form-section">
          <Col
            className="d-flex justify-content-start"
            lg={{ span: 8, offset: 2 }}
          >
            {store.user.type === "student" ? (
              <h1 className="page-title">MY APPLICATIONS</h1>
            ) : (
              <h1 className="page-title">APPLICATIONS</h1>
            )}
          </Col>
        </Row>
        <Row className="border-thesis-div">
          <Col
            style={{ minWidth: "200px" }}
            xs={2}
            lg={2}
            className="d-flex border-thesis-filter"
          >
            {store.user.type === "student" && (
              <Stack>
                <Nav
                  ref={scope}
                  variant="underline"
                  className="flex-column m-5"
                >
                  <Nav.Item className="d-flex">
                    <Nav.Link
                      className="wrap-degree"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      Filter By
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
                          onClick={() => handleFilter("All")}
                        >
                          All
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="d-flex">
                        <Nav.Link
                          className="filter-decoration"
                          onClick={() => handleFilter("accepted")}
                        >
                          Accepted
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="d-flex">
                        <Nav.Link
                          className="filter-decoration"
                          onClick={() => handleFilter("idle")}
                        >
                          Pending
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="d-flex">
                        <Nav.Link
                          className="filter-decoration"
                          onClick={() => handleFilter("rejected")}
                        >
                          Rejected
                        </Nav.Link>
                      </Nav.Item>
                    </motion.div>
                  )}
                </Nav>
              </Stack>
            )}
          </Col>
          <Col lg={{ span: 8 }}>
            {applicationsFiltered.map((e) => (
              <div key={e.thesis_id} className="thesis-section">
                <header>
                  <h2 className="border-thesis-title">
                    {store.user.type === "professor" ? (
                      <Nav.Link href={`received-applications/${e.thesis_id}`}>
                        {e.title}
                      </Nav.Link>
                    ) : (
                      <Nav.Link href={`proposalpage/${e.thesis_id}`}>
                        {e.title}
                      </Nav.Link>
                    )}
                  </h2>
                </header>
                <div>
                  <div>
                    <p>{e.description}</p>
                    <p>Deadline: {e.deadline.slice(0, 10)}</p>
                    {store.user && store.user.type === "student" ? (
                      <Badge badge-status={e.applicationstatus}>
                        {e.applicationstatus === "idle"
                          ? "Pending"
                          : e.applicationstatus.charAt(0).toUpperCase() +
                            e.applicationstatus.slice(1)}
                      </Badge>
                    ) : (
                      <></>
                    )}
                    {store.user && store.user.type === "professor" ? (
                      <p>
                        <a
                          className="border-thesis-view"
                          href={`received-applications/${e.thesis_id}`}
                        >
                          VIEW APPLICATIONS
                        </a>
                      </p>
                    ) : (
                      <></>
                    )}
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
