import React, { useContext, useState } from "react";
import { Container, Row, Nav, NavDropdown, Col } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../core/store/Provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import ReactSwitch from "react-switch";

function MyNavbar() {
  const store = useContext(StoreContext);
  const [showVClock, setShowVClock] = useState(false);
  return (
    <Container className="nav-wrap" fluid>
      <div
        className="clock-toggle text-center"
        onClick={() => {
          setShowVClock((v) => !v);
        }}
      >
        <FontAwesomeIcon
          icon={faClockRotateLeft}
          style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}
        />
      </div>
      {showVClock && (
        <div className="virtual-clock">
          <input
            type="datetime-local"
            name="datetime"
            style={{ border: "none", margin: "0.3rem", marginBottom: "0.0rem" }}
            onChange={(e) => {
              store.setVirtualClock(e.target.value);
            }}
            value={store.time?.toISOString().slice(0, 16)}
          />
          <p style={{ fontSize: "10px", marginLeft: "0.5rem", color: "#555" }}>
            Virtual Clock
          </p>
        </div>
      )}
      <Row className="upper-nav ">
        <Col
          lg={{ span: 4, offset: 8 }}
          className="d-flex justify-content-end align-items-center px-5"
        >
          <ReactSwitch className="switch"
            onChange={store.toggleTheme} 
            checked={store.theme === 'dark'}
            onColor="#37416D"
            offColor="#fc7a08"
            onHandleColor="#9A74AB"
          >
          </ReactSwitch>
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
          {store.theme === 'light'?
          <a style={{ marginLeft: "5%" }} href="/">
            <img
              className="my-2"
              width={"35%"}
              src="../../images/logo_blu.png"
            />
          </a>
          :
          <a style={{ marginLeft: "5%" }} href="/">
            <img
              className="my-2"
              width={"35%"}
              src="../../images/logo_bianco.png"
            />
          </a>}
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
                <div className="d-flex">
                  <Nav.Link
                    style={{ marginLeft: "30px" }}
                    className=" mx-4 nav-white-link"
                    href="/my-applications"
                  >
                    MY APPLICATIONS
                  </Nav.Link>

                  <Nav.Link className="d-inline-flex nav-white-link" href="/">
                    THESES
                  </Nav.Link>
                </div>
              )}{" "}
              {store?.user?.type === "professor" && (
                <div className="d-flex ">
                  <Nav.Link
                    style={{ marginLeft: "30px" }}
                    className="nav-white-link  mx-4"
                    href="/thesis-proposals"
                  >
                    MY PROPOSALS
                  </Nav.Link>
                  <Nav.Link
                    className="nav-white-link mx-4"
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
