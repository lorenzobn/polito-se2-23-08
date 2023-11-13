import React from "react";
import MyNavbar from "./Navbar";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Stack from 'react-bootstrap/Stack'

function ThesisList(props) {

    return (
        <>
        <MyNavbar></MyNavbar>
      
            <Container fluid  className="border-thesis-div" style={{paddingTop:'10%'}}> 
                <Row>
                    <Col className="border-thesis-div" md={{span:9, offset:3}}>
                        <Col lg={3}>
                        <h1 className="border-thesis-row">type + search</h1>
                        </Col>
                       
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2>order by</h2>
                    </Col>
                    <Col lg={9}>
                        <div className="my-4 border-thesis-row">
                            <header >
                                <h2>Schools, Departments &amp; the College</h2>
                            </header>
                            <div >
                                <div >
                                    <p>Across MIT, faculty help set the global standard of excellence in their disciplines: They are pioneering scholars who love to teach. Deeply engaged in practice, they&nbsp;topple conventional walls between fields in the push for deeper understanding and fresh ideas. In fact, many&nbsp;faculty&nbsp;actively work in at least one of MIT’s&nbsp;interdisciplinary labs, centers, initiatives, and institutes that target crucial challenges, from <a href="http://energy.mit.edu/" target="_blank">clean energy</a> to <a href="https://ki.mit.edu/" target="_blank">cancer</a>.</p>
                                    <p>The MIT Schwarzman College of Computing, opened in fall 2019, is a cross-cutting entity with education and research links across all five schools.</p>
                                    <p><a  href="/education/schools-and-departments/">Explore Departments</a></p>
                                </div>
                            </div>
                        </div>
                        <div className="my-4 border-thesis-row">
                            <header >
                                <h2>Schools, Departments &amp; the College</h2>
                            </header>
                            <div >
                                <div >
                                    <p>AAAAAAAAAAAAAAAAAAAAAThey are pioneering scholars who love to teach. Deeply engaged in practice, they&nbsp;topple conventional walls between fields in the push for deeper understanding and fresh ideas. In fact, many&nbsp;faculty&nbsp;actively work in at least one of MIT’s&nbsp;interdisciplinary labs, centers, initiatives, and institutes that target crucial challenges, from <a href="http://energy.mit.edu/" target="_blank">clean energy</a> to <a href="https://ki.mit.edu/" target="_blank">cancer</a>.</p>
                                    <p>The MIT Schwarzman College of Computing, opened in fall 2019, is a cross-cutting entity with education and research links across all five schools.</p>
                                    <p><a  href="/education/schools-and-departments/">Explore Departments</a></p>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>    
        </>
    )
}

export default ThesisList