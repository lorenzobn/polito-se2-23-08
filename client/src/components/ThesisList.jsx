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
  Badge
} from "react-bootstrap";
import Button from "./Button";
import { faBackward, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { StoreContext } from "../core/store/Provider";

function ThesisList(props) {
  const store = useContext(StoreContext);
  const [proposals, setProposals] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [degree, setDegree] = useState('All')
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState("")
  const [resGroups, setResGroups] = useState([])
  const [cosupervisors, setCosupervisors] = useState([])
  const [programmes, setProgrammes] = useState([])
  const [search, setSearch] = useState(false)
  const [filterTags, setFilterTags] = useState([])

  let counter = 0;
  useEffect(() => {
    // since the handler function of useEffect can't be async directly
    // we need to define it separately and run it
    const handleEffect = async () => {
      const proposals = await store.getProposals();
      setProposals(proposals);
    };
    handleEffect();
  }, []);

  useEffect(() => {
    const filterFun = async () => {
      const proposals = await store.getProposals() 
      const filteredProposals = proposals.filter(e => {
        return filterTags.every(cond => {
          if (cond.type === 'Research Group') {
            return e.cod_group === cond.id
          }
          else if (cond.type === 'Supervisor') {
             return e.supervisor_id === cond.id
          }
          else if (cond.type === 'Programme') { 
             return e.programme === cond.id
          }
          else if (cond.type === 'Status') {
            return e.status === cond.id
          }
      })
    })
    setProposals(filteredProposals)
    };
    filterFun()
  }, [filterTags])

  const handleClose = () => setShow(false);
  const handleShow = (filter) => {
    
    setFilter(filter)
    if (filter === 'Research Group')
      store.getAllGroups().then((res) => {setResGroups(res); setShow(true)})
    else if (filter === 'Supervisor')
    store.getCoSupervisors().then((res) => {setCosupervisors(res); setShow(true)})
    else if (filter === 'Programme')
    store.getAllProgrammes().then((res) => {setProgrammes(res); setShow(true)})

    setShow(true)
  };

  const handleSearch = () => {
    setSearch(true)
    store.searchProposal(keyword).then(res => setProposals(res));
  }

  const handleReset = () => {
    setFilterTags([])
    setSearch(false)
    store.getProposals().then(res => setProposals(res));
  }

  const handleFilter = (ev) => {
  
    let res
    const obj = JSON.parse(ev)
    if (filter === 'Research Group') {
      res = {id:obj.cod_group, type:'Research Group', name:obj.name}
    }
    else if (filter === 'Supervisor') {
      res = {id:obj.id, type:'Supervisor', name:obj.surname+' '+obj.name}
    }
    else if (filter === 'Programme') {
      res = {id:obj.cod_degree, type:'Programme', name:obj.cod_degree}
    }
    else if (filter === 'Status') {
      res = {id:obj, type:'Status', name:obj}
    }
    setSearch(true)
    if (!filterTags.some(e => e.id === res.id)) {
      setFilterTags([...filterTags, res])
    }
    handleClose()
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
                  <Button text={"Search"} icon={faMagnifyingGlass} onClick={handleSearch}></Button>&nbsp;&nbsp;
                  {search === true? <Button text={"Reset"} icon={faBackward} onClick={handleReset}></Button>:<></>}
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        {search === true && <Row style={{marginBottom:'1.5rem'}} className="justify-content-center">
          <Stack className="d-inline-flex justify-content-center" direction="horizontal" gap={2}>
            {filterTags.map(el => <Badge key={counter++} pill style={{fontSize:'90%', backgroundColor:'RGBA(252, 122, 8, 1) !important'}}>{el.name}</Badge>)}
          </Stack>  
        </Row>}
        <Row className="border-thesis-div">
          <Col
            lg={2}
            className="d-flex border-thesis-filter"
          >
            <Offcanvas show={show} onHide={handleClose}>
              <Offcanvas.Header className="justify-content-between" closeButton>
                <Offcanvas.Title as='h2'>{filter}</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav
                variant="underline"
                className="flex-column m-5 justify-content-center"
                onSelect={handleFilter}>
                  {filter === 'Research Group' && resGroups.map(e => <Nav.Item className="d-inline-flex" key={e.cod_group}>
                    <Nav.Link className="filter-decoration" eventKey={JSON.stringify(e)}>{e.cod_department} - {e.name}</Nav.Link>
                    </Nav.Item>)}
                  {filter === 'Supervisor' && cosupervisors.map(e => <Nav.Item className="d-inline-flex" key={e.id}>
                    <Nav.Link className="filter-decoration" eventKey={JSON.stringify(e)}>{e.surname}&nbsp;&nbsp;{e.name}</Nav.Link>
                    </Nav.Item>)}
                  {filter === 'Programme' && programmes.map(e => <Nav.Item className="d-inline-flex" key={e.cod_degree}>
                    <Nav.Link className="filter-decoration" eventKey={JSON.stringify(e)}>{e.cod_degree} - {e.title_degree}</Nav.Link>
                    </Nav.Item>)
                  }
                  {filter === 'Status' && <><Nav.Item className="d-inline-flex">
                    <Nav.Link className="filter-decoration" eventKey={JSON.stringify('active')}>Active</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="d-inline-flex">
                      <Nav.Link className="filter-decoration" eventKey={JSON.stringify('archived')}>Archived</Nav.Link>
                    </Nav.Item></>}  
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
                <Nav.Link className="filter-decoration" eventKey="Programme">
                  By Programme
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="d-inline-flex">
                <Nav.Link className="filter-decoration" eventKey="Status">
                  By Status
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
