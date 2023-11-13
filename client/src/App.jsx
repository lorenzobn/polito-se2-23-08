import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Portal from './components/Portal';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import InsertProposal from './components/InsertProposal';
import ThesisList from './components/ThesisList';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<></>}></Route>
        <Route path='/portal' element={<Portal></Portal>}></Route>
        <Route path='/insertProposal' element={<InsertProposal></InsertProposal>}></Route>
        <Route path='/thesis' element={<ThesisList></ThesisList>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
