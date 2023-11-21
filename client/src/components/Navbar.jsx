import React, { useContext } from "react";
import { Container, Row, Nav, NavDropdown, Col } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../core/store/Provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import politoImg from "../../images/polito.jpeg";
function MyNavbar() {
  const store = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <Container className="nav-wrap" fluid>
      <Row className="upper-nav ">
        <Col
          lg={{ span: 4, offset: 8 }}
          className="d-flex justify-content-end align-items-center px-5"
        >
          {!store.user.authenticated && (
            <div>
              {" "}
              <Button
                text={"Login"}
                icon={faUser}
                onClick={() => navigate("/login")}
              ></Button>
            </div>
          )}{" "}
          {store.user.authenticated && (
            <NavDropdown
              title={
                <FontAwesomeIcon
                  style={{ color: "white", fontSize: "24px" }}
                  icon={faUser}
                />
              }
              className="mr-5"
            >
              <NavDropdown.Item href="/portal">My Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/portal">Settings</NavDropdown.Item>
              <NavDropdown.Item >Logout</NavDropdown.Item>
            </NavDropdown>
          )}
        </Col>
      </Row>
      <Row className="mid-nav align-items-around">
        <Col>
          <a style={{ marginLeft: "5%" }} href="/">
            <img
              className="my-2"
              width={"35%"}
              src="../../images/polito_logo_2021_blu.jpg"
            />
          </a>
        </Col>
        <Col>
          <div className="d-flex justify-content-center mt-4 pr-5  mr-5">
            <h1 style={{ fontSize: "350%" }}>THESIS@POLITO</h1>
          </div>
        </Col>
      </Row>
      <Row className="lower-nav align-items-center">
        <Col className="d-flex justify-content-around">
          <div style={{ lineHeight: "200%" }}>
            <Nav variant="underline">
              {store.user.type === "student" ? (
                <Nav.Link className="d-inline-flex text-white" href="/thesis-proposals">
                  THESIS
                </Nav.Link>
              ) : (
                <Nav.Link className="text-white" href="/received-applications">
                  APPLICATIONS
                </Nav.Link>
              )}
              {store.user.type === "student" ? (
                <Nav.Link
                  style={{ marginLeft: "30px" }}
                  className="text-white"
                  href="/my-applications"
                >
                  MY APPLICATIONS
                </Nav.Link>
              ) : (
                <Nav.Link
                  style={{ marginLeft: "30px" }}
                  className="text-white"
                  href="/my-thesis-proposals"
                >
                  MY PROPOSALS
                </Nav.Link>
              )}
            </Nav>
          </div>
        </Col>
        <Col className="d-flex justify-content-end"></Col>
      </Row>
    </Container>
  );
}

export default observer(MyNavbar);
