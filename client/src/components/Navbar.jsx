import React, { useContext } from "react";
import { Container, Row, Nav, NavDropdown, Col } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../core/store/Provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

function MyNavbar() {
  const store = useContext(StoreContext);

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
                onClick={() => {
                  store.login();
                }}
              ></Button>
            </div>
          )}{" "}
          {store.user.authenticated && (
            <>
              <div style={{ color: "white", fontSize: "120%" }}>
                {`${store.user.id}`}
              </div>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <div style={{ color: "white", fontSize: "120%" }}>
                {`${store.user.name} ${store.user.surname}`}
              </div>
              &nbsp;&nbsp;&nbsp;&nbsp;
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
                <NavDropdown.Item
                  onClick={() => {
                    store.logout();
                  }}
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </>
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
              {store.user.role === "" && <div>&nbsp;</div>}
              {store?.user?.type === "student" && (
                <div className="d-flex ">
                  <Nav.Link
                    style={{ marginLeft: "30px" }}
                    className="text-white mx-4"
                    href="/my-applications"
                  >
                    MY APPLICATIONS
                  </Nav.Link>

                  <Nav.Link className="d-inline-flex text-white" href="/">
                    THESES
                  </Nav.Link>
                </div>
              )}{" "}
              {store?.user?.type === "professor" && (
                <div className="d-flex ">
                  <Nav.Link
                    style={{ marginLeft: "30px" }}
                    className="text-white  mx-4"
                    href="/thesis-proposals"
                  >
                    MY PROPOSALS
                  </Nav.Link>
                  <Nav.Link
                    className="text-white"
                    href="/received-applications"
                  >
                    APPLICATIONS
                  </Nav.Link>
                </div>
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
