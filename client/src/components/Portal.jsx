import MyNavbar from './Navbar';
import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../core/store/Provider';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Stack from 'react-bootstrap/Stack'
import Card from 'react-bootstrap/Card'

function Portal() {
    const store = useContext(StoreContext)

    return (
        <div>
            <MyNavbar></MyNavbar>
            <Container className='my-5'>
                <Row>
                    <Col>
                        <Card style={{ width: '20rem'}}>
                            <Card.Img variant="top" src="../../images/user-default.png" />
                            <Card.Body>
                                <Card.Title>Name Surname</Card.Title>
                                <Card.Text>
                                Some quick example text to build on the card title and make up the
                                bulk of the card's content. (User Info)
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={8}>
                        <Stack gap={3}>
                            {store.user.type === 'student'? <><div>
                                <Card>
                                    <Card.Header>WIDGET 1</Card.Header>
                                    <Card.Body>
                                        <Card.Title>My Thesis</Card.Title>
                                        <Card.Text>
                                            My active thesis
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>
                            <div>
                                <Card>
                                    <Card.Header>WIDGET 2</Card.Header>
                                    <Card.Body>
                                        <Card.Title>Suggested for you</Card.Title>
                                        <Card.Text>
                                            Suggested thesis based on user's parameters
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </div></>  : 
                                <div>
                                <Card>
                                    <Card.Header>WIDGET 3</Card.Header>
                                    <Card.Body>
                                        <Card.Title>My Active Proposals</Card.Title>
                                        <Card.Text>
                                            Currently active proposals 
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>
                            }
                        </Stack>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default observer(Portal)