import React, { useState, useContext } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { StoreContext } from "../core/store/Provider";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const store = useContext(StoreContext);
  const loginHandler = (e) => {
    e.preventDefault();
    store.login(email, password);
  };

  return (
    <div>
      <Row>
        <Col />
        <Col sm={3}>
          <div className="login-form">
            <div>
              <a href="/">
                <img
                  width={"100%"}
                  src="../../images/polito_logo_2021_blu.jpg"
                  alt="Polito Logo"
                />
              </a>{" "}
            </div>
            <div className="text-center">
              <h4 className="mt-2">Access to Thesis Portal</h4>
            </div>

            <div className="p-4">
              <hr />

              <Form onSubmit={loginHandler}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <hr className="mt-4" />
                <div className="mt-4 text-center">
                  <Button variant="danger" type="submit" className="w-100">
                    Login with Email and Password
                  </Button>
                </div>
                <div className="mt-3 text-center">
                  <Button variant="primary" type="submit" className="w-100">
                    Login with SPID
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Col>
        <Col />
      </Row>
    </div>
  );
}
