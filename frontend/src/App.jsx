import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Portal from './components/Portal';
import './assets/bootstrap.css';
import './App.css'

import InsertProposal from './components/InsertProposal';
import ThesisList from './components/ThesisList';
import ProposalPage from './components/ProposalPage';
import MyProposals from './components/MyProposals';
import Applications from './components/Applications';
import AcceptApplications from './components/AcceptApplication';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<></>}></Route>
        <Route path='/portal' element={<Portal></Portal>}></Route>
        <Route path='/thesis' element={<ThesisList></ThesisList>}></Route>
        <Route path='/insertProposal' element={<InsertProposal></InsertProposal>}></Route>
        <Route path='/proposalpage' element={<ProposalPage></ProposalPage>}></Route>
        <Route path='/applications' element={<Applications></Applications>}></Route>
        <Route path='/applications/acceptApplication' element={<AcceptApplications></AcceptApplications>}></Route>
        <Route path='/myProposals' element={<MyProposals></MyProposals>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
