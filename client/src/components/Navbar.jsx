import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Nav, Col, Dropdown as DD } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../core/store/Provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClockRotateLeft,
  faUser,
  faMoon,
  faSun,
  faBell,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import ReactSwitch from "react-switch";
import { motion } from "framer-motion";
import Dropdown from "./Dropdown";

function MyNavbar() {
  const store = useContext(StoreContext);
  const [showVClock, setShowVClock] = useState(false);
  const [midHeaderHeight, setMidHeaderHeight] = useState("300rem");
  const [showNotifications, setShowNotifications] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      let y = 150 - window.scrollY;
      if (y < 0) y = 0;
      y = y + 150;
      setMidHeaderHeight(`${y}rem`);
    };
    window.addEventListener("scroll", handleScroll);
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const moon = (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "28px",
        width: "33px",
        scale: "120%",
      }}
    >
      <FontAwesomeIcon style={{ color: "#ffffff" }} icon={faMoon} />
    </div>
  );
  const sun = (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "28px",
        width: "33px",
        scale: "120%",
      }}
    >
      <FontAwesomeIcon style={{ color: "#ffffff" }} icon={faSun} />
    </div>
  );
  return (
    <Container className="nav-wrap" fluid>
      {showNotifications && (
        <div
          style={{
            position: "fixed",
            backgroundColor: "black",
            height: "100%",
            width: "100%",
            zIndex: "10",
            opacity: "0.3",
            left: "0",
          }}
          onClick={() => {
            setShowNotifications(false);
          }}
        ></div>
      )}
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
          <ReactSwitch
            className="switch"
            onChange={store.toggleTheme}
            checked={store.theme === "dark"}
            onColor="#00284b"
            offColor="#fc7a08"
            checkedIcon={moon}
            uncheckedIcon={sun}
            handleDiameter={20}
          ></ReactSwitch>
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
              <div className="d-flex justify-content-between align-items-center">
                <div className="mx-2 ">
                  <DD
                    onClick={() => {
                      setShowNotifications((state) => !state);
                    }}
                  >
                    <DD.Toggle variant="" id="dropdown-basic">
                      <FontAwesomeIcon
                        style={{ fontSize: "140%" }}
                        icon={faBell}
                        className={
                          store.user?.notifications?.length > 0
                            ? "bell-active"
                            : "bell-passive"
                        }
                        role="button"
                      />{" "}
                    </DD.Toggle>

                    <DD.Menu
                      style={{
                        width: "25rem",
                        marginLeft: "-200px",
                        border: "none",
                        zIndex: "100",
                        backgroundColor: "#fbfbfb00",
                      }}
                    >
                      {store.user?.notifications?.length == 0 && (
                        <small
                          className="mx-3"
                          style={{
                            backgroundColor: "#fefefe",
                            padding: "1rem",
                            paddingRight: "15rem",
                          }}
                        >
                          No notifications
                        </small>
                      )}{" "}
                      {store.user?.notifications?.map((notif, id) => {
                        return (
                          <DD.Item
                            key={id}
                            style={{
                              padding: "0px",
                              borderBottom: "2px solid #e5e5e5",
                              backgroundColor: "#fbfbfb",
                            }}
                          >
                            <div
                              className="d-flex justify-content-between align-items-center"
                              style={{
                                height: "30px",
                                padding: "1rem",
                                borderBottom: "1px solid #e5e5e5",
                                backgroundColor: "#f5f5f5",
                              }}
                            >
                              <div
                                style={{
                                  margin: "0px",
                                  fontWeight: "800",
                                  color: "#555",
                                  maxwidth: "22rem",
                                }}
                              >
                                {notif.title}
                              </div>
                              <div>
                                <FontAwesomeIcon
                                  icon={faCircleXmark}
                                  role="button"
                                  onClick={() => {
                                    store.markNotificationAsSeen(notif.id);
                                  }}
                                />
                              </div>
                            </div>

                            <div
                              style={{
                                paddingLeft: "1rem",
                                paddingRight: "1rem",
                                color: "#777",
                                fontSize: "12px",
                                maxWidth: "25rem",
                                lineHeight: "1.5",
                                whiteSpace: "wrap",
                                marginTop: "8px",
                                marginBottom: "8px",
                              }}
                            >
                              {notif.message}
                            </div>
                          </DD.Item>
                        );
                      })}
                    </DD.Menu>
                  </DD>
                </div>

                <div
                  style={{ color: "white", fontSize: "120%" }}
                  className="mx-2"
                >
                  {`${store.user.id}`}
                </div>
                <div
                  className="mx-3"
                  style={{
                    color: "white",
                    fontSize: "20px",
                    fontWeight: "100",
                  }}
                >
                  {`${store.user.name} ${store.user.surname}`}
                </div>
                <Dropdown className="mx-2"></Dropdown>
              </div>
            </>
          )}
        </Col>
      </Row>
      <Row className="mid-nav">
        <Col className="d-flex align-items-center justify-content-start">
          {store.theme === "light" ? (
            <a style={{ marginLeft: "5%" }} href="/">
              <motion.img
                style={{ minWidth: "20%" }}
                className="my-2"
                width={midHeaderHeight}
                src="../../images/logo_blu.png"
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            </a>
          ) : (
            <a style={{ marginLeft: "5%" }} href="/">
              <motion.img
                style={{ minWidth: "20%" }}
                className="my-2"
                width={midHeaderHeight}
                src="../../images/logo_bianco.png"
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            </a>
          )}
        </Col>
        <Col className="d-flex align-items-center justify-content-center">
          <div>
            <h1 style={{ fontSize: "250%", margin: "0" }}>THESIS@POLITO</h1>
          </div>
        </Col>
      </Row>
      <Row className="lower-nav align-items-center">
        <Col className="d-flex justify-content-around">
          <div style={{ lineHeight: "200%" }}>
            <Nav className="ps-4" variant="underline">
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
